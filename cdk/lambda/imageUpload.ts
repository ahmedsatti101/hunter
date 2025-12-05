import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export async function imageUpload(event: any) {
  try {
    console.log(event.body);
    const body = JSON.parse(event.body);
    const mimeType: string | undefined = body.mimeType;
    const imageName: string | null | undefined = body.imageName;
    const uri: any = body.uri;

    if (!mimeType || !imageName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request" })
      }
    }

    const s3Client = new S3Client();

    const key = `users/${uuid()}/uploads/${imageName}`;
    const resp = await fetch(uri)
    const blob = await resp.blob();
    const buf = await blob.arrayBuffer();
    const content = new Uint8Array(buf);
    console.log(content);

    const command = new PutObjectCommand({
      Bucket: "hunter-s3-bucket",
      Key: key,
      ContentType: mimeType,
      Body: content
    });

    const response = await s3Client.send(command);
    console.log("Put object response >>> ", response);

    if (response.$metadata.httpStatusCode !== 201) {
      console.log("Put object error >>> ", response);
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Error occured while uploading image" })
      }
    } else {
      console.log("Put object OK response >>> ", response);
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
