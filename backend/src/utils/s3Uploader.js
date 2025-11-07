const AWS = require('aws-sdk');
const crypto = require('crypto');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

class S3Uploader {
  async uploadImage(imageBuffer, originalPrompt) {
    try {
      // Use crypto.randomUUID() instead of uuid package
      const fileName = `marketing-assets/${crypto.randomUUID()}.png`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: imageBuffer,
        ContentType: 'image/png',
        Metadata: {
          'prompt': originalPrompt,
          'generated-at': new Date().toISOString()
        }
      };

      console.log('☁️  Uploading to S3...');
      const result = await s3.upload(params).promise();

      console.log('✅ Uploaded to S3:', result.Location);

      return {
        url: result.Location,
        key: fileName,
        bucket: process.env.AWS_S3_BUCKET
      };

    } catch (error) {
      console.error('❌ S3 upload failed:', error.message);
      throw error;
    }
  }
}

module.exports = new S3Uploader();