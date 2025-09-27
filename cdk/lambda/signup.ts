import {
  CodeDeliveryFailureException,
  CognitoIdentityProviderClient,
  InvalidPasswordException,
  SignUpCommand,
  UsernameExistsException
} from "@aws-sdk/client-cognito-identity-provider";

export async function signup(event: any) {
  try {
    const body = JSON.parse(event.body);
    const email: string = body.email;
    const password: string = body.password;
    const preferredUsername: string = body.username;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields: email and password" }),
      };
    }

    const region = process.env.REGION;
    const clientId = process.env.APP_CLIENT_ID;

    if (!region || !clientId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Something went wrong" }),
      };
    }

    const client = new CognitoIdentityProviderClient({ region });
    const command = new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email },
      ...(preferredUsername ? [{ Name: "preferred_username", Value: preferredUsername }] : [])]
    });

    const response = await client.send(command);

    if (response.$metadata?.httpStatusCode !== 200) {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "There was an error during the sign up process" })
      };
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
    if (err instanceof UsernameExistsException) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Account already exists" })
      }
    } else if (err instanceof CodeDeliveryFailureException) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Error delivering verification email" })
      }
    } else if (err instanceof InvalidPasswordException) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid password format" })
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error", error: err.message || err.toString() }),
      };
    }
  }
}
