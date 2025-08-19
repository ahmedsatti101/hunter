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
        EmailMessageByLink: "Thank you for creating an account with Hunter. Please click {##here##} to verify your new account.",
        EmailSubjectByLink: "Verify your new account with Hunter"
      },
      UserPoolName: "hunter-users",
      AccountRecoverySetting: {
        RecoveryMechanisms: [{
          Name: "verified_email",
          Priority: 1
        }]
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
      }
    });
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
