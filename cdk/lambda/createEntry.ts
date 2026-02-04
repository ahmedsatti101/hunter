import { APIGatewayProxyEventV2 } from "aws-lambda";
import { Client } from "pg";
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
  enum Status {
    APPLIED = "Applied",
    SUCCESSFUL = "Successful",
    UNSUCCESSFUL = "Unsuccessful",
    INTERVIEW = "Going for interview",
    DECLINED = "Declined offer",
    OFFER = "Role offered",
    NOT_STARTED = "Not started",
    INTERVIEW_SCHEDULED = "Interview scheduled",
    INTERVIEWED = "Interviewed",
    ASSESSMENT = "Complete assessment",
    ASSESSMENT_COMPLETED = "Assessment completed"
  };

  interface Entry {
    title: string;
    description: string;
    employer: string;
    contact: string | undefined;
    status: Status;
    submissionDate: Date;
    location: string | undefined;
    notes: string | undefined;
    foundWhere: string;
    screenshots: string[] | undefined;
  };

  const body: Entry = event.body ? JSON.parse(event.body) : undefined;
  console.log("req body >>> ", body);
  if (!body) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error with request body"
      })
    }
  };

  const dbClient = await new Client({
    user: "postgres",
    password: await getDbPassword(region, dbPassword),
    host: dbHost,
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  }).connect();

  try {
    const q = await dbClient.query("SELECT NOW()");
    console.log("Successful database query >>> ", q);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Successfully connected with DB"
      })
    }
  } catch (error) {
    console.log("createEntry err >>> ", error);
    console.log("typeof err >>> ", typeof error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error
      })
    }
  } finally {
    await dbClient.end();
  }
}
