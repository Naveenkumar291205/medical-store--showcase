import mysql from 'mysql2/promise';

const usernames = [
  'root', 'root@localhost', 'root@127.0.0.1',
  'medical', 'Medical', 'MEDICAL',
  'smartpharma', 'SmartPharma', 'smart_pharma',
  'pharma', 'Pharma', 'pharmacy', 'Pharmacy',
  'admin', 'Admin', 'administrator', 'Administrator',
  'user', 'User', 'dbuser', 'db_user', 'app', 'appuser',
  'nandhini', 'nandhinipriya', 'Nandhini', 'Nandhinipriya',
  'pantech', 'Pantech', 'PANTECH',
  'developer', 'dev', 'test', 'tester', 'guest',
  'mysql', 'mysql.sys', 'mysql.session', 'mysql.infoschema',
  'medical_user', 'medical_admin', 'medicalshop', 'MedicalShop',
  'doctor', 'pharmacist', 'hospital', 'clinic'
];

async function checkUsernames() {
  console.log('Testing usernames with password "Medical" and "medical"...\n');
  const pwds = ['Medical', 'medical', 'MEDICAL'];
  
  for (const u of usernames) {
    for (const p of pwds) {
      try {
        const conn = await mysql.createConnection({
          host: '127.0.0.1',
          port: 3306,
          user: u,
          password: p,
          connectTimeout: 500
        });
        console.log(`\n🎉🎉🎉 SUCCESS! Connected to MySQL!`);
        console.log(`👉 USER: "${u}"`);
        console.log(`👉 PASSWORD: "${p}"`);
        const [dbs] = await conn.query('SHOW DATABASES;');
        console.log('Databases:', dbs.map(d => Object.values(d)[0]));
        await conn.end();
        return { u, p };
      } catch (err) {
        // failed
      }
    }
  }
  console.log('❌ None of the tested usernames connected with password Medical.');
}

checkUsernames();
