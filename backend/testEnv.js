require('dotenv').config();

console.log('\n=== Testing .env ===');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('==================\n');

if (process.env.DB_NAME === 'ai_marketing_db') {
  console.log('✅ .env is loading correctly!');
} else {
  console.log('❌ .env is NOT loading correctly!');
  console.log('Expected: ai_marketing_db');
  console.log('Got:', process.env.DB_NAME);
}
