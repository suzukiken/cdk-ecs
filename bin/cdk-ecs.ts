#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkEcsStack } from '../lib/cdk-ecs-stack';
import { CdkEcsRepoStack } from '../lib/cdk-ecs-repo-stack';

const app = new cdk.App();
new CdkEcsStack(app, 'CdkEcsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
new CdkEcsRepoStack(app, 'CdkEcsRepoStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

