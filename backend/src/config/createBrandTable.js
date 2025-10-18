require('dotenv').config();
const { pool } = require('./database');

const createBrandKitsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS brand_kits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      logo_url TEXT NOT NULL,
      primary_color VARCHAR(7) NOT NULL,
      secondary_color VARCHAR(7) NOT NULL,
      accent_color VARCHAR(7) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id)
    );
  `;

  try {
    await pool.query(query);
    console.log('Brand kits table created successfully');
  } catch (error) {
    console.error('Error creating brand_kits table:', error.message);
    throw error;
  }
};

const runMigration = async () => {
  try {
    console.log('Creating brand_kits table');
    await createBrandKitsTable();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();