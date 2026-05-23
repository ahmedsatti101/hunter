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

Once the prerequisites are met, clone this repository with git using `git clone https://github.com/ahmedsatti101/hunter.git`. Go into both `hunter` and `cdk` folders and run `npm install` to install the dependencies.

### Connect to AWS
In this step, you will connect your local version of Hunter to AWS. First create one `.env` file in `hunter/` and another in `cdk/`.

For `hunter/.env` paste this:
```sh
EXPO_PUBLIC_AWS_API_URL=
EXPO_PUBLIC_COGNITO_OAUTH_URL=https://hunter.auth.eu-west-2.amazoncognito.com
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

Before deploying to AWS you will need to tell AWS which credentials to use to deploy to your account. Run `aws configure` and follow the prompts given to you to create establish these credentials. To find these credentials, log into the AWS console click the top right where your name is and click 'Security credentials'. Under Access Keys you will find the Access Key ID.

Note: The secret access key can be retrieved only at the time you create it. If you lose your secret access key, you must delete the existing access key and create a new one.

Once the credentials have been established, run `cdk deploy` under the cdk folder to deploy the stack to AWS. After the stack is deployed, you will need to connect to an EC2 instance and connect to the database from within the instance to initialise it using the `schema.sql` file in the `cdk` folder.

You can delete the stack later using `cdk destroy`.

### Connect to EC2 instance
In the AWS console, search for EC2 --> Network & Security --> Key pairs. Copy the key pair ID.

Under the `cdk` folder run:
```sh
aws ssm get-parameter \
    --name "/ec2/keypair/keypair-id" \
    --with-decryption \
    --query "Parameter.Value" \
    --output text > hunter-db-key.pem
```
This command will download the private key file under the name `hunter-db-key` with `.pem` extenstion. The file name can be whatever you want. This file will be used to establish a connection with the EC2 instance through SSH.

Next set the file permissions to be only read by you by running:
```sh
chmod 400 private-key-file.pem
```

Connect to the instance with:
```sh
ssh -i "private-key-file.pem" ec2-user@public-dns
```
You can find the public DNS address of the EC2 instance using the AWS console. Search EC2 --> Instances --> HunterStack/ec2-instance. Copy the address under Public DNS.

Once a connection is established, run `ls` to verify the `schema.sql` file exists in the instance's home directory and `psql -V` to verify the `psql` command line tool is present so we can connect to the database.

### Connect to RDS instance
In the AWS console, search for secrets manager. In `hunter-rds-secret` under Secret value, you will find the connection details of the RDS database.

In the SSH session with the EC2 instance type:
```sh
psql -h host -U username -d hunter -W
```
Replace with the values in Secrets Manager.

Enter the password when prompted for it and you should see `hunter=>` which means we've connected to the database. Type `\i schema.sql` and enter the password to initialise the database properly. Verify the database tables were created by running `\dt`.

Exit the database using `\q` and `exit` to quit the SSH session with the EC2 instance.

### Run the app
Before running the app under the `hunter` folder, you will to provide values to `EXPO_PUBLIC_AWS_API_URL` and `EXPO_PUBLIC_COGNITO_CLIENT_ID` in the `.env` file.

In the AWS console, search for API Gateway and find the `HunterApi`. Under `API: HunterApi`, copy and paste the default endpoint value to `EXPO_PUBLIC_AWS_API_URL`. Search for Cognito and find the `hunter-users` user pool. Under Applications --> App clients, copy and paste the Client ID to `EXPO_PUBLIC_COGNITO_CLIENT_ID`.

Run the app with `npm run start`.
