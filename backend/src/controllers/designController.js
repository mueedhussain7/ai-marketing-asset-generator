const pool = require('../config/database').pool;

// Save a new design
const saveDesign = async (req, res) => {
  try {
    const userId = req.user.id;
    const { template_id, name, headline, description, design_data } = req.body;

    // Validation
    if (!template_id || !name || !design_data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate a simple thumbnail (fix it later with real image generation)
    const thumbnail_url = `https://via.placeholder.com/300x300/4F46E5/ffffff?text=${encodeURIComponent(name)}`;

    const result = await pool.query(
      `INSERT INTO designs (user_id, template_id, name, headline, description, thumbnail_url, design_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, template_id, name, headline, description, thumbnail_url, design_data]
    );

    res.status(201).json({
      success: true,
      message: 'Design saved successfully',
      design: result.rows[0]
    });
  } catch (error) {
    console.error('Save design error:', error);
    res.status(500).json({ error: 'Failed to save design' });
  }
};

// Get all designs for a user
const getUserDesigns = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM designs 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      designs: result.rows
    });
  } catch (error) {
    console.error('Get designs error:', error);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
};

// Get a single design by ID
const getDesignById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM designs 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Design not found' });
    }

    res.json({
      success: true,
      design: result.rows[0]
    });
  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({ error: 'Failed to fetch design' });
  }
};

// Delete a design
const deleteDesign = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify ownership
    const design = await pool.query(
      `SELECT * FROM designs WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (design.rows.length === 0) {
      return res.status(404).json({ error: 'Design not found' });
    }

    await pool.query('DELETE FROM designs WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({ error: 'Failed to delete design' });
  }
};

module.exports = {
  saveDesign,
  getUserDesigns,
  getDesignById,
  deleteDesign
};