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
import { aws_s3 as s3, aws_rds as rds, aws_ec2 as ec2, aws_iam as iam } from 'aws-cdk-lib';

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

    const accessLogsBucket = new s3.Bucket(this, 'HunterAccessLogsBucket', {
      bucketName: "hunter-access-logs-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      eventBridgeEnabled: true
    });
    const hunterBucket = new s3.Bucket(this, "HunterS3Bucket", {
      bucketName: "hunter-s3-bucket",
      serverAccessLogsBucket: accessLogsBucket,
      serverAccessLogsPrefix: "access-log",
      removalPolicy: cdk.RemovalPolicy.DESTROY, //switch to RETAIN in prod so bucket exists in account when removed or deleted from stack
      cors: [{
        allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.POST, s3.HttpMethods.PUT, s3.HttpMethods.DELETE],
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
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
    const ec2SecGroup = new ec2.SecurityGroup(this, "hunter-ec2-sec-group", {
      vpc: dbVpc
    });
    const createEntrySecGroup = new ec2.SecurityGroup(this, "hunter-createEntry-sec-group", {
      vpc: dbVpc
    });
    const deleteEntrySecGroup = new ec2.SecurityGroup(this, "hunter-deleteEntry-sec-group", {
      vpc: dbVpc
    });
    const getAllEntriesSecGroup = new ec2.SecurityGroup(this, "hunter-get-all-entries-sec-group", {
      vpc: dbVpc
    });
    //allow DB sec group to receive traffic from lambda function
    dbSecGroup.addIngressRule(ec2.Peer.securityGroupId(createEntrySecGroup.securityGroupId), ec2.Port.allTraffic());
    dbSecGroup.addIngressRule(ec2.Peer.securityGroupId(deleteEntrySecGroup.securityGroupId), ec2.Port.allTraffic());
    dbSecGroup.addIngressRule(ec2.Peer.securityGroupId(getAllEntriesSecGroup.securityGroupId), ec2.Port.allTraffic());

    //allow incoming to RDS instance from EC2 instance
    dbSecGroup.addIngressRule(ec2.Peer.securityGroupId(ec2SecGroup.securityGroupId), ec2.Port.allTraffic());

    //allow outbound traffic to DB sec group
    createEntrySecGroup.addEgressRule(ec2.Peer.securityGroupId(dbSecGroup.securityGroupId), ec2.Port.allTraffic());
    deleteEntrySecGroup.addEgressRule(ec2.Peer.securityGroupId(dbSecGroup.securityGroupId), ec2.Port.allTraffic());
    getAllEntriesSecGroup.addEgressRule(ec2.Peer.securityGroupId(dbSecGroup.securityGroupId), ec2.Port.allTraffic());

    //allow outbound traffic to DB sec group
    ec2SecGroup.addEgressRule(ec2.Peer.securityGroupId(dbSecGroup.securityGroupId), ec2.Port.allTraffic());
    //allow SSH connection to ec2 instance
    ec2SecGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.SSH);

    const dbSubnetGrp = new rds.SubnetGroup(this, "hunter-rds-instance-subnet-group", {
      subnetGroupName: "hunter-rds-instance-subnet-group",
      description: "Hunter RDS instance subnet group",
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      vpc: dbVpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const rdsDbInstance = new rds.DatabaseInstance(this, "hunter-rds-instance-resource", {
      databaseName: "hunter",
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
      credentials: {
        username: "postgres",
        secretName: "hunter-rds-secret"
      },
      subnetGroup: dbSubnetGrp,
    });

    const ec2InstanceKeyPair = new ec2.KeyPair(this, "hunter-ec2-keypair", {
      keyPairName: "ec2-instance-hunter-db"
    });
    new ec2.Instance(this, "ec2-instance", {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc: dbVpc,
      machineImage: ec2.MachineImage.latestAmazonLinux2023({
        edition: ec2.AmazonLinuxEdition.STANDARD,
        kernel: ec2.AmazonLinux2023Kernel.DEFAULT,
        cpuType: ec2.AmazonLinuxCpuType.X86_64
      }),
      keyPair: ec2InstanceKeyPair,
      securityGroup: ec2SecGroup,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

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
    const getPresignedUrlsLambdaLogGroup = new LogGroup(this, "GetPresignedUrlsLambdaLogGroup", {
      logGroupName: "getPresignedUrlsLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const createEntryLambdaLogGroup = new LogGroup(this, "CreateEntryLambdaLogGroup", {
      logGroupName: "createEntryLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const deleteEntryLambdaLogGroup = new LogGroup(this, "DeleteEntryLambdaLogGroup", {
      logGroupName: "deleteEntryLogs",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const getAllEntriesLambdaLogGroup = new LogGroup(this, "GetAllEntriesLambdaLogGroup", {
      logGroupName: "getAllEntriesLogs",
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
    const getPresignedUrlsLambda = new NodejsFunction(this, "GetPresignedUrlsLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "getPresignedUrls",
      functionName: "get-presigned-urls",
      entry: join(__dirname, "..", "lambda", "getPresignedUrls.ts"),
      environment: {
        REGION: this.region
      },
      logGroup: getPresignedUrlsLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON
    });
    const createEntryLambda = new NodejsFunction(this, "CreateEntryLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "createEntry",
      functionName: "create-entry",
      entry: join(__dirname, "..", "lambda", "createEntry.ts"),
      environment: {
        REGION: this.region,
        HOST: rdsDbInstance.instanceEndpoint.hostname.toString(),
        PASSWORD: rdsDbInstance.secret?.secretFullArn ? rdsDbInstance.secret.secretFullArn : ""
      },
      logGroup: createEntryLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON,
      vpc: dbVpc,
      securityGroups: [createEntrySecGroup]
    });
    const deleteEntryLambda = new NodejsFunction(this, "DeleteEntryLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "deleteEntry",
      functionName: "delete-entry",
      entry: join(__dirname, "..", "lambda", "deleteEntry.ts"),
      environment: {
        REGION: this.region,
        HOST: rdsDbInstance.instanceEndpoint.hostname.toString(),
        PASSWORD: rdsDbInstance.secret?.secretFullArn ? rdsDbInstance.secret.secretFullArn : ""
      },
      logGroup: deleteEntryLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON,
      vpc: dbVpc,
      securityGroups: [deleteEntrySecGroup]
    });
    const getAllEntriesLambda = new NodejsFunction(this, "GetAllEntriesLambda", {
      runtime: Runtime.NODEJS_22_X,
      handler: "getAllEntries",
      functionName: "get-all-entries",
      entry: join(__dirname, "..", "lambda", "getAllEntries.ts"),
      environment: {
        REGION: this.region,
        HOST: rdsDbInstance.instanceEndpoint.hostname.toString(),
        PASSWORD: rdsDbInstance.secret?.secretFullArn ? rdsDbInstance.secret.secretFullArn : ""
      },
      logGroup: getAllEntriesLambdaLogGroup,
      loggingFormat: LoggingFormat.JSON,
      vpc: dbVpc,
      securityGroups: [getAllEntriesSecGroup]
    });

    const hunterSignUpLambdaIntegration = new HttpLambdaIntegration("HunterSignUpIntegration", signUpLambda);
    const hunterSignInLambdaIntegration = new HttpLambdaIntegration("HunterSignInIntegration", signInLambda);
    const hunterSignOutLambdaIntegration = new HttpLambdaIntegration("HunterSignOutIntegration", signOutLambda);
    const hunterForgotPasswordLambdaIntegration = new HttpLambdaIntegration("HunterForgotPasswordIntegration", forgotPasswordLambda);
    const hunterResetPasswordLambdaIntegration = new HttpLambdaIntegration("HunterResetPasswordIntegration", resetPasswordLambda);
    const hunterUpdateUsernameLambdaIntegration = new HttpLambdaIntegration("HunterUpdateUsernameIntegration", updateUsernameLambda);
    const hunterGetPresignedUrlsLambdaIntegration = new HttpLambdaIntegration("HunterGetPresignedUrlsIntegration", getPresignedUrlsLambda);
    const hunterCreateEntryLambdaIntegration = new HttpLambdaIntegration("HunterCreateEntryIntegration", createEntryLambda);
    const hunterDeleteEntryLambdaIntegration = new HttpLambdaIntegration("HunterDeleteEntryIntegration", deleteEntryLambda);
    const hunterGetAllEntriesLambdaIntegration = new HttpLambdaIntegration("HunterGetAllEntriesIntegration", getAllEntriesLambda);

    const api = new apigwv2.HttpApi(
      this,
      "HunterApi",
      {
        description: "REST API for the Hunter app",
        ipAddressType: apigwv2.IpAddressType.DUAL_STACK,
        corsPreflight: {
          allowMethods: [apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.OPTIONS, apigwv2.CorsHttpMethod.DELETE],
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

    api.addRoutes({
      path: "/getPresignedUrl",
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterGetPresignedUrlsLambdaIntegration
    });

    api.addRoutes({
      path: "/createEntry",
      methods: [apigwv2.HttpMethod.POST],
      integration: hunterCreateEntryLambdaIntegration
    });

    api.addRoutes({
      path: "/deleteEntry/{id}",
      methods: [apigwv2.HttpMethod.DELETE],
      integration: hunterDeleteEntryLambdaIntegration
    });

    api.addRoutes({
      path: "/entries/{user_id}",
      methods: [apigwv2.HttpMethod.GET],
      integration: hunterGetAllEntriesLambdaIntegration
    });

    getPresignedUrlsLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ["s3:PutObject"],
      resources: [hunterBucket.arnForObjects("users/*")]
    }));

    rdsDbInstance.secret?.grantRead(createEntryLambda);
    rdsDbInstance.secret?.grantRead(deleteEntryLambda);
    rdsDbInstance.secret?.grantRead(getAllEntriesLambda);

    new cdk.CfnOutput(this, "API Gateway URL", {
      value: api.apiEndpoint,
    })
    new cdk.CfnOutput(this, "DB instance endpoint", {
      value: rdsDbInstance.instanceEndpoint.socketAddress,
    })
  }
}
