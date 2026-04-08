import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Pool } from "pg";
import { getDbPassword } from "./util/getDbPassword";
import { getScreenshots } from "./util/getScreenshots";

export async function getEntry(event: APIGatewayProxyEventV2) {
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
    const entry = await dbClient.query("SELECT * FROM entries WHERE id=$1", [id]);
    const entryScrnshots = await dbClient.query("SELECT * FROM screenshots WHERE entry_id=$1", [id]);

    if (entry.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No entry found"
        })
      }
    }
    const screenshots = await getScreenshots(region, entryScrnshots.rows[0].url);

    if (screenshots) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          entry: entry.rows[0],
          screenshots
        })
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Could not retrieve job application"
      })
    }
  } catch (error: any) {
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
