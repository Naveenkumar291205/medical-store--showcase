import mysql from 'mysql2/promise';

const users = ['root', 'admin', 'Nandhinipriya', 'nandhinipriya', 'user', 'pantech', 'Medical'];
const passwords = ['Medical', 'medical', 'root', 'admin', '', '1234', '123456', 'password', 'root123', 'Medical@123', 'Medical123'];

async function testAuth() {
  console.log('Testing MySQL connection combinations on 127.0.0.1:3306...');
  
  for (const user of users) {
    for (const password of passwords) {
      try {
        const conn = await mysql.createConnection({
          host: '127.0.0.1',
          port: 3306,
          user,
          password
        });
        console.log(`\n🎉 SUCCESS! Connected to MySQL!`);
        console.log(`👉 USER: "${user}"`);
        console.log(`👉 PASSWORD: "${password}"`);
        
        const [dbs] = await conn.query('SHOW DATABASES;');
        console.log('Existing databases:', dbs.map(d => d.Database));
        await conn.end();
        return { user, password };
      } catch (err) {
        // failed attempt
      }
    }
  }
  console.log('\n❌ None of the tested username/password combinations matched.');
}

testAuth();
