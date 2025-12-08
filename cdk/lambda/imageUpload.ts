import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export async function imageUpload(event: any) {
  try {
    const body = JSON.parse(event.body);
    const mimeType: string | undefined = body.mimeType;
    const imageName: string | null | undefined = body.imageName;
    const image: string | null | undefined = body.image;
    const accountId: string | undefined = process.env.ACCOUNT_ID;

    if (!mimeType || !imageName || !image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request" })
      }
    }

    if (!accountId) return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error" })
    }

    const s3Client = new S3Client();

    const key = `users/${uuid()}/uploads/${imageName}`;
    const buf = Buffer.from(image, "base64");

    const command = new PutObjectCommand({
      Bucket: "hunter-s3-bucket",
      Key: key,
      ContentType: mimeType,
      Body: buf,
      ExpectedBucketOwner: accountId
    });

    const response = await s3Client.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Error occured while uploading image" })
      }
    } else {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Image uploaded successfully" })
      }
    }
  } catch (error: any) {
    return {
      statusCode: error.$metadata.httpStatusCode,
      body: JSON.stringify({ message: "Error occured while uploading image" })
    }
  }
}
