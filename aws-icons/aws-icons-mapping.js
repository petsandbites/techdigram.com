// AWS Official Icons Mapping
// Maps service names to their official AWS icon paths

const awsIconsMapping = {
    // Compute Services
    'ec2': 'aws-icons/service-icons/compute/32/Arch_Amazon-EC2_32.svg',
    'lambda': 'aws-icons/service-icons/compute/32/Arch_AWS-Lambda_32.svg',
    'batch': 'aws-icons/service-icons/compute/32/Arch_AWS-Batch_32.svg',
    'beanstalk': 'aws-icons/service-icons/compute/32/Arch_AWS-Elastic-Beanstalk_32.svg',
    'lightsail': 'aws-icons/service-icons/compute/32/Arch_Amazon-Lightsail_32.svg',
    
    // Storage Services
    's3': 'aws-icons/service-icons/storage/32/Arch_Amazon-Simple-Storage-Service_32.svg',
    'efs': 'aws-icons/service-icons/storage/32/Arch_Amazon-Elastic-File-System_32.svg',
    'fsx': 'aws-icons/service-icons/storage/32/Arch_Amazon-FSx_32.svg',
    'backup': 'aws-icons/service-icons/storage/32/Arch_AWS-Backup_32.svg',
    
    // Database Services
    'rds': 'aws-icons/service-icons/database/32/Arch_Amazon-RDS_32.svg',
    'dynamodb': 'aws-icons/service-icons/database/32/Arch_Amazon-DynamoDB_32.svg',
    'aurora': 'aws-icons/service-icons/database/32/Arch_Amazon-Aurora_32.svg',
    'redshift': 'aws-icons/service-icons/database/32/Arch_Amazon-Redshift_32.svg',
    'elasticache': 'aws-icons/service-icons/database/32/Arch_Amazon-ElastiCache_32.svg',
    'documentdb': 'aws-icons/service-icons/database/32/Arch_Amazon-DocumentDB_32.svg',
    
    // Networking & Content Delivery
    'cloudfront': 'aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-CloudFront_32.svg',
    'route53': 'aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-Route-53_32.svg',
    'alb': 'aws-icons/service-icons/networking_content_delivery/32/Arch_Elastic-Load-Balancing_32.svg',
    'nlb': 'aws-icons/service-icons/networking_content_delivery/32/Arch_Elastic-Load-Balancing_32.svg',
    'vpc': 'aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-VPC_32.svg',
    'apigateway': 'aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-API-Gateway_32.svg',
    'directconnect': 'aws-icons/service-icons/networking_content_delivery/32/Arch_AWS-Direct-Connect_32.svg',
    
    // Application Integration
    'sqs': 'aws-icons/service-icons/app_integration/32/Arch_Amazon-Simple-Queue-Service_32.svg',
    'sns': 'aws-icons/service-icons/app_integration/32/Arch_Amazon-Simple-Notification-Service_32.svg',
    'eventbridge': 'aws-icons/service-icons/app_integration/32/Arch_Amazon-EventBridge_32.svg',
    'stepfunctions': 'aws-icons/service-icons/app_integration/32/Arch_AWS-Step-Functions_32.svg',
    
    // Security, Identity & Compliance
    'iam': 'aws-icons/service-icons/security_identity_compliance/32/Arch_AWS-Identity-and-Access-Management_32.svg',
    'cognito': 'aws-icons/service-icons/security_identity_compliance/32/Arch_Amazon-Cognito_32.svg',
    'kms': 'aws-icons/service-icons/security_identity_compliance/32/Arch_AWS-Key-Management-Service_32.svg',
    'waf': 'aws-icons/service-icons/security_identity_compliance/32/Arch_AWS-WAF_32.svg',
    'secrets': 'aws-icons/service-icons/security_identity_compliance/32/Arch_AWS-Secrets-Manager_32.svg',
    
    // Containers
    'ecs': 'aws-icons/service-icons/containers/32/Arch_Amazon-Elastic-Container-Service_32.svg',
    'eks': 'aws-icons/service-icons/containers/32/Arch_Amazon-Elastic-Kubernetes-Service_32.svg',
    'ecr': 'aws-icons/service-icons/containers/32/Arch_Amazon-Elastic-Container-Registry_32.svg',
    'fargate': 'aws-icons/service-icons/containers/32/Arch_AWS-Fargate_32.svg',
    
    // Analytics
    'kinesis': 'aws-icons/service-icons/analytics/32/Arch_Amazon-Kinesis_32.svg',
    'athena': 'aws-icons/service-icons/analytics/32/Arch_Amazon-Athena_32.svg',
    'glue': 'aws-icons/service-icons/analytics/32/Arch_AWS-Glue_32.svg',
    'emr': 'aws-icons/service-icons/analytics/32/Arch_Amazon-EMR_32.svg',
    
    // Management & Governance
    'cloudwatch': 'aws-icons/service-icons/management_governance/32/Arch_Amazon-CloudWatch_32.svg',
    'cloudtrail': 'aws-icons/service-icons/management_governance/32/Arch_AWS-CloudTrail_32.svg',
    'cloudformation': 'aws-icons/service-icons/management_governance/32/Arch_AWS-CloudFormation_32.svg',
    'config': 'aws-icons/service-icons/management_governance/32/Arch_AWS-Config_32.svg',
    
    // Generic/User icons
    'user': 'aws-icons/service-icons/general_icons/32/Arch_User_32.svg',
    'users': 'aws-icons/service-icons/general_icons/32/Arch_Users_32.svg'
};

// Function to create AWS service node with official icon
function createAwsNode(serviceId, serviceName, iconKey) {
    const iconPath = awsIconsMapping[iconKey.toLowerCase()];
    if (iconPath) {
        return `${serviceId}["<img src='${iconPath}' width='32' height='32'/><br/>${serviceName}"]`;
    } else {
        console.warn(`AWS icon not found for: ${iconKey}`);
        return `${serviceId}["${serviceName}"]`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { awsIconsMapping, createAwsNode };
}
