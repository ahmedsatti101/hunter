import {
  CodeMismatchException,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ExpiredCodeException,
  InvalidPasswordException,
  LimitExceededException,
  NotAuthorizedException,
  PasswordHistoryPolicyViolationException,
  TooManyRequestsException,
  UserNotConfirmedException,
  UserNotFoundException
} from "@aws-sdk/client-cognito-identity-provider";

export async function resetPassword(event: any) {
  try {
    const body = JSON.parse(event.body);
    const email: string | undefined = body.email;
    const code: string | undefined = body.code;
    const newPassword: string | undefined = body.newPassword;

    if (!email || !code || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Could not perform password reset action" })
      }
    }

    const region = process.env.REGION;
    if (!region) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid region" })
      }
    }

    const clientId = process.env.APP_CLIENT_ID;
    if (!clientId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Error occured during password reset attempt" })
      }
    }

    const client = new CognitoIdentityProviderClient({ region });
    const command = new ConfirmForgotPasswordCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    });
    const response = await client.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Password reset action failed" })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password has been successfully reset" })
    }
  } catch (error: any) {
    if (error instanceof CodeMismatchException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Invalid code provided" })
      }
    } else if (error instanceof PasswordHistoryPolicyViolationException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Password has been previously used" })
      }
    } else if (error instanceof ExpiredCodeException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Code expired" })
      }
    } else if (error instanceof InvalidPasswordException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Invalid password format" })
      }
    } else if (error instanceof LimitExceededException || error instanceof TooManyRequestsException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Too many requests were made. Please try again later." })
      }
    } else if (error instanceof NotAuthorizedException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Not authorized to perform this action" })
      }
    } else if (error instanceof UserNotFoundException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Account not found" })
      }
    } else if (error instanceof UserNotConfirmedException) {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Account not confirmed" })
      }
    } else {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: "Something went wrong" })
      }
    }
  }
};
