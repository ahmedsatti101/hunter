import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { HunterStack } from '../lib/cdk-stack';

const app = new cdk.App();
const stack = new HunterStack(app, "HunterStack");
const template = Template.fromStack(stack);

describe("Hunter user pool tests", () => {
  test('Cognito user pool created', () => {
    template.resourceCountIs("AWS::Cognito::UserPool", 1);
  });

  test("Cognito user pool resource should have the correct configured properties", () => {
    template.hasResourceProperties('AWS::Cognito::UserPool', {
      VerificationMessageTemplate: {
        DefaultEmailOption: "CONFIRM_WITH_LINK",
        EmailMessageByLink: "Thank you for creating an account with Hunter. Please click {##here##} to verify your new account. The verification link will expire in 24 hours.",
        EmailSubjectByLink: "Verify your new account with Hunter"
      },
      UserPoolName: "hunter-users",
      AccountRecoverySetting: {
        RecoveryMechanisms: [{
          Name: "verified_email",
          Priority: 1
        }],
      },
      Policies: {
        PasswordPolicy: {
          MinimumLength: 12,
          RequireLowercase: true,
          RequireNumbers: true,
          RequireSymbols: true,
          RequireUppercase: true,
          PasswordHistorySize: 1
        },
        SignInPolicy: {
          AllowedFirstAuthFactors: ["PASSWORD"]
        }
      },
      UsernameAttributes: ["email"],
      Schema: [
        {
          Name: "email",
          Required: true,
          Mutable: true
        },
        {
          Name: "preferred_username",
          Required: false,
          Mutable: true
        }
      ],
      AutoVerifiedAttributes: ["email"],
    });
  })
});

describe("User pool domain", () => {
  test("The user pool must have a domain name", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolDomain", {
      Domain: "hunter"
    });
  });
});

describe("User pool client", () => {
  test("The user pool must have a app client with the correct configuration", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
      ExplicitAuthFlows: [
        "ALLOW_USER_PASSWORD_AUTH",
        "ALLOW_REFRESH_TOKEN_AUTH"
      ],
      ReadAttributes: [
        "email",
        "preferred_username"
      ],
      WriteAttributes: [
        "email",
        "preferred_username"
      ]
    })
  })
})

describe("User pool identity providers tests", () => {
  test('A Google identity provider should be created for hunter-users user pool', () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolIdentityProvider", {
      ProviderType: "Google",
    })
  })
  test('A Facebook identity provider should be created for hunter-users user pool', () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolIdentityProvider", {
      ProviderType: "Facebook",
    })
  })
})

describe("Lambda config tests", () => {
  test("A sign up lambda should be created with the correct configuration", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "signup-function",
      Handler: "index.signup",
      Runtime: "nodejs22.x",
      LoggingConfig: {
        LogFormat: "JSON"
      }
    });
  });
  test("A sign in lambda should be created with the correct configuration", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "signin-function",
      Handler: "index.signin",
      Runtime: "nodejs22.x",
      LoggingConfig: {
        LogFormat: "JSON"
      }
    })
  });
  test("A sign out lambda should be created with the correct configuration", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "signout-function",
      Handler: "index.signout",
      Runtime: "nodejs22.x",
      LoggingConfig: {
        LogFormat: "JSON"
      }
    });
  });
  test("A forgot password lambda should be created with the correct configuration", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "forgot-password-function",
      Handler: "index.forgotPassword",
      Runtime: "nodejs22.x",
      LoggingConfig: {
        LogFormat: "JSON"
      }
    });
  });
  test("A reset password lambda should be created with the correct configuration", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "reset-password-function",
      Handler: "index.resetPassword",
      Runtime: "nodejs22.x",
      LoggingConfig: {
        LogFormat: "JSON"
      }
    });
  });
});

test("An API Gateway resource should be created with the correct configuration", () => {
  template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
    CorsConfiguration: {
      AllowMethods: [
        "POST",
        "GET"
      ],
      AllowOrigins: ["*"]
    },
    Description: "REST API for the Hunter app",
    IpAddressType: "dualstack",
    Name: "HunterApi",
    ProtocolType: "HTTP"
  });
});

describe("Lambda log group tests", () => {
  test("Sign up lambda log group should be created", () => {
    template.hasResource("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
      Properties: {
        LogGroupName: "signUpLambdaLogs",
      }
    });
  });
  test("Sign in lambda log group should be created", () => {
    template.hasResource("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
      Properties: {
        LogGroupName: "signInLambdaLogs",
      }
    });
  });
  test("Sign out lambda log group should be created", () => {
    template.hasResource("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
      Properties: {
        LogGroupName: "signOutLambdaLogs"
      }
    });
  });
  test("Forgot password lambda log group should be created", () => {
    template.hasResource("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
      Properties: {
        LogGroupName: "forgotPasswordLambdaLogs"
      }
    });
  })
  test("Reset password lambda log group should be created", () => {
    template.hasResource("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
      Properties: {
        LogGroupName: "resetPasswordLambdaLogs"
      }
    });
  })
});

describe("AWS S3", () => {
  test("An AWS S3 bucket resource should be created with the correct properties", () => {
    template.hasResource("AWS::S3::Bucket", {
      Properties: {
        BucketName: "hunter-s3-bucket",
        CorsConfiguration: {
          CorsRules: [
            {
              AllowedMethods: ["GET", "POST", "PUT", "DELETE"],
              AllowedOrigins: ["*"],
              MaxAge: 3600
            }
          ]
        },
        LoggingConfiguration: {
          LogFilePrefix: "access-log"
        }
      },
      DeletionPolicy: "Delete"
    });
  });

  test("An AWS S3 bucket resource for storing access logs should be created with the correct properties", () => {
    template.hasResource("AWS::S3::Bucket", {
      Properties: {
        BucketName: "hunter-access-logs-bucket"
      },
      DeletionPolicy: "Delete"
    });
  });
});
