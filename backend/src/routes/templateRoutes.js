const express = require('express');
const router = express.Router();
const {
  getAllTemplates,
  getTemplateById,
  getTemplatesByCategory,
  getCategories
} = require('../controllers/templateController');

// Public routes (no authentication needed to browse templates)
router.get('/', getAllTemplates);
router.get('/categories', getCategories);
router.get('/category/:category', getTemplatesByCategory);
router.get('/:id', getTemplateById);

module.exports = router;