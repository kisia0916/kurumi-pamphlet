import { connection_db } from "@/lib/astradb"
import { NextRequest, NextResponse } from "next/server"
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

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
      return NextResponse.json({ error: 'no_user_message' }, { status: 400 })
    }

    const db = connection_db()
    const collection = await db.collection("kurumi_data_01");
    const vectorCursor = collection.find(
      {},
      {
        sort: { $vectorize: searchQuery },
        limit: 4,
      },
    );
    let results = [];
    for await (const document of vectorCursor) {
      results.push(document);
    }
    const context = results.map(x => JSON.stringify(x, null, 2)).join("\n---\n");
    const ai_response = await streamText({
      model: openai("gpt-4o-mini"),
      system:`
      あなたは文化祭デジタルパンフレットアプリ専用のAIアシスタントです。

     【重要ルール】
      1. 回答は必ず、ユーザー入力に基づいて vectorDB から取得された JSON データ(context)の内容を根拠として行ってください。
      2. context に存在しない情報については推測せず、「わかりません」「データがありません」などとはっきり答えてください。
      3. 文化祭に関係しない質問には回答せず、「このAIは文化祭に関する質問にのみ回答できます。」と返してください。
      4. context の内容を正確に引用し、丁寧でわかりやすい文章で回答してください。
      5. 最もユーザーの希望に合致するContextのtypeがイベントの場合、場所を答える際は最もユーザーの希望に合致するContextのtypeが企画のものを参考にしてください。
    【目的】
      ユーザーが文化祭の模擬店、食品販売状況、マップ、イベントのタイムテーブルなどを簡単に確認できるようサポートすることです。
    【Context】
      ${context}
      `,
      messages: [
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        { role: "system", content: `Context:\n${context}` },
      ],
    })

    return ai_response.toTextStreamResponse();
    return 
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
