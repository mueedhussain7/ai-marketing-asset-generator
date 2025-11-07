require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Testing database connection...\n');
console.log('Configuration:');
console.log('  Host:', process.env.DB_HOST);
console.log('  Port:', process.env.DB_PORT);
console.log('  Database:', process.env.DB_NAME);
console.log('  User:', process.env.DB_USER);
console.log('  Password:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : 'NOT SET');
console.log('');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW() as current_time, current_database() as db_name', (err, res) => {
  if (err) {
    console.error('Connection FAILED!');
    console.error('Error:', err.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check if PostgreSQL is running: brew services list');
    console.error('2. Verify database exists: psql -l');
    console.error('3. Check username/password in .env file');
  } else {
    console.log('Connection SUCCESSFUL!');
    console.log('Connected to database:', res.rows[0].db_name);
    console.log('Server time:', res.rows[0].current_time);
  }
  pool.end();
});
