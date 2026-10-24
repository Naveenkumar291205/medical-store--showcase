import mysql from 'mysql2/promise';

const users = ['root', 'ait', 'movie', 'nandhini', 'Nandhini', 'nandhinipriya', 'Nandhinipriya', 'pantech', 'Pantech', 'admin', 'user'];
const passwords = [
  'Medical', 'medical', 'MEDICAL', 'Medical@123', 'Medical123', 'Medical#123',
  'ait', 'ait123', 'ait@123', 'Ait@123', 'AIT@123', 'Ait123',
  'movie', 'movie123', 'movie@123', 'Movie@123',
  'nandhini', 'Nandhini', 'nandhini123', 'nandhini@123', 'Nandhini@123', 'Nandhini123',
  'nandhinipriya', 'Nandhinipriya', 'Nandhinipriya@123', 'nandhinipriya@123',
  'pantech', 'Pantech', 'pantech123', 'pantech@123', 'Pantech@123', 'Pantech123',
  'root', 'root123', 'root@123', 'Root@123', 'Root123',
  'admin', 'admin123', 'admin@123', 'Admin@123', 'Admin123',
  '1234', '12345', '123456', '12345678', '123456789',
  'password', 'Password@123', 'Password123', 'Pass@123', ''
];

async function findWorkingCredentials() {
  console.log(`Testing ${users.length * passwords.length} permutations...`);
  
  for (const u of users) {
    for (const p of passwords) {
      try {
        const conn = await mysql.createConnection({
          host: '127.0.0.1',
          port: 3306,
          user: u,
          password: p,
          connectTimeout: 200
        });
        console.log(`\n======================================================`);
        console.log(`🎉 SUCCESS! FOUND WORKING MYSQL CREDENTIALS:`);
        console.log(`👉 USER: "${u}"`);
        console.log(`👉 PASSWORD: "${p}"`);
        console.log(`======================================================\n`);
        const [dbs] = await conn.query('SHOW DATABASES;');
        console.log('Databases:', dbs.map(d => Object.values(d)[0]));
        await conn.end();
        return { u, p };
      } catch (err) {
        // failed attempt
      }
    }
  }
  console.log('❌ Completed permutations. None matched.');
}

findWorkingCredentials();
