import mysql from 'mysql2/promise';

const candidates = [
  { u: 'root', p: 'Medical' },
  { u: 'root', p: 'medical' },
  { u: 'root', p: 'Medical@123' },
  { u: 'root', p: 'Medical#123' },
  { u: 'root', p: 'Medical123' },
  { u: 'root', p: 'Medical1234' },
  { u: 'root', p: 'Medical@2024' },
  { u: 'root', p: 'Medical@2025' },
  { u: 'root', p: 'Medical@2026' },
  { u: 'root', p: 'Pantech' },
  { u: 'root', p: 'pantech' },
  { u: 'root', p: 'Pantech@123' },
  { u: 'root', p: 'Pantech123' },
  { u: 'root', p: 'Nandhini' },
  { u: 'root', p: 'nandhini' },
  { u: 'root', p: 'Nandhini@123' },
  { u: 'root', p: 'Nandhinipriya' },
  { u: 'root', p: 'Nandhinipriya@123' },
  { u: 'root', p: 'root' },
  { u: 'root', p: 'admin' },
  { u: 'root', p: 'Admin@123' },
  { u: 'root', p: '1234' },
  { u: 'root', p: '12345' },
  { u: 'root', p: '123456' },
  { u: 'root', p: '12345678' },
  { u: 'root', p: '123456789' },
  { u: 'root', p: 'password' },
  { u: 'root', p: 'Password@123' },
  { u: 'root', p: 'Password123' },
  { u: 'root', p: 'Pass@123' },
  { u: 'root', p: '' },
  { u: 'Medical', p: 'Medical' },
  { u: 'medical', p: 'medical' },
  { u: 'admin', p: 'Medical' },
  { u: 'admin', p: 'admin' },
  { u: 'admin', p: 'Admin@123' },
  { u: 'Nandhinipriya', p: 'Medical' },
  { u: 'Nandhinipriya', p: 'Nandhinipriya' },
  { u: 'pantech', p: 'pantech' }
];

async function run() {
  for (const c of candidates) {
    try {
      const conn = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: c.u,
        password: c.p,
        connectTimeout: 1000
      });
      console.log(`\n========================================`);
      console.log(`🎉 SUCCESS! FOUND WORKING CREDENTIALS:`);
      console.log(`USER: "${c.u}"`);
      console.log(`PASSWORD: "${c.p}"`);
      console.log(`========================================\n`);
      const [dbs] = await conn.query('SHOW DATABASES;');
      console.log('Databases:', dbs.map(d => Object.values(d)[0]));
      await conn.end();
      return;
    } catch (e) {
      // ignore
    }
  }
  console.log('Finished testing candidates. None matched.');
}

run();
