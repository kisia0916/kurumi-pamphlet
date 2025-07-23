// scripts/backup-schema.js
const fs = require('fs');
const path = require('path');

// schema.prismaファイルをバックアップ
function backupSchema() {
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const backupPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.int-backup');
  
  try {
    // 既存のスキーマをコピー
    fs.copyFileSync(schemaPath, backupPath);
    console.log(`Schema backed up to: ${backupPath}`);
  } catch (error) {
    console.error('Error backing up schema:', error);
  }
}

backupSchema();
