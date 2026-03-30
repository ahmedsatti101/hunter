//function to delete images in S3 that belong
//to an entry

import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

export async function deleteMedia(keys: any[], region: string): Promise<boolean> {
  const client = new S3Client({ region });
  const command = new DeleteObjectsCommand({
    Bucket: "hunter-s3-bucket",
    Delete: {
      Objects: keys.map((key) => ({ Key: key.url })),
      Quiet: true
    }
  });
  const response = await client.send(command);
  console.log(response);

  if (response.Deleted) {
    return true;
  }

  return false;
}
