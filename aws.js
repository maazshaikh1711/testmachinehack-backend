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

const generatePresignedUrl = (fileName, fileType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${fileName}`,
    Expires: 60, // URL expiry time (in seconds)
    ContentType: fileType,
  };

  return s3.getSignedUrlPromise('putObject', params); // Generating pre-signed URL for PUT operation
};

const generateSignedUrl = (key) => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60 * 60 * 5, // 5-hour validity
  });
};

module.exports = { generatePresignedUrl, generateSignedUrl };
// const fs = require('fs');


// // Read the file you want to upload
// const filePath = './machineHack.png';  // Replace with your file path
// // const fileContent = fs.readFileSync(filePath);

// if (fs.existsSync(filePath)) {
//   fileContent = fs.readFileSync(filePath);
//   console.log("File exists")
// } else {
//   console.log('File does not exist:', filePath);
// }

// // Set up the upload parameters
// const params = {
//   Bucket: 'machinehack-social-media-post-images',  // Replace with your actual bucket name
//   Key: 'machineHack.png',  // The name of the file in S3 (can be any name)
//   Body: fileContent,  // The content of the file you want to upload
//   ContentType: 'image/png',  // Replace with the correct MIME type of your file
// };

// // Upload the file to S3
// s3.upload(params, (err, data) => {
//   if (err) {
//     console.log('Error uploading file:', err);
//   } else {
//     console.log('File uploaded successfully:', data.Location); // URL of the uploaded file
//   }
// });