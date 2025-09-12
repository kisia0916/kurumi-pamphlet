import { NextRequest, NextResponse } from "next/server";

// プロジェクトの project_genre を英語コード -> 日本語 表記へ一括変換するAPI
// 対応表:
// SHOP -> 販売
// STUDENT -> 生徒企画
// DISPLAY_CHEMISTRY -> 理科展示
// DISPLAY_CULTURE  -> 文化展示
// PERFORMANCE -> 公演
// MUSIC -> 音楽
// FOOD -> 飲食
// ACTIVITY -> 体験
// 既に日本語化済みのものは無視される( count=0 ) ため冪等


const GENRE_MAP: Record<string,string> = {
	SHOP: '販売',
	STUDENT: '生徒企画',
	DISPLAY_CHEMISTRY: '理科展示',
	DISPLAY_CULTURE: '文化展示',
	PERFORMANCE: '公演',
	MUSIC: '音楽',
	FOOD: '飲食',
	ACTIVITY: '体験'
};
const list1 = [
    'SHOP',
    'STUDENT',
    'DISPLAY_CHEMISTRY',
    'DISPLAY_CULTURE',
    'PERFORMANCE',
    'MUSIC',
    'FOOD',
    'ACTIVITY'
]
const list2 = [
    '販売',
    '生徒企画',
    '理科展示',
    '文化展示',
    '公演',
    '音楽',
    '飲食',
    '体験'
]
// GET /api/test?mode=convert-genre で実行 (mode 指定が無い場合は簡易ヘルス)
// dryRun=true を付けると更新せず予定件数のみ返す
export async function GET(req: NextRequest) {
    try{
        // for (const genre of list1){
        //     const data = await prisma.projects.findMany({
        //         where:{
        //             project_genre:genre
        //         }
        //     })
        //     for (const item of data){
        //         await prisma.projects.update({
        //             where:{
        //                 id: item.id
        //             },
        //             data:{
        //                 project_genre: GENRE_MAP[genre]
        //             }
        //         })
        //     }
        // }
        // return NextResponse.json({ message: 'Conversion completed' });
	} catch (e) {
		console.error('convert-genre error', e);
		return NextResponse.json({ error: 'internal_error' }, { status: 500 });
	}
}

// 将来的に POST で個別指定更新など拡張する余地あり
