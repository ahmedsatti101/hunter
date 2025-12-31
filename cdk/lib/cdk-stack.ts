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
import { aws_s3 as s3, aws_rds as rds, aws_ec2 as ec2 } from 'aws-cdk-lib';

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
    const signInLambdaLogGroup = new LogGroup(this, "SignInLambdaLogGroup", {
      logGroupName: "signInLambdaLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const signOutLambdaLogGroup = new LogGroup(this, "SignOutLambdaLogGroup", {
      logGroupName: "signOutLambdaLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const forgotPasswordLambdaLogGroup = new LogGroup(this, "ForgotPasswordLambdaLogGroup", {
      logGroupName: "forgotPasswordLambdaLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const resetPasswordLambdaLogGroup = new LogGroup(this, "ResetPasswordLambdaLogGroup", {
      logGroupName: "resetPasswordLambdaLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const updateUsernameLambdaLogGroup = new LogGroup(this, "UpdateUsernameLambdaLogGroup", {
      logGroupName: "updateUsernameLambdaLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const dbLambdaLogGroup = new LogGroup(this, "dbLambdaLogGroup", {
      logGroupName: "dbLambdaLogs",
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
    const signInLambda = new NodejsFunction(this, "SignInLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "signin",
      functionName: "signin-function",
      entry: join(__dirname, "..", "lambda", "signin.ts"),
      environment: {
        REGION: this.region,
        APP_CLIENT_ID: userPoolClient.userPoolClientId
      },
      loggingFormat: LoggingFormat.JSON,
      logGroup: signInLambdaLogGroup
    });
    const signOutLambda = new NodejsFunction(this, "SignOutLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "signout",
      functionName: "signout-function",
      entry: join(__dirname, "..", "lambda", "signout.ts"),
      environment: {
        REGION: this.region
      },
      logGroup: signOutLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON
    });
    const forgotPasswordLambda = new NodejsFunction(this, "ForgotPasswordLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "forgotPassword",
      functionName: "forgot-password-function",
      entry: join(__dirname, "..", "lambda", "forgotPassword.ts"),
      environment: {
        REGION: this.region,
        APP_CLIENT_ID: userPoolClient.userPoolClientId
      },
      logGroup: forgotPasswordLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON
    });
    const resetPasswordLambda = new NodejsFunction(this, "ResetPasswordLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "resetPassword",
      functionName: "reset-password-function",
      entry: join(__dirname, "..", "lambda", "resetPassword.ts"),
      environment: {
        REGION: this.region,
        APP_CLIENT_ID: userPoolClient.userPoolClientId
      },
      logGroup: resetPasswordLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON
    });
    const updateUsernameLambda = new NodejsFunction(this, "UpdateUsernameLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "updateUsername",
      functionName: "update-username-function",
      entry: join(__dirname, "..", "lambda", "updateUsername.ts"),
      environment: {
        REGION: this.region,
      },
      logGroup: updateUsernameLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON
    });

    const hunterSignUpLambdaIntegration = new HttpLambdaIntegration("HunterSignUpIntegration", signUpLambda);
    const hunterSignInLambdaIntegration = new HttpLambdaIntegration("HunterSignInIntegration", signInLambda);
    const hunterSignOutLambdaIntegration = new HttpLambdaIntegration("HunterSignOutIntegration", signOutLambda);
    const hunterForgotPasswordLambdaIntegration = new HttpLambdaIntegration("HunterForgotPasswordIntegration", forgotPasswordLambda);
    const hunterResetPasswordLambdaIntegration = new HttpLambdaIntegration("HunterResetPasswordIntegration", resetPasswordLambda);
    const hunterUpdateUsernameLambdaIntegration = new HttpLambdaIntegration("HunterUpdateUsernameIntegration", updateUsernameLambda);

    const api = new apigwv2.HttpApi(
      this,
      "HunterApi",
      {
        description: "REST API for the Hunter app",
        ipAddressType: apigwv2.IpAddressType.DUAL_STACK,
        corsPreflight: {
          allowMethods: [apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.OPTIONS],
          allowHeaders: ['Content-Type', 'Authorization'],
          allowOrigins: ["*"]
        }
      }
    );

    api.addRoutes({
      path: '/signup',
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterSignUpLambdaIntegration
    });

    api.addRoutes({
      path: "/signin",
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterSignInLambdaIntegration
    });

    api.addRoutes({
      path: "/signout",
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterSignOutLambdaIntegration
    });

    api.addRoutes({
      path: "/forgotPassword",
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterForgotPasswordLambdaIntegration
    });

    api.addRoutes({
      path: "/resetPassword",
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterResetPasswordLambdaIntegration
    });

    api.addRoutes({
      path: "/updateUsername",
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterUpdateUsernameLambdaIntegration
    });

    const accessLogsBucket = new s3.Bucket(this, 'HunterAccessLogsBucket', {
      bucketName: "hunter-access-logs-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      eventBridgeEnabled: true
    });
    new s3.Bucket(this, "HunterS3Bucket", {
      bucketName: "hunter-s3-bucket",
      serverAccessLogsBucket: accessLogsBucket,
      serverAccessLogsPrefix: "access-log",
      removalPolicy: cdk.RemovalPolicy.DESTROY, //switch to RETAIN in prod so bucket exists in account when removed or deleted from stack
      cors: [{
        allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.POST, s3.HttpMethods.PUT, s3.HttpMethods.DELETE],
        allowedOrigins: ["*"],
        maxAge: 3600
      }],
      autoDeleteObjects: true, //remove when removal policy is switched to RETAIN
      eventBridgeEnabled: true
    });

    const dbVpc = new ec2.Vpc(this, "hunter-rds-instance-vpc", {
      ipAddresses: ec2.IpAddresses.cidr("21.0.0.0/16"),
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: "RDS public subnet",
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          name: "RDS private subnet",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        }
      ],
      natGateways: 1
    });

    const dbSecGroup = new ec2.SecurityGroup(this, "hunter-rds-instance-sec-group", {
      securityGroupName: "hunter-db-instance-sec-group",
      description: "Security group for private access to RDS DB instance",
      vpc: dbVpc,
    });

    const lambdaDbSecGroup = new ec2.SecurityGroup(this, "db-lambda-sec-group", {
      securityGroupName: "DB lambda sec group",
      vpc: dbVpc,
    });

    //allow DB sec group to receive traffic from lambda function
    dbSecGroup.addIngressRule(ec2.Peer.securityGroupId(lambdaDbSecGroup.securityGroupId), ec2.Port.allTraffic());
    //allow outbound traffic to DB sec group
    lambdaDbSecGroup.addEgressRule(ec2.Peer.securityGroupId(dbSecGroup.securityGroupId), ec2.Port.allTraffic());

    const dbSubnetGrp = new rds.SubnetGroup(this, "hunter-rds-instance-subnet-group", {
      subnetGroupName: "hunter-rds-instance-subnet-group",
      description: "Hunter RDS instance subnet group",
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      vpc: dbVpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const rdsDbInstance = new rds.DatabaseInstance(this, "hunter-rds-instance-resource", {
      allocatedStorage: 20,
      availabilityZone: "eu-west-2b",
      instanceType: new ec2.InstanceType("t4g.micro"),
      instanceIdentifier: "hunter-rds-instance",
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_17_6 }),
      maxAllocatedStorage: 20,
      storageType: rds.StorageType.GP2,
      //deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      vpc: dbVpc,
      securityGroups: [dbSecGroup],
      credentials: rds.Credentials.fromGeneratedSecret("postgres"),
      subnetGroup: dbSubnetGrp,
    });

    const hunterDbLambdaIntegration = new HttpLambdaIntegration("HunterDbUsernameIntegration", new NodejsFunction(this, "DBLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "db",
      functionName: "db-lambda",
      entry: join(__dirname, "..", "lambda", "db.ts"),
      environment: {
        DB_PASSWORD: rdsDbInstance.secret ? rdsDbInstance.secret.secretValue.unsafeUnwrap() : "",
        DB_HOST: rdsDbInstance.instanceEndpoint.hostname,
        DB_PORT: rdsDbInstance.instanceEndpoint.port.toString()
      },
      logGroup: dbLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON,
      securityGroups: [lambdaDbSecGroup],
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      vpc: dbVpc,
    }));

    api.addRoutes({
      path: "/entry",
      integration: hunterDbLambdaIntegration,
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST, apigwv2.HttpMethod.PATCH, apigwv2.HttpMethod.DELETE]
    });

    new cdk.CfnOutput(this, "API Gateway URL", {
      value: api.apiEndpoint,
    })
    new cdk.CfnOutput(this, "DB instance endpoint", {
      value: rdsDbInstance.instanceEndpoint.socketAddress,
    })
  }
}
