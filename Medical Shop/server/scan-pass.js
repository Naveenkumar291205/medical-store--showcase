import mysql from 'mysql2/promise';

const passList = [
  'Medical', 'medical', 'MEDICAL',
  'Medical@123', 'medical@123', 'Medical@1234', 'Medical@1', 'Medical@12',
  'Medical#123', 'Medical$123', 'Medical!123', 'Medical123', 'Medical1234',
  'Medical@2026', 'Medical@2025', 'Medical@2024', 'Medical2026', 'Medical2025',
  'MedicalShop', 'medicalshop', 'MedicalShop@123',
  'root', 'ROOT', 'root@123', 'Root@123', 'root123', 'Root123',
  'admin', 'ADMIN', 'Admin@123', 'admin@123', 'Admin123', 'admin123',
  '1234', '12345', '123456', '1234567', '12345678', '123456789', '1234567890',
  '0000', '1111', 'password', 'Password', 'Password@123', 'Password123',
  'Pass@123', 'Pass123',
  'pantech', 'Pantech', 'Pantech@123', 'pantech@123', 'Pantech123', 'pantech123',
  'Pantech@2026', 'Pantech@2025', 'Pantech@2024', 'PantechSolutions',
  'Nandhini', 'nandhini', 'Nandhini@123', 'nandhini@123', 'Nandhini123',
  'Nandhinipriya', 'nandhinipriya', 'Nandhinipriya@123', 'nandhinipriya@123',
  'Nandhini@2026', 'Nandhini@2025', 'Nandhini@2024',
  'sql', 'mysql', 'MySql', 'MySQL', 'MySQL@123', 'mysql123',
  'tiger', 'scott', 'manager', 'welcome', 'Welcome@123', ''
];

async function scan() {
  console.log(`Scanning ${passList.length} password permutations for user "root" on 127.0.0.1:3306...`);
  for (const p of passList) {
    try {
      const conn = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: p,
        connectTimeout: 400
      });
      console.log(`\n========================================`);
      console.log(`🎉 SUCCESS! FOUND ROOT PASSWORD:`);
      console.log(`USER: "root"`);
      console.log(`PASSWORD: "${p}"`);
      console.log(`========================================\n`);
      const [dbs] = await conn.query('SHOW DATABASES;');
      console.log('Databases:', dbs.map(d => Object.values(d)[0]));
      await conn.end();
      return p;
    } catch (err) {
      // failed
    }
  }
  console.log('Finished scan for root. None matched.');
}

scan();
