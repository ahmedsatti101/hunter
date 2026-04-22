import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Pool } from "pg";
import { getDbPassword } from "./util/getDbPassword";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function deleteScreenshot(event: APIGatewayProxyEventV2) {
  const region = process.env.REGION;
  const dbHost = process.env.HOST;
  const dbPassword = process.env.PASSWORD;
  if (!region) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Invalid AWS region"
      })
    }
  };

  if (!dbHost || !dbPassword) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Invalid DB credentials"
      })
    }
  }

  const body = event.body ? JSON.parse(event.body) : undefined;
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid body"
      })
    }
  };

  const pool = new Pool({
    user: "postgres",
    password: await getDbPassword(region, dbPassword),
    host: dbHost,
    port: 5432,
    database: "hunter",
    ssl: {
      rejectUnauthorized: false
    }
  });
  const dbClient = await pool.connect();

  const s3Client = new S3Client({ region });
  const s3Command = new DeleteObjectCommand({
    Bucket: "hunter-s3-bucket",
    Key: body.key
  });

  try {
    await s3Client.send(s3Command);

    await dbClient.query("BEGIN");
    console.log("transaction started...");

    await dbClient.query("UPDATE screenshots SET url = array_remove(url, $1)", [body.key]);

    await dbClient.query("COMMIT");
    console.log("changes committed");

    return {
      statusCode: 204
    }
  } catch (error: any) {
    await dbClient.query("ROLLBACK");
    console.log("changes rolled back")
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message || "An unknown database error occurred",
        dbCodeErr: error.code,
        severity: error.severity,
      })
    }
  } finally {
    dbClient.release();
  }
}
