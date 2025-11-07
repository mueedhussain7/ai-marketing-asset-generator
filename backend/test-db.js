const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('🔄 Testing database connection...\n');
console.log('Connection details:');
console.log('- User:', process.env.DB_USER);
console.log('- Host:', process.env.DB_HOST);
console.log('- Database:', process.env.DB_NAME);
console.log('- Port:', process.env.DB_PORT);
console.log('- Password:', process.env.DB_PASSWORD ? '***' : 'NOT SET!');
console.log();

pool.query('SELECT NOW() as time, current_database() as db, version() as version', (err, res) => {
  if (err) {
    console.error('Connection FAILED:', err.message);
    console.error('\nMake sure:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database "' + process.env.DB_NAME + '" exists');
    console.error('3. Credentials in .env are correct');
  } else {
    console.log('Connection SUCCESSFUL!');
    console.log('- Database:', res.rows[0].db);
    console.log('- Time:', res.rows[0].time);
    console.log('- Version:', res.rows[0].version.split('\n')[0]);
  }
  pool.end();
});
