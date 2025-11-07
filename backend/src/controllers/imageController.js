const comfyui = require('../utils/comfyui');
const s3Uploader = require('../utils/s3Uploader');
const fs = require('fs');
const path = require('path');

const generateMarketingAsset = async (req, res) => {
  try {
    const { prompt, assetType } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Please provide a prompt!' 
      });
    }

    console.log(`\n🎨 Generating ${assetType || 'asset'} with prompt: "${prompt}"\n`);

    const workflow = loadWorkflow(prompt);

    const imageInfo = await comfyui.generateImage(prompt, workflow);
    const imageBuffer = await comfyui.downloadImage(imageInfo);

    const s3Result = await s3Uploader.uploadImage(imageBuffer, prompt);

    console.log('🎉 Complete!\n');

    res.json({
      success: true,
      message: 'Image generated successfully!',
      data: {
        imageUrl: s3Result.url,
        prompt: prompt,
        assetType: assetType,
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