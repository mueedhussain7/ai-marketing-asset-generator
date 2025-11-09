const comfyui = require('../utils/comfyui');
const s3Uploader = require('../utils/s3Uploader');
const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

const generateMarketingAsset = async (req, res) => {
  try {
    const { prompt, assetType, brandKitId } = req.body; // ALSO gets brand kit ID

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Please provide a prompt!' 
      });
    }

    console.log(`\n🎨 Generating ${assetType || 'asset'} with prompt: "${prompt}"\n`);

    // If brandKitId provided, fetch brand kit data
    let enhancedPrompt = prompt;
    if (brandKitId) {
      console.log(`🎨 Using brand kit: ${brandKitId}`);
      
      const brandResult = await pool.query(
        'SELECT * FROM brand_kits WHERE id = $1',
        [brandKitId]
      );

      if (brandResult.rows.length > 0) {
        const brand = brandResult.rows[0];
        console.log(`✅ Brand: ${brand.brand_name}`);
        console.log(`   Colors: ${brand.primary_color}, ${brand.secondary_color}`);
        console.log(`   Style: ${brand.brand_style}`);

        // Enhance prompt with brand information
        enhancedPrompt = `${prompt}, using color scheme with primary color ${brand.primary_color}, secondary color ${brand.secondary_color}, style: ${brand.brand_style}, modern professional design`;
        
        console.log(`\n📝 Enhanced prompt: "${enhancedPrompt}"\n`);
      }
    }

    const workflow = loadWorkflow(enhancedPrompt);

    const imageInfo = await comfyui.generateImage(enhancedPrompt, workflow);
    const imageBuffer = await comfyui.downloadImage(imageInfo);

    const s3Result = await s3Uploader.uploadImage(imageBuffer, enhancedPrompt);

    console.log('🎉 Complete!\n');

    res.json({
      success: true,
      message: 'Image generated successfully!',
      data: {
        imageUrl: s3Result.url,
        prompt: enhancedPrompt,
        originalPrompt: prompt,
        assetType: assetType,
        brandKitId: brandKitId,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate image',
      details: error.message
    });
  }
};

function loadWorkflow(prompt) {
  const workflowPath = path.join(__dirname, '../../config/workflow_api.json');
  const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
  
  for (let nodeId in workflow) {
    const node = workflow[nodeId];
    
    if (node.class_type === "CLIPTextEncode") {
      if (node.inputs && node.inputs.text !== undefined) {
        console.log(`✏️  Updating prompt in node ${nodeId}`);
        node.inputs.text = prompt;
        break;
      }
    }
  }
  
  return workflow;
}

module.exports = {
  generateMarketingAsset
};