#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HunterStack } from '../lib/cdk-stack';
import dotenv from "dotenv";

dotenv.config();

const app = new cdk.App();
new HunterStack(app, 'HunterStack', {
  description: "This stack includes all of the AWS resources used by the Hunter app.",
  env: { account: process.env.ACCOUNT_ID, region: process.env.REGION },
});
