// scripts/import-data.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// 新しいスキーマ（UUID）を使用するPrismaクライアント
const prisma = new PrismaClient();

async function importData() {
  try {
    const exportDir = path.join(__dirname, 'exported-data');

    // トランザクションですべてのデータをインポート
    await prisma.$transaction(async (tx) => {
      // Buildings（建物）データをインポート
      const buildingsData = JSON.parse(
        fs.readFileSync(path.join(exportDir, 'buildings.json'), 'utf-8')
      );
      
      // createdAtフィールドがDate型に変換されるように調整
      const buildingsForImport = buildingsData.map(building => ({
        ...building,
        createdAt: new Date(building.createdAt),
      }));
      
      // 外部キー制約を無視してデータを直接挿入（idを含む）
      for (const building of buildingsForImport) {
        await tx.buildings.create({
          data: {
            id: building.id,
            createdAt: building.createdAt,
            name: building.name,
            status: building.status,
            picture: building.picture,
          },
        });
      }
      console.log(`Imported ${buildingsForImport.length} buildings`);

      // Floor（フロア）データをインポート
      const floorsData = JSON.parse(
        fs.readFileSync(path.join(exportDir, 'floors.json'), 'utf-8')
      );
      
      const floorsForImport = floorsData.map(floor => ({
        ...floor,
        createdAt: new Date(floor.createdAt),
      }));
      
      for (const floor of floorsForImport) {
        await tx.floor.create({
          data: {
            id: floor.id,
            createdAt: floor.createdAt,
            building_id: floor.building_id,
            floor_num: floor.floor_num,
          },
        });
      }
      console.log(`Imported ${floorsForImport.length} floors`);

      // Projects（プロジェクト）データをインポート
      const projectsData = JSON.parse(
        fs.readFileSync(path.join(exportDir, 'projects.json'), 'utf-8')
      );
      
      const projectsForImport = projectsData.map(project => ({
        ...project,
        createdAt: new Date(project.createdAt),
      }));
      
      for (const project of projectsForImport) {
        await tx.projects.create({
          data: {
            id: project.id,
            createdAt: project.createdAt,
            name: project.name,
            tag: project.tag,
            picture: project.picture,
            floor_id: project.floor_id,
            building_id: project.building_id,
          },
        });
      }
      console.log(`Imported ${projectsForImport.length} projects`);

      // MapPin（マップピン）データをインポート
      const mapPinsData = JSON.parse(
        fs.readFileSync(path.join(exportDir, 'mapPins.json'), 'utf-8')
      );
      
      const mapPinsForImport = mapPinsData.map(pin => ({
        ...pin,
        createdAt: new Date(pin.createdAt),
      }));
      
      for (const pin of mapPinsForImport) {
        await tx.mapPin.create({
          data: {
            id: pin.id,
            createdAt: pin.createdAt,
            type: pin.type,
            x: pin.x,
            y: pin.y,
            building_id: pin.building_id,
            project_id: pin.project_id,
          },
        });
      }
      console.log(`Imported ${mapPinsForImport.length} map pins`);

      // 他のテーブルも同様にインポート...

    });

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
