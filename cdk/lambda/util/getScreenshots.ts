import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getScreenshots = async (region: string, user_id: string): Promise<string[] | undefined> => {
  const client = new S3Client({ region });
  const listScreenshots = new ListObjectsV2Command({
    Bucket: "hunter-s3-bucket",
    Prefix: `users/${user_id}/uploads/`
  });
  const response = await client.send(listScreenshots);
  const urls: string[] = [];

  if (response.$metadata.httpStatusCode === 200 && response.Contents !== undefined) {
    for (const obj of response.Contents) {
      const getImages = new GetObjectCommand({ Bucket: "hunter-s3-bucket", Key: obj.Key });
      urls.push(await getSignedUrl(client, getImages, { expiresIn: 3600 }));
    }
  }

  return urls.length >= 1 ? urls : undefined;
};
