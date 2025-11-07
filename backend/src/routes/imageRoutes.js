const express = require('express');
const router = express.Router();
const { generateMarketingAsset } = require('../controllers/imageController');

router.post('/generate', generateMarketingAsset);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is healthy!',
    comfyui: process.env.COMFYUI_URL,
    s3Bucket: process.env.AWS_S3_BUCKET
  });
});

module.exports = router;