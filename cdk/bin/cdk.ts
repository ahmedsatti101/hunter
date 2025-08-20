#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HunterStack } from '../lib/cdk-stack';
import dotenv from "dotenv";

dotenv.config();

const app = new cdk.App();
new HunterStack(app, 'HunterStack', {
  env: { account: process.env.ACCOUNT_ID, region: process.env.REGION },
});
