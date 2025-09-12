// import { PrismaClient } from '@prisma/client'
// import fs from 'fs'
// import path from 'path'

// const prisma = new PrismaClient()

// // data.jsonの型定義
// interface BuildingData {
//   index: string
//   name: string
//   picture: string
// }

// async function insertBuildingsFromJson() {
//   try {
//     // data.jsonファイルを読み込み
//     const dataPath = path.join(process.cwd(), 'lib', 'data.json')
//     const jsonData = fs.readFileSync(dataPath, 'utf-8')
//     const buildingsData: BuildingData[] = JSON.parse(jsonData)

//     console.log('Building data loaded:', buildingsData.length, 'items')

//     // 重複を除去（indexが同じものを除去）
//     const uniqueBuildings = buildingsData.filter((building, index, self) => 
//       index === self.findIndex(b => b.index === building.index)
//     )

//     console.log('Unique buildings after deduplication:', uniqueBuildings.length, 'items')

//     // 各建物データをDBに挿入
//     for (const building of uniqueBuildings) {
//       try {
//         // 既に同じ名前の建物が存在するかチェック
//         const existingBuilding = await prisma.buildings.findFirst({
//           where: { name: building.name }
//         })

//         if (existingBuilding) {
//           console.log(`Building "${building.name}" already exists, skipping...`)
//           continue
//         }

//         // 新しい建物を作成
//         const newBuilding = await prisma.buildings.create({
//           data: {
//             index: parseInt(building.index),
//             name: building.name,
//             picture: building.picture,
//           }
//         })

//         console.log(`✅ Created building: ${newBuilding.name} (ID: ${newBuilding.id})`)
//       } catch (error) {
//         console.error(`❌ Failed to create building "${building.name}":`, error)
//       }
//     }

//     console.log('🎉 Building data insertion completed!')
//   } catch (error) {
//     console.error('❌ Error during building data insertion:', error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// // メイン実行関数
// async function main() {
//   console.log('🚀 Starting building data insertion...')
//   await insertBuildingsFromJson()
// }

// // スクリプトが直接実行された場合のみ実行
// if (require.main === module) {
//   main().catch(console.error)
// }

// export { insertBuildingsFromJson }
