// scripts/export-data.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// 古いスキーマを使用するPrismaクライアント
// 注意: このスクリプト実行前に、schema.prismaをバックアップし、
// 元のInt IDバージョンに戻してからこのスクリプトを実行します
const prisma = new PrismaClient();

// UUIDマッピングを保存するオブジェクト
const idMappings = {
  Buildings: {},
  Floor: {},
  Projects: {},
  // 他のテーブルも必要に応じて追加
};

async function exportData() {
  try {
    // 出力ディレクトリを作成
    const exportDir = path.join(__dirname, 'exported-data');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // すべてのBuildings（建物）データをエクスポート
    const buildings = await prisma.buildings.findMany();
    const buildingsWithUuid = buildings.map(building => {
      const uuid = uuidv4();
      idMappings.Buildings[building.id] = uuid;
      return {
        ...building,
        id: uuid,
      };
    });
    fs.writeFileSync(
      path.join(exportDir, 'buildings.json'),
      JSON.stringify(buildingsWithUuid, null, 2)
    );
    console.log(`Exported ${buildings.length} buildings with UUID mappings`);

    // Floorデータをエクスポート（関連するbuilding_idを新しいUUIDに変換）
    const floors = await prisma.floor.findMany();
    const floorsWithUuid = floors.map(floor => {
      const uuid = uuidv4();
      idMappings.Floor[floor.id] = uuid;
      return {
        ...floor,
        id: uuid,
        building_id: idMappings.Buildings[floor.building_id],
      };
    });
    fs.writeFileSync(
      path.join(exportDir, 'floors.json'),
      JSON.stringify(floorsWithUuid, null, 2)
    );
    console.log(`Exported ${floors.length} floors with UUID mappings`);

    // Projectsデータをエクスポート（関連するbuilding_idとfloor_idを新しいUUIDに変換）
    const projects = await prisma.projects.findMany();
    const projectsWithUuid = projects.map(project => {
      const uuid = uuidv4();
      idMappings.Projects[project.id] = uuid;
      return {
        ...project,
        id: uuid,
        building_id: idMappings.Buildings[project.building_id],
        floor_id: idMappings.Floor[project.floor_id],
      };
    });
    fs.writeFileSync(
      path.join(exportDir, 'projects.json'),
      JSON.stringify(projectsWithUuid, null, 2)
    );
    console.log(`Exported ${projects.length} projects with UUID mappings`);

    // MapPinデータをエクスポート（関連するbuilding_idとproject_idを新しいUUIDに変換）
    const mapPins = await prisma.mapPin.findMany();
    const mapPinsWithUuid = mapPins.map(pin => {
      return {
        ...pin,
        id: uuidv4(),
        building_id: pin.building_id ? idMappings.Buildings[pin.building_id] : null,
        project_id: pin.project_id ? idMappings.Projects[pin.project_id] : null,
      };
    });
    fs.writeFileSync(
      path.join(exportDir, 'mapPins.json'),
      JSON.stringify(mapPinsWithUuid, null, 2)
    );
    console.log(`Exported ${mapPins.length} map pins with UUID mappings`);

    // 他のテーブルも同様にエクスポート...
    // FoodData, TimeTableContents, StampPlace, UserStamps, Userなど

    // IDマッピング自体も保存（デバッグや参照用）
    fs.writeFileSync(
      path.join(exportDir, 'id-mappings.json'),
      JSON.stringify(idMappings, null, 2)
    );

    console.log('Data export completed successfully!');
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
