import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { v4 as uuid } from "uuid";

export async function getPresignedUrl(event: APIGatewayProxyEventV2) {
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

  const images = body.images;
  // const userId = body.userId;
  const s3 = new S3Client({ region });

  const urlPromises = images.map(async (image: any) => {
    const key = `users/${uuid}/uploads/${image.fileName}`;
    const command = new PutObjectCommand({
      Bucket: "hunter-s3-bucket",
      Key: key,
      ContentType: image.mimeType
    });

    const uploadUrls = await getSignedUrl(s3, command, { expiresIn: 60 });
    return { uploadUrls, key }
  });

  const urls = await Promise.all(urlPromises);

  return {
    statusCode: 200,
    body: urls
  }
}
