import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class CdkEcsQmkRoleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const role = new iam.Role(this, 'Role', { 
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      roleName: 'ecsInstanceRole'
    })
    
    const statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    })

    statement.addActions("logs:CreateLogGroup")
    statement.addActions("logs:CreateLogStream")
    statement.addActions("logs:PutLogEvents")
    statement.addActions("logs:DescribeLogStreams")
    
    statement.addResources("arn:aws:logs:*:*:*")

    const policy = new iam.Policy(this, "Policy", {
      policyName: "ECS-CloudWatchLogs",
      statements: [statement],
    })

    role.attachInlinePolicy(policy);
    
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonEC2ContainerServiceforEC2Role"
      )
    )
    
  }
}
