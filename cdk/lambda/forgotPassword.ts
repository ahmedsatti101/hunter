import {
  CodeDeliveryFailureException,
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  LimitExceededException,
  NotAuthorizedException,
  TooManyRequestsException,
  UserNotFoundException
} from "@aws-sdk/client-cognito-identity-provider";

export async function forgotPassword(event: any) {
  try {
    const body = JSON.parse(event.body);
    const email: string = body.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid email address" })
      }
    }

    const region = process.env.REGION;
    if (!region) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid region" })
      };
    };

    const clientId = process.env.APP_CLIENT_ID;
    if (!clientId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Something went wrong" })
      }
    }

    const client = new CognitoIdentityProviderClient({ region });
    const command = new ForgotPasswordCommand({
      ClientId: clientId,
      Username: email
    });
    const response = await client.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "An error occured" })
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Password reset code sent to ${response.CodeDeliveryDetails?.Destination}` })
    }
  } catch (error: any) {
    if (error instanceof UserNotFoundException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "No account matches this email address" })
      }
    } else if (error instanceof TooManyRequestsException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Too many requests were made. Please try again later." })
      }
    } else if (error instanceof LimitExceededException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Too many requests were made. Please try again later." })
      }
    } else if (error instanceof CodeDeliveryFailureException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Could not deliver code." })
      }
    } else if (error instanceof NotAuthorizedException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "User not authorized to perform this action." })
      }
    } else {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Something went wrong" })
      }
    }
  }
}
