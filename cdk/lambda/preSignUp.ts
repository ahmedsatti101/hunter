import {
  CognitoIdentityProviderClient,
  AdminLinkProviderForUserCommand,
  ListUsersCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { PreSignUpTriggerEvent } from "aws-lambda";

export async function preSignUp(event: PreSignUpTriggerEvent) {
  const region = process.env.REGION;
  const userPoolId = event.userPoolId;
  const client = new CognitoIdentityProviderClient({ region });

  if (event.triggerSource === "PreSignUp_ExternalProvider") {
    const email = event.request.userAttributes.email;

    const listUsers = new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `email = "${email}"`,
      Limit: 1
    });

    const { Users } = await client.send(listUsers);

    if (Users && Users.length > 0) {
      const nativeUsername = Users[0].Username;

      const [providerName, providerUserId] = event.userName.split("_");

      const linkCommand = new AdminLinkProviderForUserCommand({
        UserPoolId: userPoolId,
        DestinationUser: {
          ProviderName: "Cognito",
          ProviderAttributeValue: nativeUsername,
        },
        SourceUser: {
          ProviderName: providerName === "Google" ? "Google" : "Facebook",
          ProviderAttributeName: "Cognito_Subject",
          ProviderAttributeValue: providerUserId,
        },
      });

      await client.send(linkCommand);
    }
  }

  return event;
}
