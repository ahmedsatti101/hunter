import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cognito from "aws-cdk-lib/aws-cognito";
import { LoggingFormat, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { join } from 'path';

export class HunterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const googleSecretWeb = secretsmanager.Secret.fromSecretAttributes(this, "GoogleSecretWeb", {
      secretCompleteArn: "arn:aws:secretsmanager:eu-west-2:533267263969:secret:hunter-web-app-secret-FvRsYI"
    });

    const googleClientIdWeb = ssm.StringParameter.fromStringParameterName(this, "GoogleClientIdParam", "/hunter/google/client-id").stringValue;

    const facebookAppId = ssm.StringParameter.fromStringParameterName(
      this, 'FacebookAppIdParam', '/hunter/facebook/app-id'
    ).stringValue;

    const facebookAppSecret = ssm.StringParameter.fromStringParameterName(
      this, 'FacebookAppSecretParam', '/hunter/facebook/app-secret'
    ).stringValue;

    const userPool = new cognito.UserPool(this, "hunter-userpool", {
      selfSignUpEnabled: true,
      userPoolName: "hunter-users",
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.LINK,
        emailSubject: "Verify your new account with Hunter",
        emailBody: "Thank you for creating an account with Hunter. Please click {##here##} to verify your new account. The verification link will expire in 24 hours."
      },
      signInAliases: {
        email: true,
        username: false
      },
      autoVerify: { email: true },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        preferredUsername: {
          required: false,
          mutable: true
        }
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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

    userPool.addDomain("HunterCognitoDomain", {
      cognitoDomain: {
        domainPrefix: "hunter"
      }
    });

    const userPoolClient = userPool.addClient("HunterCognitoAppClient", {
      authFlows: {
        userPassword: true
      },
      readAttributes: new cognito.ClientAttributes().withStandardAttributes({ email: true, preferredUsername: true }),
      writeAttributes: new cognito.ClientAttributes().withStandardAttributes({ email: true, preferredUsername: true }),
    });

    new cognito.UserPoolIdentityProviderGoogle(this, "Google", {
      clientId: googleClientIdWeb,
      clientSecretValue: googleSecretWeb.secretValueFromJson("hunter-web-app-client-secret"),
      userPool
    })

    new cognito.UserPoolIdentityProviderFacebook(this, "Facebook", {
      clientId: facebookAppId,
      clientSecret: facebookAppSecret,
      userPool
    })

    const signUpLambdaLogGroup = new LogGroup(this, "SignUpLambdaLogGroup", {
      logGroupName: "signUpLambdaLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const signUpLambda = new NodejsFunction(this, "SignUpLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "signup",
      functionName: "signup-function",
      entry: join(__dirname, "..", "lambda", "signup.ts"),
      environment: {
        REGION: this.region,
        APP_CLIENT_ID: userPoolClient.userPoolClientId
      },
      loggingFormat: LoggingFormat.JSON,
      logGroup: signUpLambdaLogGroup
    });

    const hunterSignUpLambdaIntegration = new HttpLambdaIntegration("HunterSignUpIntegration", signUpLambda);

    const api = new apigwv2.HttpApi(this, "HunterApi", { description: "REST API for the Hunter app", ipAddressType: apigwv2.IpAddressType.DUAL_STACK, corsPreflight: { allowMethods: [apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.GET], allowOrigins: ["*"] } });

    api.addRoutes({
      path: '/signup',
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterSignUpLambdaIntegration
    });

    new cdk.CfnOutput(this, "output", {
      value: api.apiEndpoint
    })
  }
}
