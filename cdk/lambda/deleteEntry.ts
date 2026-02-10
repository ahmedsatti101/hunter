import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Pool } from "pg";
import { getDbPassword } from "./util/getDbPassword";

export async function deleteEntry(event: APIGatewayProxyEventV2) {
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

  const id = event.pathParameters ? event.pathParameters.id : undefined;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid ID"
      })
    }
  }
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

  try {
    await dbClient.query("BEGIN");
    console.log("transaction started...");

    await dbClient.query("DELETE FROM screenshots WHERE entry_id=$1", [id]);
    await dbClient.query("DELETE FROM entries WHERE id=$1", [id]);

    await dbClient.query("COMMIT");
    console.log("changes committed");
    return {
      statusCode: 204,
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
