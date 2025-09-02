// AWS Icons Helper for Gemini AI Prompts
// This file provides utility functions to generate AWS icon syntax for AI prompts

const awsIconsForGemini = {
    // Compute Services
    compute: {
        ec2: "EC2[\"<img src='aws-icons/service-icons/compute/32/Arch_Amazon-EC2_32.svg' width='32' height='32'/><br/>EC2 Instance\"]",
        lambda: "Lambda[\"<img src='aws-icons/service-icons/compute/32/Arch_AWS-Lambda_32.svg' width='32' height='32'/><br/>Lambda Function\"]",
        batch: "Batch[\"<img src='aws-icons/service-icons/compute/32/Arch_AWS-Batch_32.svg' width='32' height='32'/><br/>AWS Batch\"]",
        beanstalk: "Beanstalk[\"<img src='aws-icons/service-icons/compute/32/Arch_AWS-Elastic-Beanstalk_32.svg' width='32' height='32'/><br/>Elastic Beanstalk\"]",
        lightsail: "Lightsail[\"<img src='aws-icons/service-icons/compute/32/Arch_Amazon-Lightsail_32.svg' width='32' height='32'/><br/>Lightsail\"]"
    },
    
    // Storage Services
    storage: {
        s3: "S3[\"<img src='aws-icons/service-icons/storage/32/Arch_Amazon-Simple-Storage-Service_32.svg' width='32' height='32'/><br/>S3 Bucket\"]",
        efs: "EFS[\"<img src='aws-icons/service-icons/storage/32/Arch_Amazon-Elastic-File-System_32.svg' width='32' height='32'/><br/>EFS\"]",
        fsx: "FSx[\"<img src='aws-icons/service-icons/storage/32/Arch_Amazon-FSx_32.svg' width='32' height='32'/><br/>FSx\"]",
        backup: "Backup[\"<img src='aws-icons/service-icons/storage/32/Arch_AWS-Backup_32.svg' width='32' height='32'/><br/>AWS Backup\"]"
    },
    
    // Database Services
    database: {
        rds: "RDS[\"<img src='aws-icons/service-icons/database/32/Arch_Amazon-RDS_32.svg' width='32' height='32'/><br/>RDS Database\"]",
        dynamodb: "DynamoDB[\"<img src='aws-icons/service-icons/database/32/Arch_Amazon-DynamoDB_32.svg' width='32' height='32'/><br/>DynamoDB\"]",
        aurora: "Aurora[\"<img src='aws-icons/service-icons/database/32/Arch_Amazon-Aurora_32.svg' width='32' height='32'/><br/>Aurora\"]",
        redshift: "Redshift[\"<img src='aws-icons/service-icons/database/32/Arch_Amazon-Redshift_32.svg' width='32' height='32'/><br/>Redshift\"]",
        elasticache: "ElastiCache[\"<img src='aws-icons/service-icons/database/32/Arch_Amazon-ElastiCache_32.svg' width='32' height='32'/><br/>ElastiCache\"]",
        documentdb: "DocumentDB[\"<img src='aws-icons/service-icons/database/32/Arch_Amazon-DocumentDB_32.svg' width='32' height='32'/><br/>DocumentDB\"]"
    },
    
    // Networking & Content Delivery
    networking: {
        cloudfront: "CloudFront[\"<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-CloudFront_32.svg' width='32' height='32'/><br/>CloudFront\"]",
        route53: "Route53[\"<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-Route-53_32.svg' width='32' height='32'/><br/>Route 53\"]",
        alb: "ALB[\"<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Elastic-Load-Balancing_32.svg' width='32' height='32'/><br/>Load Balancer\"]",
        vpc: "VPC[\"<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-VPC_32.svg' width='32' height='32'/><br/>VPC\"]",
        apigateway: "APIGateway[\"<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-API-Gateway_32.svg' width='32' height='32'/><br/>API Gateway\"]",
        directconnect: "DirectConnect[\"<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_AWS-Direct-Connect_32.svg' width='32' height='32'/><br/>Direct Connect\"]"
    },
    
    // Security & Identity
    security: {
        iam: "IAM[\"<img src='aws-icons/service-icons/security_identity_compliance/32/Arch_AWS-Identity-and-Access-Management_32.svg' width='32' height='32'/><br/>IAM\"]",
        cognito: "Cognito[\"<img src='aws-icons/service-icons/security_identity_compliance/32/Arch_Amazon-Cognito_32.svg' width='32' height='32'/><br/>Cognito\"]",
        kms: "KMS[\"<img src='aws-icons/service-icons/security_identity_compliance/32/Arch_AWS-Key-Management-Service_32.svg' width='32' height='32'/><br/>KMS\"]",
        waf: "WAF[\"<img src='aws-icons/service-icons/security_identity_compliance/32/Arch_AWS-WAF_32.svg' width='32' height='32'/><br/>WAF\"]",
        secrets: "Secrets[\"<img src='aws-icons/service-icons/security_identity_compliance/32/Arch_AWS-Secrets-Manager_32.svg' width='32' height='32'/><br/>Secrets Manager\"]"
    },
    
    // Containers
    containers: {
        ecs: "ECS[\"<img src='aws-icons/service-icons/containers/32/Arch_Amazon-Elastic-Container-Service_32.svg' width='32' height='32'/><br/>ECS\"]",
        eks: "EKS[\"<img src='aws-icons/service-icons/containers/32/Arch_Amazon-Elastic-Kubernetes-Service_32.svg' width='32' height='32'/><br/>EKS\"]",
        ecr: "ECR[\"<img src='aws-icons/service-icons/containers/32/Arch_Amazon-Elastic-Container-Registry_32.svg' width='32' height='32'/><br/>ECR\"]",
        fargate: "Fargate[\"<img src='aws-icons/service-icons/containers/32/Arch_AWS-Fargate_32.svg' width='32' height='32'/><br/>Fargate\"]"
    },
    
    // Application Integration
    integration: {
        sqs: "SQS[\"<img src='aws-icons/service-icons/app_integration/32/Arch_Amazon-Simple-Queue-Service_32.svg' width='32' height='32'/><br/>SQS Queue\"]",
        sns: "SNS[\"<img src='aws-icons/service-icons/app_integration/32/Arch_Amazon-Simple-Notification-Service_32.svg' width='32' height='32'/><br/>SNS\"]",
        eventbridge: "EventBridge[\"<img src='aws-icons/service-icons/app_integration/32/Arch_Amazon-EventBridge_32.svg' width='32' height='32'/><br/>EventBridge\"]",
        stepfunctions: "StepFunctions[\"<img src='aws-icons/service-icons/app_integration/32/Arch_AWS-Step-Functions_32.svg' width='32' height='32'/><br/>Step Functions\"]"
    },
    
    // General Icons
    general: {
        user: "User[\"<img src='aws-icons/service-icons/general_icons/32/Arch_User_32.svg' width='32' height='32'/><br/>User\"]",
        users: "Users[\"<img src='aws-icons/service-icons/general_icons/32/Arch_Users_32.svg' width='32' height='32'/><br/>Users\"]"
    }
};

// Helper function to get icon syntax by service name
function getAwsIconSyntax(serviceName, displayName = null) {
    const service = serviceName.toLowerCase();
    
    // Search through all categories
    for (const category in awsIconsForGemini) {
        if (awsIconsForGemini[category][service]) {
            let syntax = awsIconsForGemini[category][service];
            
            // Replace display name if provided
            if (displayName) {
                syntax = syntax.replace(/(<br\/>)([^"]+)(")/g, `$1${displayName}$3`);
            }
            
            return syntax;
        }
    }
    
    return null;
}

// Helper function to generate complete Mermaid diagram with AWS icons
function generateAwsDiagram(services, connections, diagramType = 'TD') {
    let diagram = `graph ${diagramType}\n`;
    
    // Add service definitions
    services.forEach(service => {
        const iconSyntax = getAwsIconSyntax(service.name, service.displayName);
        if (iconSyntax) {
            diagram += `    ${iconSyntax}\n`;
        }
    });
    
    // Add connections
    connections.forEach(connection => {
        diagram += `    ${connection.from} --> ${connection.to}\n`;
    });
    
    return diagram;
}

// Helper function to get all available services
function getAllAwsServices() {
    const allServices = {};
    
    for (const category in awsIconsForGemini) {
        allServices[category] = Object.keys(awsIconsForGemini[category]);
    }
    
    return allServices;
}

// Helper function to create AI-friendly service mapping
function createServiceMapping() {
    const mapping = {};
    
    for (const category in awsIconsForGemini) {
        for (const service in awsIconsForGemini[category]) {
            mapping[service] = awsIconsForGemini[category][service];
        }
    }
    
    return mapping;
}

// Helper function to suggest AWS services based on user input
function suggestAwsServices(userInput) {
    const input = userInput.toLowerCase();
    const suggestions = [];
    
    // Common service mappings
    const serviceKeywords = {
        'database': ['rds', 'dynamodb', 'aurora', 'elasticache'],
        'storage': ['s3', 'efs', 'backup'],
        'compute': ['ec2', 'lambda', 'batch', 'beanstalk'],
        'network': ['cloudfront', 'route53', 'alb', 'apigateway', 'vpc'],
        'security': ['iam', 'cognito', 'kms', 'waf'],
        'container': ['ecs', 'eks', 'fargate'],
        'queue': ['sqs', 'sns', 'eventbridge'],
        'cdn': ['cloudfront'],
        'load balancer': ['alb'],
        'api': ['apigateway'],
        'cache': ['elasticache', 'cloudfront'],
        'serverless': ['lambda', 'fargate'],
        'web': ['ec2', 'beanstalk', 'cloudfront']
    };
    
    for (const keyword in serviceKeywords) {
        if (input.includes(keyword)) {
            suggestions.push(...serviceKeywords[keyword]);
        }
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
}

// Helper function to generate context for AI prompts
function generateAiContext(userPrompt) {
    const suggestedServices = suggestAwsServices(userPrompt);
    let context = "Based on your request, consider using these AWS services:\n";
    
    suggestedServices.forEach(service => {
        const syntax = getAwsIconSyntax(service);
        if (syntax) {
            context += `- ${service.toUpperCase()}: ${syntax}\n`;
        }
    });
    
    return context;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        awsIconsForGemini,
        getAwsIconSyntax,
        generateAwsDiagram,
        getAllAwsServices,
        createServiceMapping,
        suggestAwsServices,
        generateAiContext
    };
}

// Example usage:
// console.log(getAwsIconSyntax('ec2', 'Web Server'));
// console.log(generateAwsDiagram([
//     { name: 'user', displayName: 'Client' },
//     { name: 'cloudfront', displayName: 'CDN' },
//     { name: 's3', displayName: 'Static Assets' }
// ], [
//     { from: 'User', to: 'CloudFront' },
//     { from: 'CloudFront', to: 'S3' }
// ]));
