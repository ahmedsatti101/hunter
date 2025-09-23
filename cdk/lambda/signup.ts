import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export async function signup(event: any) {
  try {
    const body = typeof event?.body === "string" ? JSON.parse(event.body) : event?.body;
    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields: email and password" }),
      };
    }

    const region = process.env.REGION;
    const clientId = process.env.APP_CLIENT_ID;
    if (!region || !clientId) {
      console.error("Missing env config", { region, clientId });
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Server configuration error" }),
      };
    }

    const client = new CognitoIdentityProviderClient({ region });
    const command = new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
    });

    const response = await client.send(command);
    console.log("Cognito signUp response:", response);

    if (response.$metadata?.httpStatusCode !== 200) {
      console.error("Unexpected signUp status:", response.$metadata);
      return { statusCode: 500, body: JSON.stringify({ message: "Sign up failed" }) };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Account created",
        userConfirmed: response.UserConfirmed,
        userSub: response.UserSub,
      }),
    };
  } catch (err: any) {
    console.error("Sign up error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error: err.message || err.toString() }),
    };
  }
}
