const dotenv = require('dotenv')
const AWS = require('aws-sdk');

dotenv.config();

// Set AWS credentials and region
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

s3.listBuckets((err, data) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Bucket List:', data.Buckets);
    }
});
