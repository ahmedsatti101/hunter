//function to delete images in S3 that belong to an entry

import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

export async function deleteMedia(keys: any[], region: string): Promise<boolean> {
  if (keys.length === 0) {
    return true;
  }

  const client = new S3Client({ region });
  const command = new DeleteObjectsCommand({
    Bucket: "hunter-s3-bucket",
    Delete: {
      Objects: keys.flatMap((item) => item.url.map((path: string) => ({ Key: path }))),
      Quiet: false
    }
  });
  const response = await client.send(command);
  if (response.$metadata.httpStatusCode === 200) {
    return true;
  }

  return false;
}
