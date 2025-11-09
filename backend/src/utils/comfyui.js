const axios = require('axios');

class ComfyUIClient {
  constructor() {
    this.baseURL = process.env.COMFYUI_URL || 'http://localhost:8188';
  }

  async generateImage(prompt, workflow) {
    try {
      console.log('🎨 Sending prompt to ComfyUI...');
      
      const response = await axios.post(`${this.baseURL}/prompt`, {
        prompt: workflow,
        client_id: 'marketing-generator'
      });

      const promptId = response.data.prompt_id;
      console.log(`✅ Generation started! ID: ${promptId}`);

      return await this.waitForImage(promptId);

    } catch (error) {
      console.error('❌ ComfyUI error:', error.message);
      throw error;
    }
  }

  async waitForImage(promptId) {
    let attempts = 0;
    const maxAttempts = 3600; // 60 minutes/ 1 Hour

    while (attempts < maxAttempts) {
      try {
        const historyResponse = await axios.get(`${this.baseURL}/history/${promptId}`);
        
        if (historyResponse.data[promptId]) {
          const outputs = historyResponse.data[promptId].outputs;
          
          for (let nodeId in outputs) {
            if (outputs[nodeId].images) {
              const image = outputs[nodeId].images[0];
              console.log('✅ Image ready!');
              return {
                filename: image.filename,
                subfolder: image.subfolder,
                type: image.type
              };
            }
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        
        if (attempts % 10 === 0) {
          console.log(`Still generating... (${attempts}s)`);
        }

      } catch (error) {
        console.error('Error checking status:', error.message);
        attempts++;
      }
    }

    throw new Error('Image generation timed out');
  }

  async downloadImage(imageInfo) {
    const url = `${this.baseURL}/view?filename=${imageInfo.filename}&subfolder=${imageInfo.subfolder}&type=${imageInfo.type}`;
    
    console.log('📥 Downloading image from ComfyUI...');
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
  }
}

module.exports = new ComfyUIClient();