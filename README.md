## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

<!-- [/api/graphql](http://localhost:3000/api/graphql) -->

# Setting up AWS S3 for Image Uploads

Follow these steps to enable image uploading to an AWS S3 bucket in your Next.js application:

## 1. Create an S3 Bucket

- Go to the [AWS S3 Management Console](https://ca-central-1.console.aws.amazon.com/s3/home?region=ca-central-1).
- Click on "Create bucket."
- Enter a unique bucket name and select the region from the URL (e.g., ca-central-1).
- Click "Create."

## 2. Set Up Environment Variables

Add the following environment variables to your `.env` file:

```dotenv
NEXT_PUBLIC_REGION=your-region
NEXT_PUBLIC_AWS_BUCKET=your-bucket-name
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## 3.  Create an S3 Bucket Policy

Add the following policy to your S3 bucket's CORS configuration to allow cross-origin requests:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

## 4. Configure Cross-Origin Resource Sharing (CORS)

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://example.app",
            "http://example.com",
            "http://example.app"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]

```

Certainly! Here's the content in Markdown format for your README.md file on GitHub:

markdown
Copy code

# Setting up AWS S3 for Image Uploads

Follow these steps to enable image uploading to an AWS S3 bucket in your Next.js application:

## 1. Create an S3 Bucket

- Go to the [AWS S3 Management Console](https://ca-central-1.console.aws.amazon.com/s3/home?region=ca-central-1).
- Click on "Create bucket."
- Enter a unique bucket name and select the region from the URL (e.g., ca-central-1).
- Click "Create."

## 2. Set Up Environment Variables

Add the following environment variables to your `.env` file:

```dotenv
NEXT_PUBLIC_REGION=your-region
NEXT_PUBLIC_AWS_BUCKET=your-bucket-name
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret-access-key
3. Create an S3 Bucket Policy
Add the following policy to your S3 bucket's CORS configuration to allow cross-origin requests:

json
Copy code
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
4. Configure Cross-Origin Resource Sharing (CORS)
json
Copy code
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE",
            "HEAD"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://example.app",
            "http://example.com",
            "http://example.app"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
## Additional Information

- Customize the CORS policy according to your application's needs, specifying the allowed headers, methods, and origins.
- For security reasons, restrict permissions in the S3 bucket policy based on your application's requirements.

 With these steps completed, your Next.js application should be configured to upload images to your AWS S3 bucket.
