const express = require('express');
const router = express.Router();
const {
  saveDesign,
  getUserDesigns,
  getDesignById,
  deleteDesign
} = require('../controllers/designController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// POST /api/designs - Save a new design
router.post('/', saveDesign);

// GET /api/designs - Get all user's designs
router.get('/', getUserDesigns);

// GET /api/designs/:id - Get single design
router.get('/:id', getDesignById);

// DELETE /api/designs/:id - Delete design
router.delete('/:id', deleteDesign);

module.exports = router;