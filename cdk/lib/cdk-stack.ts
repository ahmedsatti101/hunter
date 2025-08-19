import * as cdk from 'aws-cdk-lib';
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

export class HunterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const googleSecretWeb = secretsmanager.Secret.fromSecretAttributes(this, "GoogleSecretWeb", {
      secretCompleteArn: "arn:aws:secretsmanager:eu-west-2:533267263969:secret:hunter-web-app-secret-FvRsYI"
    });

    const facebookSecret = secretsmanager.Secret.fromSecretAttributes(this, "FacebookSecret", {
      secretCompleteArn: "arn:aws:secretsmanager:eu-west-2:533267263969:secret:hunter-facebook-secret-hurFtR"
    });

    const secretManagerClient = new SecretsManagerClient({
      region: "eu-west-2"
    })
    let secret = async () => {
      await secretManagerClient.send(
        new GetSecretValueCommand({
          SecretId: "arn:aws:secretsmanager:eu-west-2:533267263969:secret:hunter-web-app-secret-FvRsYI"
        })
      ).then((sec) => { return sec.SecretString })
    }

    const userPool = new cognito.UserPool(this, "hunter-userpool", {
      userPoolName: "hunter-users",
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.LINK,
        emailSubject: "Verify your new account with Hunter",
        emailBody: "Thank you for creating an account with Hunter. Please click {##here##} to verify your new account."
      },
      signInAliases: {
        email: true
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      passwordPolicy: {
        minLength: 12,
        passwordHistorySize: 1,
        requireDigits: true,
        requireLowercase: true,
        requireSymbols: true,
        requireUppercase: true
      },
      signInPolicy: { allowedFirstAuthFactors: { password: true } }
    });

    new cognito.UserPoolIdentityProviderGoogle(this, "Google", {
      clientId: googleSecretWeb.secretValueFromJson("hunter-web-app-client-id").unsafeUnwrap(),
      clientSecretValue: googleSecretWeb.secretValueFromJson("hunter-web-app-client-secret"),
      userPool: userPool
    })

    new cognito.UserPoolIdentityProviderFacebook(this, "Facebook", {
      clientId: facebookSecret.secretValueFromJson("hunter-facebook-app-id").unsafeUnwrap(),
      clientSecret: facebookSecret.secretValueFromJson("hunter-facebook-app-secret").unsafeUnwrap(),
      userPool: userPool
    })
  }
}
