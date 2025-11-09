const { pool } = require('./database');

const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Users table created');
  } catch (error) {
    console.error('❌ Error creating users table:', error.message);
    throw error;
  }
};

const createBrandKitsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS brand_kits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      brand_name VARCHAR(255) NOT NULL,
      primary_color VARCHAR(7),
      secondary_color VARCHAR(7),
      accent_color VARCHAR(7),
      font_primary VARCHAR(100),
      font_secondary VARCHAR(100),
      brand_style VARCHAR(100),
      logo_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Brand kits table created');
  } catch (error) {
    console.error('❌ Error creating brand_kits table:', error.message);
    throw error;
  }
};

const createTemplatesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      thumbnail_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Templates table created');
  } catch (error) {
    console.error('❌ Error creating templates table:', error.message);
    throw error;
  }
};

const createDesignsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS designs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      brand_kit_id UUID REFERENCES brand_kits(id) ON DELETE SET NULL,
      template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
      prompt TEXT NOT NULL,
      image_url TEXT NOT NULL,
      asset_type VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Designs table created');
  } catch (error) {
    console.error('❌ Error creating designs table:', error.message);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...\n');
    
    await createUsersTable();
    await createBrandKitsTable();
    await createTemplatesTable();
    await createDesignsTable();
    
    console.log('\n🎉 Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initializeDatabase();