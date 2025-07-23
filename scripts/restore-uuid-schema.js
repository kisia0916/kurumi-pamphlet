// scripts/restore-uuid-schema.js
const fs = require('fs');
const path = require('path');

// UUID用に変更したスキーマを復元（データエクスポート後に使用）
function restoreUuidSchema() {
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const uuidSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.uuid-temp');
  
  try {
    // UUIDスキーマを復元
    fs.copyFileSync(uuidSchemaPath, schemaPath);
    console.log(`UUID schema restored from: ${uuidSchemaPath}`);
    
    // 一時ファイルを削除
    fs.unlinkSync(uuidSchemaPath);
    console.log('Temporary schema file deleted');
  } catch (error) {
    console.error('Error restoring UUID schema:', error);
  }
}

restoreUuidSchema();
