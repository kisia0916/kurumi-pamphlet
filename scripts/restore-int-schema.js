// scripts/restore-int-schema.js
const fs = require('fs');
const path = require('path');

// 元のIntスキーマを一時的に復元（データエクスポート時に使用）
function restoreIntSchema() {
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const backupPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.int-backup');
  const uuidSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.uuid-temp');
  
  try {
    // 現在のUUIDスキーマを一時保存
    fs.copyFileSync(schemaPath, uuidSchemaPath);
    console.log(`Current UUID schema saved to: ${uuidSchemaPath}`);
    
    // 元のIntスキーマを復元
    fs.copyFileSync(backupPath, schemaPath);
    console.log(`Int schema restored from: ${backupPath}`);
  } catch (error) {
    console.error('Error restoring int schema:', error);
  }
}

restoreIntSchema();
