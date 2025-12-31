import { Client } from "pg";

export async function db(event: any) {
  const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  console.log(httpMethod);
  const dbPassword = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;

  if (!dbHost || !dbPassword || !dbPort) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid connection values" })
    };
  }

  const client = new Client({
    user: "postgres",
    password: JSON.parse(dbPassword).password,
    host: dbHost,
    port: parseInt(dbPort),
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  try {
    const q = await client.query("SELECT NOW()");
    console.log(q);
    console.log("Client disconnected");
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }

  //Make request to internet
  try {
    const req = await fetch("https://api.github.com");
    const res = await req.json();

    return {
      statusCode: req.status,
      body: JSON.stringify(res)
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: {
        message: "Could not make request to internet :("
      }
    }
  }
}
