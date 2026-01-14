import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export async function getPresignedUrls(event: APIGatewayProxyEventV2) {
  const region = process.env.REGION;

  if (!region) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error"
      })
    };
  }

  const body = event.body ? JSON.parse(event.body) : undefined;
  if (!body) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to generate URLs"
      })
    };
  };
  console.log("Req body >> ", body);

  const images: { fileName: string, mimeType: string }[] = body.images;
  const userId = body.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Unable to generate URLs"
      })
    };
  };

  if (images.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No images were provided"
      })
    };
  };
  console.log("Images >> ", images);
  console.log("User ID >> ", userId);

  const s3 = new S3Client({ region });

  const urlPromises = images.map(async (image) => {
    const key = `users/${userId}/uploads/${image.fileName}`;
    const command = new PutObjectCommand({
      Bucket: "hunter-s3-bucket",
      Key: key,
      ContentType: image.mimeType
    });

    const uploadUrls = await getSignedUrl(s3, command, { expiresIn: 60 });
    return { uploadUrls }
  });

  const urls = await Promise.all(urlPromises);
  console.log("urls >> ", urls);

  return {
    statusCode: 200,
    body: JSON.stringify(urls)
  }
}
