import { connection_db } from "@/lib/astradb"
import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "@/lib/prisma";

type AIResponsePayload = {
  type: string
  delta: string
  project_id?: string[]
  building_id?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const messages = body && Array.isArray(body.messages) ? body.messages : []
    if (messages.length === 0) {
      return NextResponse.json({ error: 'missing_messages' }, { status: 400 })
    }
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()
    const searchQuery = lastUserMessage?.content || ''
    if (!searchQuery) {
      return NextResponse.json({ error: 'no_user_message' }, { status: 401 })
    }
    const  rewriteRes = await generateText({
      model: openai("gpt-4o-mini"),
      system:`
          あなたはユーザーからの入力をベクトル検索用の最適な検索クエリに変換するアシスタントです。" +
        【重要ルール】
          1. ユーザーの質問の意図を正確に把握し、ベクトル検索に必要なキーワードのみ抽出して出力してください。
          2. 名詞だけでなく、固有の名称や固有名詞を優先して抽出してください。
          3. 出力は一文のみ。
          4. 不要な説明や装飾的な言葉は一切含めないでください。
          5. ユーザーの要求がある特定の要素を指定したものでない場合は出力の最後にrandomを追加してください。
          6. 出力にN号館(Nには任意の自然数が入る）という建物の名前を示すキーワードが含まれている場合、Nの部分を漢数字に変換してキーワードを出力してください。
          7. 出力にNルーム(Nには任意の自然数が入る)というクラス名を表すキーワードが含まれている場合[ルーム]の部分を[R]に変換して出力してください。
          8. 出力に全角数字が含まれている場合はすべて半角数字にして出力してください。
        【出力例】
          1. テニス 企画 場所
          2. フードコート 食品 販売時間 random
          3. 三号館 おすすめ random
          4. 301教室　詳細
          5. 46R 詳細
          `
          ,
      messages:[{
        role: "user",
        content: searchQuery,
      },]
    });
    let processed_rewrite:string = rewriteRes.text.trim(); 
     if (rewriteRes.text.trim().includes("random")) {
      processed_rewrite = rewriteRes.text.replace("random", "").trim() + " " + Math.random().toString(36).substring(2, 8);
     }
    //検索
    const projectOr: any[] = [];
    const keywords = processed_rewrite.split(/\s+/).filter(Boolean);
    const normalizedKeywords = keywords.map((k) => k.toLowerCase())

    // AI要約結果からビルディングを検索し、該当があればbuilding_idでの検索条件を追加
    const buildingOr = keywords.map((k) => ({ name: { contains: k, mode: "insensitive" as const } }));
    const matchedBuildings = await prisma.buildings.findMany({
      where: { OR: buildingOr },
      select: {
        id: true,
        name: true,
        index: true,
        picture: true,
        _count: {
          select: {
            floors: true,
            projects: true,
          }
        }
      },
    });
    const rankedBuildings = matchedBuildings
      .map((building) => {
        const searchableFields = [
          building.name,
          String(building.index ?? ""),
        ].map((v) => (v ?? "").toLowerCase())

        const keywordHitCount = normalizedKeywords.reduce((count, keyword) => {
          return searchableFields.some((field) => field.includes(keyword)) ? count + 1 : count
        }, 0)

        const fieldHitCount = searchableFields.reduce((sum, field) => {
          return sum + normalizedKeywords.filter((keyword) => field.includes(keyword)).length
        }, 0)

        return { building, keywordHitCount, fieldHitCount }
      })
      .sort((a, b) => {
        if (b.keywordHitCount !== a.keywordHitCount) {
          return b.keywordHitCount - a.keywordHitCount
        }
        if (b.fieldHitCount !== a.fieldHitCount) {
          return b.fieldHitCount - a.fieldHitCount
        }
        return a.building.name.localeCompare(b.building.name, "ja")
      })
      .map((x) => x.building)

    if (rankedBuildings.length > 0) {
      const buildingIds = rankedBuildings.map((b) => b.id);
      projectOr.push({ building_id: { in: buildingIds } });
    }

    for (const p of keywords) {
        projectOr.push({ name: { contains: p, mode: "insensitive" } });
        projectOr.push({ room_name: { contains: p, mode: "insensitive" } });
        projectOr.push({ project_genre: { contains: p, mode: "insensitive" } });
        projectOr.push({ team_name: { contains: p, mode: "insensitive" } });
    }
    const projects = await prisma.projects.findMany({
      where: { OR: projectOr },
      select: {
        id: true,
        name: true,
        picture: true,
        room_name: true,
        project_genre: true,
        team_name: true,
        floor_id: true,
        building: { select: { id: true, name: true, index: true } },
        floor: { select: { id: true, floor_num: true } }
      }
    })
    // Prioritize projects that match more search keywords.
    const scoredProjects = projects
      .map((project) => {
        const searchableFields = [
          project.name,
          project.room_name,
          project.project_genre,
          project.team_name,
          project.building?.name ?? "",
        ].map((v) => (v ?? "").toLowerCase())

        const keywordHitCount = normalizedKeywords.reduce((count, keyword) => {
          return searchableFields.some((field) => field.includes(keyword)) ? count + 1 : count
        }, 0)

        const fieldHitCount = searchableFields.reduce((sum, field) => {
          return sum + normalizedKeywords.filter((keyword) => field.includes(keyword)).length
        }, 0)

        return { project, keywordHitCount, fieldHitCount }
      })
      .sort((a, b) => {
        if (b.keywordHitCount !== a.keywordHitCount) {
          return b.keywordHitCount - a.keywordHitCount
        }
        if (b.fieldHitCount !== a.fieldHitCount) {
          return b.fieldHitCount - a.fieldHitCount
        }
        return a.project.name.localeCompare(b.project.name, "ja")
      })

    const limitedProjects = scoredProjects.slice(0, 5).map((x) => x.project)
    const db = connection_db()
    const collection = await db.collection("kurumi_data_01");
    const vectorCursor = collection.find(
      {},
      {
        sort: { $vectorize: processed_rewrite },
        limit: 5,
      },
    );
    let results:any[] = [...limitedProjects];
    const vectorDocuments: any[] = []
    for await (const document of vectorCursor) {
      vectorDocuments.push(document)
    }
    const rankedVectorDocuments = vectorDocuments
      .map((doc) => {
        const searchableFields = [
          doc?.name,
          doc?.team_name,
          doc?.description,
          doc?.room_name,
          doc?.project_genre,
          doc?.building_name,
        ].map((v) => (v ?? "").toString().toLowerCase())

        const keywordHitCount = normalizedKeywords.reduce((count, keyword) => {
          return searchableFields.some((field) => field.includes(keyword)) ? count + 1 : count
        }, 0)

        const fieldHitCount = searchableFields.reduce((sum, field) => {
          return sum + normalizedKeywords.filter((keyword) => field.includes(keyword)).length
        }, 0)

        return { doc, keywordHitCount, fieldHitCount }
      })
      .sort((a, b) => {
        if (b.keywordHitCount !== a.keywordHitCount) {
          return b.keywordHitCount - a.keywordHitCount
        }
        if (b.fieldHitCount !== a.fieldHitCount) {
          return b.fieldHitCount - a.fieldHitCount
        }
        return String(a.doc?.name ?? "").localeCompare(String(b.doc?.name ?? ""), "ja")
      })
      .map((x) => x.doc)

    results = [...limitedProjects, ...rankedVectorDocuments]
    // フロア・ビル・食品のステータスを並列取得
    const [floors, buildings, foodStatusRows] = await Promise.all([
      prisma.floor.findMany({
        include: { building: { select: { name: true } } }
      }),
      prisma.buildings.findMany({
        select: {
          name: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { status: true }
          }
        }
      }),
      prisma.foodData.findMany({
        select: { name: true, status: true }
      }),
    ])

    const floorStatusList = floors.map((f) => ({
      building: f.building?.name || "",
      floor: f.floor_num < 0 ? `B${Math.abs(f.floor_num)}階` : `${f.floor_num}階`,
      status: f.status ?? null,
    }))
    const buildingStatusList = buildings.map((b) => ({
      building: b.name,
      status: b.statusHistory?.[0]?.status ?? null,
    }))
    const foodStatusList = foodStatusRows.map(f => ({ name: f.name, status: f.status }))

    const context = [
      ...results.map((x) => JSON.stringify(x, null, 2)),
      JSON.stringify({ type: "Building_card_candidates", data: rankedBuildings }, null, 2),
      JSON.stringify({type:"Floor_Congestion_status",data:floorStatusList}, null, 2),
      JSON.stringify({type:"Building_Congestion_status",buildingStatusList}, null, 2),
      JSON.stringify({type:"Food_sales_situation",foodStatusList}, null, 2),
    ].join("\n---\n");

    const recentMessages = messages

    const ai_response = await generateText({
      model: openai("gpt-4o"),
      system:`
        
      あなたは文化祭デジタルパンフレットアプリ専用のAIアシスタントです。
      JSON形式以外で出力をすることは絶対に禁止です。
      回答は必ず以下の【回答ルール】と【回答の仕方】に従って行ってください。
      ----------------------------------------------------------
      【回答ルール】
      あなたは必ず JSON オブジェクトを順番に出力します。
      JSON形式以外で出力をすることは絶対に禁止です。
      フォーマットは以下の2つのどちらかです

      1. 文章を送るとき（ユーザーに表示する文章）：
      {"type": "text","delta": "<文章の断片>"}

      2. カード表示用IDをメッセージと一緒に送るとき：
      {"type": "text","delta": "<文章の断片>","project_id": ["<id1>", "<id2>", ...],"building_id": ["<bid1>", "<bid2>", ...]}

      注意：
      - 無駄な改行を含まずに出力
      - 上記以外のフィールドを追加してはならない。
      - project_idは必要ない場合は空配列にしてください
      - building_idは必要ない場合は空配列にしてください
      - textにはユーザーに伝えるべきレスポンスを入れて一回のみ送信すること。

      ----------------------------------------------------------
      【文化祭アシスタントとしての回答ルール】
      1. 回答の際は、与えられた Context の中から、スコアにかかわらず
      「ユーザーの希望に最も合致する情報」を根拠として回答してください。

      2. ユーザーからのインプットに対応する企画が存在する場合はproject_id、建物が存在する場合はbuilding_idをレスポンスと一緒に指定フォーマットで送信してください。

      2. 回答は必ず、ユーザー入力に基づいてContext内のJSONデータの内容を根拠として行ってください。

      4. Context に存在しない情報については推測せず、
      「わかりません」「データがありません」などと明確に答えてください。

      5. 文化祭に関係しない質問には回答せず、
      {"type":"text","delta":"このAIは文化祭に関する質問にのみ回答できます。","project_id":[],"building_id":[]}
      のように回答してください。

      6. Context の内容は正確に引用し、
      丁寧でわかりやすいかつ一般的に理解可能な文章で、回答してください。

      7. 最もユーザーの希望に合致する Context の type がイベントの場合、
      場所を答える際は、最もユーザーの希望に合致する type が企画のものを参考にしてください。

      8. Context 情報の優先度は以下の順とします：
          1. name
          2. team_name
          3. description
      9. jsonのdeltaに含める文章余計な装飾はせずに170文字以内に極力抑えてください。
      10. Contextには各建物と各フロアのリアルタイムの混雑状況データも含まれています。ユーザーへの提案などの際に必要に応じて利用してください。
      11. Contextには食品のリアルタイムの販売状況も含まれています。ユーザーへの提案などの際に必要に応じて利用してください。
      12. 参照した企画が複数ある場合はproject_idにすべての該当企画IDを、参照した建物が複数ある場合はbuilding_idにすべての該当建物IDを配列形式で含めてください。
      13. project_idとbuilding_idを同時に含めてはなりません。両方該当する場合は必ずproject_idのみを返してください（project優先）。

      ----------------------------------------------------------
      【回答の仕方】
      あなたは回答をJSON形式で送ってください。
      また必要に応じてproject_idとbuilding_id付きのJSONを送信してください。
      例1.
      {"type":"text","delta":"〜文章1〜","project_id":["xxxxxx","yyyyyy"],"building_id":["bbbbbb"]}
      例2.
      {"type":"text","delta":"〜文章1〜","project_id":[],"building_id":[]}
      【Context】
      ${context}
      JSON形式以外で出力をすることは絶対に禁止です。
      `,
      messages: recentMessages,
    })

    const convert_responses: AIResponsePayload = JSON.parse(ai_response.text)

    const projectIds = Array.from(new Set((convert_responses.project_id ?? []).filter(Boolean)))
    const buildingIds = Array.from(new Set((convert_responses.building_id ?? []).filter(Boolean)))
    const jsonCards = projectIds.length > 0
      ? projectIds.map((pid: string) => ({ type: 'project', project_id: pid }))
      : buildingIds.map((bid: string) => ({ type: 'building', building_id: bid }))

    return NextResponse.json({ message:convert_responses.delta, json: jsonCards,norm_text:ai_response.text }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
