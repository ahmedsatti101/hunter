import * as cdk from 'aws-cdk-lib';
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class HunterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secret = new secretsmanager.Secret(this, "SecretsManager", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: "CognitoClientSecret"
      }
    })

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
      clientId: "google-client-id",
      clientSecretValue: secret.secretValueFromJson("CognitoClientSecret"),
      userPool: userPool
    })

    new cognito.UserPoolIdentityProviderFacebook(this, "Facebook", {
      clientId: "facebook-client-id",
      clientSecret: secret.secretValueFromJson("CognitoClientSecret").toString(),
      userPool: userPool
    })

    new cognito.UserPoolIdentityProviderApple(this, "Apple", {
      clientId: "apple-client-id",
      userPool: userPool,
      keyId: "keyId",
      teamId: "teamId",
      privateKeyValue: secret.secretValueFromJson("CognitoClientSecret")
    })
  }
}
