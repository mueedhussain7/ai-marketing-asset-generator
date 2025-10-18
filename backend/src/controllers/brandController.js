const pool = require('../config/database').pool;

// Upload logo and return URL (handled by multer + S3)
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      message: 'Logo uploaded successfully!',
      logo_url: req.file.location // S3 URL
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
};

// Save brand kit (create or update)
const saveBrandKit = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { logo_url, primary_color, secondary_color, accent_color } = req.body;

    // Validate
    if (!logo_url || !primary_color || !secondary_color || !accent_color) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if brand kit exists
    const existing = await pool.query(
      'SELECT * FROM brand_kits WHERE user_id = $1',
      [userId]
    );

    let result;

    if (existing.rows.length > 0) {
      // UPDATE existing
      result = await pool.query(
        `UPDATE brand_kits 
         SET logo_url = $1, primary_color = $2, secondary_color = $3, 
             accent_color = $4, updated_at = NOW()
         WHERE user_id = $5 
         RETURNING *`,
        [logo_url, primary_color, secondary_color, accent_color, userId]
      );
    } else {
      // CREATE new
      result = await pool.query(
        `INSERT INTO brand_kits (user_id, logo_url, primary_color, secondary_color, accent_color)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, logo_url, primary_color, secondary_color, accent_color]
      );
    }

    res.json({
      message: 'Brand kit saved successfully',
      brandKit: result.rows[0]
    });
  } catch (error) {
    console.error('Save brand kit error:', error);
    res.status(500).json({ error: 'Failed to save brand kit' });
  }
};

// Get user's brand kit
const getBrandKit = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM brand_kits WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No brand kit found' });
    }

    res.json({ brandKit: result.rows[0] });
  } catch (error) {
    console.error('Get brand kit error:', error);
    res.status(500).json({ error: 'Failed to get brand kit' });
  }
};

// Delete brand kit
const deleteBrandKit = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify ownership
    const brand = await pool.query(
      'SELECT * FROM brand_kits WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (brand.rows.length === 0) {
      return res.status(404).json({ error: 'Brand kit not found' });
    }

    await pool.query('DELETE FROM brand_kits WHERE id = $1', [id]);

    res.json({ message: 'Brand kit deleted successfully' });
  } catch (error) {
    console.error('Delete brand kit error:', error);
    res.status(500).json({ error: 'Failed to delete brand kit' });
  }
};

module.exports = {
  uploadLogo,
  saveBrandKit,
  getBrandKit,
  deleteBrandKit
};