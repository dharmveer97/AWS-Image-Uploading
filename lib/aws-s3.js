import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { orderBy } from 'lodash';

// Set the AWS Region.
const REGION = process.env.NEXT_PUBLIC_REGION;
const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

// Initialize the S3 client with environment variables for AWS credentials
export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Function to generate a file URL
const generateFileUrl = (fileKey) => {
  const href = `https://${bucketName}.s3.${REGION}.amazonaws.com/folder-name`;
  const fileUrl = `${href}${fileKey}`;
  return fileUrl;
};

// Function to generate a signed URL for file upload
export const generateSignedUrl = async ({ fileKey, fileType }) => {
  const uploadParams = {
    Bucket: bucketName,
    Key: `folder-name${fileKey}`,
    ContentType: fileType,
    PartSize: 10 * 1024 * 1024, // 10 MB chunks
  };

  const command = new PutObjectCommand(uploadParams);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return {
    signedUrl: url,
    fileUrl: generateFileUrl(fileKey),
  };
};

// Function to convert a date string to a timestamp
const toTimestamp = (strDate) => {
  const datum = Date.parse(strDate);
  return datum / 1000;
};

// Function to fetch files from S3
export const fetchFiles = async (albumName = 'featured') => {
  const albumPhotosKey = `${encodeURIComponent(albumName)}/`;
  const data2 = await s3Client.send(
    new ListObjectsCommand({
      Prefix: albumPhotosKey,
      Bucket: bucketName,
      MaxKeys: 1000,
    }),
  );

  const data = data2.Contents.map((item) => {
    const photoKey = item.Key;
    const photoUrl = generateFileUrl(photoKey);
    if (photoKey !== `${albumName}/`) {
      return {
        id: item.ETag,
        fileName: photoKey,
        filePath: photoUrl,
        uploadedOn: String(item.LastModified),
        timestamp: toTimestamp(item.LastModified),
      };
    }
    return null;
  });

  const sortedData = orderBy(data, ['timestamp'], ['desc']);
  return sortedData;
};

// Function to remove a file from S3
export const removeFile = async (file) => {
  try {
    const data = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: file,
      }),
    );
    console.info('File removed', data);
    return true;
  } catch (e) {
    console.log('error', e.message);
    throw new Error(e.message);
  }
};
