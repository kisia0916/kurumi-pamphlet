import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface StatusData {
  status: 'hard' | 'middle' | 'empty';
  building_id: string;
}

export async function insertBuildingStatusFromJson(): Promise<{ success: boolean; message: string; insertedCount: number }> {
  try {
    // data.jsonファイルのパスを取得 (プロジェクトルートからの相対パス)
    const dataPath = path.join(process.cwd(), 'lib', 'dataset', 'status', 'data.json');
    
    // ファイルが存在するかチェック
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found: ${dataPath}`);
    }

    // JSONファイルを読み込み
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const statusData: StatusData[] = JSON.parse(rawData);

    console.log(`読み込んだステータスデータ: ${statusData.length}件`);

    // データベースに挿入
    let insertedCount = 0;
    
    for (const status of statusData) {
      try {
        // 建物が存在するかチェック
        const buildingExists = await prisma.buildings.findUnique({
          where: { id: status.building_id }
        });

        if (!buildingExists) {
          console.warn(`警告: 建物ID ${status.building_id} が見つかりません。スキップします。`);
          continue;
        }

        // ステータスを挿入
        await prisma.buildingStatus.create({
          data: {
            status: status.status,
            building_id: status.building_id,
          }
        });

        insertedCount++;
        console.log(`挿入完了: 建物ID ${status.building_id}, ステータス: ${status.status}`);

      } catch (error) {
        console.error(`建物ID ${status.building_id} の挿入でエラー:`, error);
        // 個別のエラーは続行
      }
    }

    console.log(`挿入完了: ${insertedCount}/${statusData.length}件`);

    return {
      success: true,
      message: `ステータスデータの挿入が完了しました。${insertedCount}/${statusData.length}件が正常に挿入されました。`,
      insertedCount
    };

  } catch (error) {
    console.error('ステータスデータの挿入中にエラーが発生しました:', error);
    return {
      success: false,
      message: `エラー: ${error instanceof Error ? error.message : '不明なエラー'}`,
      insertedCount: 0
    };
  } finally {
    await prisma.$disconnect();
  }
}

// 直接実行された場合の処理
if (require.main === module) {
  insertBuildingStatusFromJson()
    .then((result) => {
      console.log('結果:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('実行エラー:', error);
      process.exit(1);
    });
}