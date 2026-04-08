import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getScreenshots = async (region: string, keys: string[]): Promise<string[] | undefined> => {
  const client = new S3Client({ region });
  const urls: string[] = [];

  for (const key of keys) {
    const getImages = new GetObjectCommand({ Bucket: "hunter-s3-bucket", Key: key });
    urls.push(await getSignedUrl(client, getImages, { expiresIn: 3600 }));
  }

  return urls.length >= 1 ? urls : undefined;
};
