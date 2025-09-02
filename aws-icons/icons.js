// AWS Architecture Icons - SVG definitions
// Based on official AWS Architecture Icons
const awsIcons = {
    // Compute Services
    ec2: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#FF9900"/>
        <path d="M12 16h24v16H12V16z" fill="white"/>
        <rect x="14" y="18" width="4" height="4" fill="#FF9900"/>
        <rect x="20" y="18" width="4" height="4" fill="#FF9900"/>
        <rect x="26" y="18" width="4" height="4" fill="#FF9900"/>
        <rect x="32" y="18" width="2" height="4" fill="#FF9900"/>
        <rect x="14" y="24" width="20" height="2" fill="#FF9900"/>
        <rect x="14" y="28" width="20" height="2" fill="#FF9900"/>
    </svg>`,
    
    lambda: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#FF9900"/>
        <path d="M15 12l6 12-6 12h4l6-12-6-12h-4z" fill="white"/>
        <path d="M25 12l6 12-6 12h4l6-12-6-12h-4z" fill="white"/>
    </svg>`,
    
    // Storage Services
    s3: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#569A31"/>
        <path d="M12 16h24l-2 4H14l-2-4z" fill="white"/>
        <path d="M12 22h24l-2 4H14l-2-4z" fill="white"/>
        <path d="M12 28h24l-2 4H14l-2-4z" fill="white"/>
    </svg>`,
    
    // Database Services
    rds: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#3F48CC"/>
        <ellipse cx="24" cy="18" rx="10" ry="4" fill="white"/>
        <rect x="14" y="18" width="20" height="12" fill="white"/>
        <ellipse cx="24" cy="30" rx="10" ry="4" fill="white"/>
        <path d="M14 18v12c0 2.2 4.5 4 10 4s10-1.8 10-4V18" stroke="#3F48CC" stroke-width="2" fill="none"/>
    </svg>`,
    
    dynamodb: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#3F48CC"/>
        <rect x="12" y="14" width="24" height="20" rx="2" fill="white"/>
        <rect x="16" y="18" width="16" height="2" fill="#3F48CC"/>
        <rect x="16" y="22" width="16" height="2" fill="#3F48CC"/>
        <rect x="16" y="26" width="16" height="2" fill="#3F48CC"/>
        <rect x="16" y="30" width="8" height="2" fill="#3F48CC"/>
    </svg>`,
    
    // Networking Services
    cloudfront: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#8C4FFF"/>
        <circle cx="24" cy="24" r="8" fill="white"/>
        <circle cx="16" cy="16" r="3" fill="white"/>
        <circle cx="32" cy="16" r="3" fill="white"/>
        <circle cx="16" cy="32" r="3" fill="white"/>
        <circle cx="32" cy="32" r="3" fill="white"/>
        <path d="M19 19l10 10M29 19l-10 10" stroke="#8C4FFF" stroke-width="2"/>
    </svg>`,
    
    alb: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#8C4FFF"/>
        <rect x="12" y="20" width="24" height="8" rx="4" fill="white"/>
        <circle cx="18" cy="24" r="2" fill="#8C4FFF"/>
        <circle cx="24" cy="24" r="2" fill="#8C4FFF"/>
        <circle cx="30" cy="24" r="2" fill="#8C4FFF"/>
        <path d="M24 12v8M24 28v8" stroke="white" stroke-width="2"/>
    </svg>`,
    
    route53: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#8C4FFF"/>
        <circle cx="24" cy="24" r="10" stroke="white" stroke-width="2" fill="none"/>
        <circle cx="24" cy="24" r="6" stroke="white" stroke-width="2" fill="none"/>
        <circle cx="24" cy="24" r="2" fill="white"/>
        <path d="M24 14v-2M24 36v2M34 24h2M12 24h-2" stroke="white" stroke-width="2"/>
    </svg>`,
    
    // Application Services
    apigateway: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#FF4B4B"/>
        <rect x="12" y="16" width="24" height="16" rx="2" fill="white"/>
        <path d="M16 20h16M16 24h16M16 28h8" stroke="#FF4B4B" stroke-width="2"/>
        <circle cx="32" cy="20" r="1" fill="#FF4B4B"/>
        <circle cx="32" cy="24" r="1" fill="#FF4B4B"/>
    </svg>`,
    
    sqs: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#FF4B4B"/>
        <rect x="12" y="18" width="24" height="12" rx="2" fill="white"/>
        <rect x="16" y="22" width="4" height="4" fill="#FF4B4B"/>
        <rect x="22" y="22" width="4" height="4" fill="#FF4B4B"/>
        <rect x="28" y="22" width="4" height="4" fill="#FF4B4B"/>
    </svg>`,
    
    // Security Services
    cognito: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#DD344C"/>
        <circle cx="24" cy="20" r="6" fill="white"/>
        <path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="white"/>
    </svg>`,
    
    // Generic Services
    user: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="4" fill="#232F3E"/>
        <circle cx="24" cy="18" r="6" fill="white"/>
        <path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="white"/>
    </svg>`
};

// Function to get AWS icon as data URL for use in Mermaid
function getAwsIcon(serviceName) {
    const icon = awsIcons[serviceName.toLowerCase()];
    if (!icon) {
        console.warn(`AWS icon not found for service: ${serviceName}`);
        return '';
    }
    
    const encodedSvg = btoa(icon);
    return `data:image/svg+xml;base64,${encodedSvg}`;
}

// Function to create AWS service node with icon
function createAwsServiceNode(serviceId, serviceName, iconName) {
    const iconUrl = getAwsIcon(iconName);
    if (iconUrl) {
        return `${serviceId}["<img src='${iconUrl}' width='32' height='32'/><br/>${serviceName}"]`;
    } else {
        return `${serviceId}["${serviceName}"]`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { awsIcons, getAwsIcon, createAwsServiceNode };
}
