import {
  AttributeType,
  CognitoIdentityProviderClient,
  NotAuthorizedException,
  TooManyRequestsException,
  UpdateUserAttributesCommand,
  UserNotConfirmedException
} from "@aws-sdk/client-cognito-identity-provider";

export async function updateUsername(event: any) {
  try {
    const body = JSON.parse(event.body);
    const token: string | undefined = body.token;
    const attributes: AttributeType[] | undefined = body.attributes;

    if (!token || !attributes) {
      return {
        statusCode: 400,
        body: {
          message: "Invalid request"
        }
      }
    }

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
    const command = new UpdateUserAttributesCommand({
      AccessToken: token,
      UserAttributes: attributes
    });
    const response = await client.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({
          message: "Error updating username"
        })
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully updated username"
      })
    };
  } catch (err: any) {
    if (err instanceof NotAuthorizedException) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Not authorized to perform this action" })
      }
    } else if (err instanceof TooManyRequestsException) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Too many requests. Please try again later." })
      }
    } else if (err instanceof UserNotConfirmedException) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Please confirm your account first" })
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error", error: err.message || err.toString() }),
      };
    }
  }
}
