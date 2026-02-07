import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Pool } from "pg";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

const getDbPassword = async (region: string, secretId: string): Promise<string | undefined> => {
  const client = new SecretsManagerClient({ region });
  try {
    const res = await client.send(
      new GetSecretValueCommand({
        SecretId: secretId
      })
    );

    if (!res.SecretString) {
      return undefined
    }

    const secret = JSON.parse(res.SecretString);
    return secret.password;
  } catch (error) {
    throw error;
  }
};

export async function createEntry(event: APIGatewayProxyEventV2) {
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
    console.log("transaction started...");
    const query = {
      text: 'INSERT INTO entries(user_id, title, description, employer, contact, status, submission_date, location, notes, found_where) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      values: [body.userId, body.title, body.description, body.employer, body.contact, body.status, body.submissionDate, body.location, body.notes, body.found],
    }
    const entriesQuery = await dbClient.query(query);
    console.log("Successful entriesQuery query >>> ", entriesQuery);

    const screenshotsQuery = await dbClient.query("INSERT INTO screenshots(entry_id, url) VALUES($1, $2)", [entriesQuery.rows[0].id, body.key])
    console.log("Successful screenshotsQuery query >>> ", screenshotsQuery);

    await dbClient.query("COMMIT");
    console.log("changes committed");
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Successfully recorded job application"
      })
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
