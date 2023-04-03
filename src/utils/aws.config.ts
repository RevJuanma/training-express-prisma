import * as AWS from 'aws-sdk';

// AWS.config.update({
//   accessKeyId: 'AKIA2V3WJ6JDZNHG2XE2',
//   secretAccessKey: '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',
// });
// AWS.config.update({ region: 'us-east-1' });
// // AWS.config.update({ signatureVersion: 'v4' });

// export const s3 = new AWS.S3();

// export const s3 = new AWS.S3({
//   accessKeyId: 'AKIA2V3WJ6JDZNHG2XE2',
//   secretAccessKey: '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',
//   region: 'us-east-1',
// });

export const BUCKET_NAME = 'wizard-bucket-s3';
const accessKeyId = 'AKIA2V3WJ6JD6IIMCTVC';
const secretAccessKey = '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';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

export const s3 = new AWS.S3();
