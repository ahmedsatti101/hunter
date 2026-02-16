import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Pool, QueryResult } from "pg";
import { getDbPassword } from "./util/getDbPassword";

export async function getAllEntries(event: APIGatewayProxyEventV2) {
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

  const userId = event.pathParameters ? event.pathParameters.user_id : undefined;
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid User ID"
      })
    }
  }
  const status = event.queryStringParameters?.status;

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
    let query = `SELECT * FROM entries WHERE user_id=$1`;

    if (status) query += ` AND status=$2`;
    let entries: QueryResult<any>;

    if (!status) {
      entries = await dbClient.query(query, [userId])
    } else {
      entries = await dbClient.query(query, [userId, status]);
    }

    if (entries.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No entries found"
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: entries.rows
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
