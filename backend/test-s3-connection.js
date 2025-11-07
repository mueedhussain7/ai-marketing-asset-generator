const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

async function testS3() {
  try {
    console.log('Testing AWS S3 connection...\n');
    
    console.log('Using bucket:', process.env.AWS_S3_BUCKET);
    console.log('Using region:', process.env.AWS_REGION);
    console.log('Access Key starts with:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + '...\n');

    // Test 1: List buckets
    const buckets = await s3.listBuckets().promise();
    console.log(' Successfully connected to AWS!');
    console.log(' Your buckets:', buckets.Buckets.map(b => b.Name));

    // Test 2: Upload a test file
    const testParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: 'test/hello.txt',
      Body: 'Hello from AI Marketing Generator!',
      ContentType: 'text/plain'
    };

    const uploadResult = await s3.upload(testParams).promise();
    console.log('\n Test file uploaded!');
    console.log('URL:', uploadResult.Location);

    // Test 3: Check if file exists
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: 'test/'
    };

    const files = await s3.listObjectsV2(listParams).promise();
    console.log('\n Files in bucket:', files.Contents.length);

    console.log('\n AWS S3 is fully configured and working!');

  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n Troubleshooting:');
    console.log('1. Check your AWS_ACCESS_KEY_ID in .env');
    console.log('2. Check your AWS_SECRET_ACCESS_KEY in .env');
    console.log('3. Make sure bucket name is correct');
    console.log('4. Make sure IAM user has S3 permissions');
  }
}

testS3();