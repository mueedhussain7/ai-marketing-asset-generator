require('dotenv').config();
const { pool } = require('./database');

const createDesignsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS designs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      template_id VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      headline TEXT,
      description TEXT,
      thumbnail_url TEXT,
      design_data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
    CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs(created_at DESC);
  `;

  try {
    await pool.query(query);
    console.log('Designs table created successfully');
  } catch (error) {
    console.error('Error creating designs table:', error.message);
    throw error;
  }
};

const runMigration = async () => {
  try {
    console.log('Creating designs table...');
    await createDesignsTable();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();