import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand
} from "@aws-sdk/client-cognito-identity-provider";

export async function signout(event: any) {
  try {
    const body = JSON.parse(event.body);
    const token: string | undefined = body.token;

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid token" })
      }
    };

    const region = process.env.REGION;
    if (!region) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Invalid region" })
      }
    };

    const client = new CognitoIdentityProviderClient({ region });
    const command = new GlobalSignOutCommand({
      AccessToken: token
    });
    const response = await client.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({ message: response.$metadata })
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Signed out"
      })
    };
  } catch (error: any) {
    return {
      statusCode: error.$metadata.httpStatusCode,
      body: JSON.stringify({ message: error.message })
    }
  }
}
