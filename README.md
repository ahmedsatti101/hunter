# Hunter
> Tired of using spreadsheets to keep tracking of jobs you applied for?

Hunter is a cross platform app, targeting Android and the Web, that allows job seekers to keep track of their job applications. Job seekers will receive a notification 2 weeks after they have submitted an application informing them to chase up their application. If 4 weeks pass by and an application's status is still `Applied`, the job seeker will be informed the application entry status will be changed to `Unsuccessful`.

## Highlights
- Reminders: Get reminers about job applications 2 and 4 weeks after the submission date
- JD screenshot upload: Take screenshots of a job description for later reference and upload it when you record a new entry
- Social sign in: You can sign in with your Google or Facebook instead of the usual email and password
- and of course Dark mode!

## Overview
### Why did I create Hunter?
I have been job hunting for a while and I used to keep track of job I applied to using a spreadsheet. It wasn't a really interactive or engaging thing to do and was little bit hard to maintain. I sometimes would forget to add or update a job I applied to and would also completely forget about some because I didn't have anything to remind me to chase up after the jobs I applied to.

### What is the tech stack?
TypeScript.

## How to run Hunter locally
### Prerequisites
- [Git](https://git-scm.com/install)
- Install Node.js and npm using [nvm](https://github.com/nvm-sh/nvm)
    - Install nvm with `curl` or `wget`:
      - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash`
      - `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash`
    - Run `command -v nvm` to ensure nvm is installed
    - Run `export NVM_DIR="$HOME/.nvm"`
    - Run `nvm install node` and check node and npm are installed using `npm -v && node -v`
- [AWS account](https://aws.amazon.com/free)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- AWS CDK CLI using `npm install -g aws-cdk`
    - Run `cdk --version` to ensure the CLI has been installed

Once the prerequisites are met, clone this repository with git using `git clone https://github.com/ahmedsatti101/hunter.git`. Go into both `hunter` and `cdk` folders and run `npm install` to install the dependencies. In the `hunter` folder, run the app with `npm run start`.

### Connect to AWS
In this step, you will connect your local version of Hunter to AWS. First create one `.env` file in `hunter/` and another in `cdk/`.

For `hunter/.env` paste this:
```sh
EXPO_PUBLIC_AWS_API_URL=
EXPO_PUBLIC_COGNITO_OAUTH_URL=
EXPO_PUBLIC_COGNITO_CLIENT_ID=
```
For `cdk/.env` paste this:
```sh
ACCOUNT_ID=""
REGION=""
```
You will need to sign into the AWS [console](https://aws.amazon.com/console) to get your account ID which can be found in the top right corner next to your account name. For the region, you can find a list of AWS regions [here](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html). I recommend choosing one geographically close to you.

Once you have provided these values in `cdk/.env` you can start deploying the stack to your account. The stack includes all the resources used by Hunter to handle user authentication/authorization and data persistence.

Run `cdk synth` to generate the template that will be used by AWS Cloudformation to create all the resources. You can inspect the template at `cdk/cdk.out/HunterStack.template.json`.

Before deploying to AWS you will need to tell AWS which credentials to use to deploy to your account. Run `aws login` and follow the prompts given to you to create establish these credentials.
