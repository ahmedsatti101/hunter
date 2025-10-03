import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  NotAuthorizedException,
  PasswordResetRequiredException,
  TooManyRequestsException,
  UserNotConfirmedException,
  UserNotFoundException
} from "@aws-sdk/client-cognito-identity-provider";

export async function signin(event: any) {
  try {
    const body = JSON.parse(event.body);
    const email: string = body.email;
    const password: string = body.password;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: {
          message: "Email or password not provided"
        }
      }
    };

    const clientId = process.env.APP_CLIENT_ID;
    if (!clientId) {
      return {
        statusCode: 400,
        body: {
          message: "Invalid Cognito parameter"
        }
      }
    };

    const region = process.env.REGION;
    if (!region) {
      return {
        statusCode: 400,
        body: {
          message: "Invalid region"
        }
      }
    };

    const client = new CognitoIdentityProviderClient({ region });
    const command = new InitiateAuthCommand({
      ClientId: clientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        "USERNAME": email,
        "PASSWORD": password
      }
    });
    const response = await client.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({
          message: "Error occured while signing up"
        })
      }
    };

    const getUserAttributes = new GetUserCommand({
      AccessToken: response.AuthenticationResult?.AccessToken
    });
    const getUserResponse = await client.send(getUserAttributes);

    if (getUserResponse.$metadata.httpStatusCode !== 200) {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({
          message: "Error retriving user data"
        })
      }
    }

    let username: string | undefined;

    if (getUserResponse.UserAttributes) {
      if (getUserResponse.UserAttributes[1].Name === "preferred_username") {
        username = getUserResponse.UserAttributes[1].Value
      } else {
        username = undefined
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully signed in",
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
        expiresIn: response.AuthenticationResult?.ExpiresIn,
        tokenType: response.AuthenticationResult?.TokenType,
        email: getUserResponse.UserAttributes ? getUserResponse.UserAttributes[0].Value : undefined,
        username
      })
    };
  } catch (error: any) {
    if (error instanceof UserNotConfirmedException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "User not confirmed" })
      }
    } else if (error instanceof UserNotFoundException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "User not found" })
      }
    } else if (error instanceof PasswordResetRequiredException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Password reset required" })
      }
    } else if (error instanceof TooManyRequestsException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Too many requests. Please try again later." })
      }
    } else if (error instanceof NotAuthorizedException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Incorrect username or password" })
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Something when wrong" })
      };
    };
  };
};
