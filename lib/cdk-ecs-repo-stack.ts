import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';

export class CdkEcsRepoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const repository = new ecr.Repository(this, 'Repository', { 
      repositoryName: 'image-ecr'
    })
    
  }
}

