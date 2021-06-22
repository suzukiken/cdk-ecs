import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from "@aws-cdk/aws-route53-targets/lib";

export class CdkEcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpcid = this.node.tryGetContext('vpcid')
    const albarn = this.node.tryGetContext('albarn')
    const domain = this.node.tryGetContext('domain')
    const subdomain = this.node.tryGetContext('subdomain')
    const host = subdomain + '.' + domain
    
    const repository = ecr.Repository.fromRepositoryName(this, 'Repository', 'image-ecr')
    
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: vpcid })
    
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc })
    
    // t3.nanoにするとクラスター > サービス > イベントのページに
    // service xxxxx unable to place a task because no container instance met all of its requirements. 
    // The closest matching container-instance xxxxxx has insufficient memory available. 
    // と出て動作しない
    cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
      instanceType: new ec2.InstanceType('t3.micro'),
      desiredCapacity: 1,
    })
    
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef') // , { taskRole: ? }
    
    taskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      memoryLimitMiB: 512,
      portMappings: [
        { containerPort: 80 }
      ],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'EventDemo' })
    })

    const ecsService = new ecs.Ec2Service(this, 'Service', {
      cluster,
      taskDefinition,
    })
    
    // CloudWatchAgentServerPolicyポリシー?
    
    const alb = elbv2.ApplicationLoadBalancer.fromLookup(this, 'Alb', {
      loadBalancerArn: albarn
    })
    
    const listener = elbv2.ApplicationListener.fromLookup(this, 'Listener', {
      loadBalancerArn: alb.loadBalancerArn,
      listenerProtocol: elbv2.ApplicationProtocol.HTTPS,
      listenerPort: 443
    })
    
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      port: 80,
      targets: [ecsService],
      vpc: vpc
    })
    
    listener.addTargetGroups('Groups', {
      targetGroups: [targetGroup], 
      conditions: [
         elbv2.ListenerCondition.hostHeaders([ host ])  
      ],
      priority: 100
    })
    
    const zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName: domain,
    })
    
    const record = new route53.ARecord(this, "record", {
      recordName: subdomain,
      target: route53.RecordTarget.fromAlias(
        new targets.LoadBalancerTarget(alb)
      ),
      zone: zone,
    })
    
  }
}

