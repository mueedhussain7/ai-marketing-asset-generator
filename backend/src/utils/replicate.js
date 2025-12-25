const Replicate = require('replicate');

class ReplicateClient {
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  /**
   * Generate image with FLUX.1-schnell (SUPER FAST - 3-5 seconds!)
   */
  async generateImage(prompt, options = {}) {
    try {
      console.log('⚡ Starting FLUX.1-schnell generation...');
      console.log('📝 Prompt:', prompt);

      const startTime = Date.now();

      const output = await this.replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: prompt,
            num_outputs: 1,
            aspect_ratio: options.aspectRatio || "1:1",
            output_format: "png",
            output_quality: 90,
            num_inference_steps: 4, // 4 steps = fastest
          }
        }
      );

      const endTime = Date.now();
      const generationTime = Math.round((endTime - startTime) / 1000);

      console.log(`✅ FLUX generated in ${generationTime} seconds!`);
      console.log('🖼️  Image URL:', output[0]);

      return {
        imageUrl: output[0],
        generationTime: generationTime,
        model: 'flux-schnell'
      };

    } catch (error) {
      console.error('❌ Replicate generation failed:', error);
      throw new Error(`FLUX generation failed: ${error.message}`);
    }
  }

  /**
   * Generate with SDXL (higher quality, 10-15 seconds)
   */
  async generateImageSDXL(prompt, options = {}) {
    try {
      console.log('🎨 Starting SDXL generation...');
      
      const startTime = Date.now();

      const output = await this.replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: prompt,
            num_outputs: 1,
            width: options.width || 1024,
            height: options.height || 1024,
            num_inference_steps: options.steps || 25,
          }
        }
      );

      const endTime = Date.now();
      const generationTime = Math.round((endTime - startTime) / 1000);

      console.log(`✅ SDXL generated in ${generationTime} seconds!`);

      return {
        imageUrl: output[0],
        generationTime: generationTime,
        model: 'sdxl'
      };

    } catch (error) {
      console.error('❌ SDXL generation failed:', error);
      throw new Error(`SDXL generation failed: ${error.message}`);
    }
  }
}

module.exports = new ReplicateClient();