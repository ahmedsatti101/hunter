import { APIGatewayProxyEventV2 } from "aws-lambda";
import { getDbPassword } from "./util/getDbPassword";
import { Pool } from "pg";

export async function updateEntry(event: APIGatewayProxyEventV2) {
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
        message: "Error with request body"
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

  try {
    await dbClient.query("BEGIN");
    const result = await dbClient.query(
      "UPDATE entries SET title = $1, description = $2, employer = $3, contact = $4, status = $5, submission_date = $6, location = $7, notes = $8, found_where = $9 WHERE id = $10 RETURNING id",
      [body.title, body.description, body.employer, body.contact, body.status, body.submissionDate,
      body.location, body.notes, body.foundWhere, body.id]
    );

    if (result.rowCount === 0) throw new Error(`No entry found in DB with ID: ${body.id}`);

    await dbClient.query("COMMIT");
    console.log("changes committed");

    return {
      statusCode: 204
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message || "An unknown database error occurred",
        dbCodeErr: error.code,
        severity: error.severity,
      })
    };
  } finally {
    dbClient.release();
  }
}
