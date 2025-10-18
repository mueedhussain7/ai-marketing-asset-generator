const express = require('express');
const router = express.Router();
const {
  uploadLogo,
  saveBrandKit,
  getBrandKit,
  deleteBrandKit
} = require('../controllers/brandController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../config/s3');

// All routes require authentication
router.use(authMiddleware);

// POST /api/brands/upload-logo - Upload logo to S3
router.post('/upload-logo', upload.single('logo'), uploadLogo);

// POST /api/brands - Save brand kit
router.post('/', saveBrandKit);

// GET /api/brands - Get user's brand kit
router.get('/', getBrandKit);

// DELETE /api/brands/:id - Delete brand kit
router.delete('/:id', deleteBrandKit);

module.exports = router;