// Mermaid configuration
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    themeVariables: {
        primaryColor: '#ff6b6b',
        primaryTextColor: '#333',
        primaryBorderColor: '#ff6b6b',
        lineColor: '#333'
    },
    securityLevel: 'loose',
    fontFamily: 'arial',
    fontSize: 14,
    htmlLabels: true,
    flowchart: {
        htmlLabels: true
    },
    deterministicIds: true,
    deterministicIDSeed: 'mermaid'
});

// Global variables
let input = document.getElementById('mermaidInput');
let codeEditor;
let renderTimeout;
let currentApiKey = '';
let lastAiResponse = '';
let previousCode = '';

// DOM elements - cached for performance
const elements = {
    output: document.getElementById('mermaidOutput'),
    clearBtn: document.getElementById('clearBtn'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    apiStatus: document.getElementById('apiStatus'),
    saveApiKey: document.getElementById('saveApiKey'),
    aiPromptInput: document.getElementById('aiPromptInput'),
    generateBtn: document.getElementById('generateBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    exitFullscreenBtn: document.getElementById('exitFullscreenBtn'),
    themeToggle: document.getElementById('themeToggle'),
    popupOverlay: document.getElementById('popupOverlay'),
    instructionsPopup: document.getElementById('instructionsPopup'),
    closePopup: document.getElementById('closePopup')
};


// AWS Architecture Templates with Official AWS Icons
const templates = {
    basic: `graph TD
    {{User}} --> {{Route53}}
    {{Route53}} --> {{CloudFront}}
    {{CloudFront}} --> {{Lambda}}
    {{Lambda}} --> {{ALB}}
    {{ALB}} --> {{EC2}}
    {{EC2}} --> {{RDS}}
    
    subgraph "AWS Cloud"
        {{CloudFront}}
        {{Lambda}}
        {{ALB}}
        {{EC2}}
        {{RDS}}
    end`,
    lambda: `graph TD
    User["<img src='aws-icons/service-icons/general_icons/32/Arch_User_32.svg' width='32' height='32'/><br/>User"] --> DNS["<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-Route-53_32.svg' width='32' height='32'/><br/>Route 53"]
    DNS --> CF["<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-CloudFront_32.svg' width='32' height='32'/><br/>CloudFront"]
    CF --> LE["<img src='aws-icons/service-icons/compute/32/Arch_AWS-Lambda_32.svg' width='32' height='32'/><br/>Lambda@Edge"]
    LE --> Origin["<img src='aws-icons/service-icons/compute/32/Arch_Amazon-EC2_32.svg' width='32' height='32'/><br/>Origin Server"]
    
    subgraph "Config Sources"
        S3["<img src='aws-icons/service-icons/storage/32/Arch_Amazon-Simple-Storage-Service_32.svg' width='32' height='32'/><br/>S3 Bucket"]
        CFConfig["<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-CloudFront_32.svg' width='32' height='32'/><br/>CloudFront Config"]
    end
    
    LE --> S3
    LE --> CFConfig`,
    microservices: `graph TD
    User["<img src='aws-icons/service-icons/general_icons/32/Arch_User_32.svg' width='32' height='32'/><br/>User"] --> API["<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-API-Gateway_32.svg' width='32' height='32'/><br/>API Gateway"]
    API --> Auth["<img src='aws-icons/service-icons/security_identity_compliance/32/Arch_Amazon-Cognito_32.svg' width='32' height='32'/><br/>Cognito"]
    Auth --> ALB["<img src='aws-icons/service-icons/networking_content_delivery/32/Arch_Elastic-Load-Balancing_32.svg' width='32' height='32'/><br/>Load Balancer"]
    
    ALB --> UserService["<img src='aws-icons/service-icons/compute/32/Arch_AWS-Lambda_32.svg' width='32' height='32'/><br/>User Service<br/>(Lambda)"]
    ALB --> OrderService["<img src='aws-icons/service-icons/compute/32/Arch_AWS-Lambda_32.svg' width='32' height='32'/><br/>Order Service<br/>(Lambda)"]
    ALB --> PaymentService["<img src='aws-icons/service-icons/compute/32/Arch_AWS-Lambda_32.svg' width='32' height='32'/><br/>Payment Service<br/>(Lambda)"]
    
    UserService --> UserDB["<img src='aws-icons/service-icons/database/32/Arch_Amazon-DynamoDB_32.svg' width='32' height='32'/><br/>DynamoDB<br/>Users"]
    OrderService --> OrderDB["<img src='aws-icons/service-icons/database/32/Arch_Amazon-DynamoDB_32.svg' width='32' height='32'/><br/>DynamoDB<br/>Orders"]
    PaymentService --> PaymentDB["<img src='aws-icons/service-icons/database/32/Arch_Amazon-RDS_32.svg' width='32' height='32'/><br/>RDS<br/>Payments"]
    
    OrderService --> SQS["<img src='aws-icons/service-icons/app_integration/32/Arch_Amazon-Simple-Queue-Service_32.svg' width='32' height='32'/><br/>SQS Queue"]
    SQS --> NotificationService["<img src='aws-icons/service-icons/compute/32/Arch_AWS-Lambda_32.svg' width='32' height='32'/><br/>Notification<br/>Service"]
    
    subgraph "AWS Cloud"
        API
        Auth
        ALB
        UserService
        OrderService
        PaymentService
        UserDB
        OrderDB
        PaymentDB
        SQS
        NotificationService
    end`
};

// Zoom and pan variables
let currentZoom = 1;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let currentTranslate = { x: 0, y: 0 };
let diagramContent = null;
let diagramViewport = null;

// AWS Icon placeholder mapping - using actual AWS SVG icons
const awsIconPlaceholders = {
    // Compute
    '{{EC2}}': '<img src="aws-icons/service-icons/compute/32/Arch_Amazon-EC2_32.svg" width="32" height="32"/><br/>EC2 Instance',
    '{{Lambda}}': '<img src="aws-icons/service-icons/compute/32/Arch_AWS-Lambda_32.svg" width="32" height="32"/><br/>Lambda Function',
    '{{ECS}}': '<img src="aws-icons/service-icons/containers/32/Arch_Amazon-Elastic-Container-Service_32.svg" width="32" height="32"/><br/>ECS Container',
    '{{EKS}}': '<img src="aws-icons/service-icons/containers/32/Arch_Amazon-Elastic-Kubernetes-Service_32.svg" width="32" height="32"/><br/>EKS',
    '{{Fargate}}': '<img src="aws-icons/service-icons/containers/32/Arch_AWS-Fargate_32.svg" width="32" height="32"/><br/>Fargate',
    
    // Storage
    '{{S3}}': '<img src="aws-icons/service-icons/storage/32/Arch_Amazon-Simple-Storage-Service_32.svg" width="32" height="32"/><br/>S3 Bucket',
    '{{EBS}}': '<img src="aws-icons/service-icons/storage/32/Arch_Amazon-Elastic-Block-Store_32.svg" width="32" height="32"/><br/>EBS Volume',
    '{{EFS}}': '<img src="aws-icons/service-icons/storage/32/Arch_Amazon-Elastic-File-System_32.svg" width="32" height="32"/><br/>EFS File System',
    
    // Database
    '{{RDS}}': '<img src="aws-icons/service-icons/database/32/Arch_Amazon-RDS_32.svg" width="32" height="32"/><br/>RDS Database',
    '{{DynamoDB}}': '<img src="aws-icons/service-icons/database/32/Arch_Amazon-DynamoDB_32.svg" width="32" height="32"/><br/>DynamoDB',
    '{{ElastiCache}}': '<img src="aws-icons/service-icons/database/32/Arch_Amazon-ElastiCache_32.svg" width="32" height="32"/><br/>ElastiCache',
    '{{Aurora}}': '<img src="aws-icons/service-icons/database/32/Arch_Amazon-Aurora_32.svg" width="32" height="32"/><br/>Aurora',
    
    // Networking
    '{{VPC}}': '<img src="aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-Virtual-Private-Cloud_32.svg" width="32" height="32"/><br/>VPC',
    '{{ALB}}': '<img src="aws-icons/service-icons/networking_content_delivery/32/Arch_Elastic-Load-Balancing_32.svg" width="32" height="32"/><br/>Load Balancer',
    '{{CloudFront}}': '<img src="aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-CloudFront_32.svg" width="32" height="32"/><br/>CloudFront',
    '{{Route53}}': '<img src="aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-Route-53_32.svg" width="32" height="32"/><br/>Route 53',
    '{{APIGateway}}': '<img src="aws-icons/service-icons/networking_content_delivery/32/Arch_Amazon-API-Gateway_32.svg" width="32" height="32"/><br/>API Gateway',
    
    // Security
    '{{IAM}}': '<img src="aws-icons/service-icons/security-identity-compliance/32/Arch_AWS-Identity-and-Access-Management_32.svg" width="32" height="32"/><br/>IAM',
    '{{WAF}}': '<img src="aws-icons/service-icons/security-identity-compliance/32/Arch_AWS-WAF_32.svg" width="32" height="32"/><br/>WAF',
    '{{KMS}}': '<img src="aws-icons/service-icons/security-identity-compliance/32/Arch_AWS-Key-Management-Service_32.svg" width="32" height="32"/><br/>KMS',
    '{{Cognito}}': '<img src="aws-icons/service-icons/security-identity-compliance/32/Arch_Amazon-Cognito_32.svg" width="32" height="32"/><br/>Cognito',
    
    // Application Integration
    '{{SQS}}': '<img src="aws-icons/service-icons/app_integration/32/Arch_Amazon-Simple-Queue-Service_32.svg" width="32" height="32"/><br/>SQS Queue',
    '{{SNS}}': '<img src="aws-icons/service-icons/app_integration/32/Arch_Amazon-Simple-Notification-Service_32.svg" width="32" height="32"/><br/>SNS',
    '{{EventBridge}}': '<img src="aws-icons/service-icons/app_integration/32/Arch_Amazon-EventBridge_32.svg" width="32" height="32"/><br/>EventBridge',
    '{{StepFunctions}}': '<img src="aws-icons/service-icons/app_integration/32/Arch_AWS-Step-Functions_32.svg" width="32" height="32"/><br/>Step Functions',
    '{{AppSync}}': '<img src="aws-icons/service-icons/app_integration/32/Arch_AWS-AppSync_32.svg" width="32" height="32"/><br/>AppSync',
    '{{MQ}}': '<img src="aws-icons/service-icons/app_integration/32/Arch_Amazon-MQ_32.svg" width="32" height="32"/><br/>Amazon MQ',
    
    // Analytics
    '{{Kinesis}}': '<img src="aws-icons/service-icons/analytics/32/Arch_Amazon-Kinesis_32.svg" width="32" height="32"/><br/>Kinesis',
    '{{Athena}}': '<img src="aws-icons/service-icons/analytics/32/Arch_Amazon-Athena_32.svg" width="32" height="32"/><br/>Athena',
    '{{Redshift}}': '<img src="aws-icons/service-icons/analytics/32/Arch_Amazon-Redshift_32.svg" width="32" height="32"/><br/>Redshift',
    '{{QuickSight}}': '<img src="aws-icons/service-icons/analytics/32/Arch_Amazon-QuickSight_32.svg" width="32" height="32"/><br/>QuickSight',
    '{{EMR}}': '<img src="aws-icons/service-icons/analytics/32/Arch_Amazon-EMR_32.svg" width="32" height="32"/><br/>EMR',
    '{{Glue}}': '<img src="aws-icons/service-icons/analytics/32/Arch_AWS-Glue_32.svg" width="32" height="32"/><br/>AWS Glue',
    
    // Machine Learning
    '{{SageMaker}}': '<img src="aws-icons/service-icons/analytics/32/Arch_Amazon-SageMaker_32.svg" width="32" height="32"/><br/>SageMaker',
    
    // Developer Tools
    '{{CodeCommit}}': '<img src="aws-icons/service-icons/developer_tools/32/Arch_AWS-CodeCommit_32.svg" width="32" height="32"/><br/>CodeCommit',
    '{{CodeBuild}}': '<img src="aws-icons/service-icons/developer_tools/32/Arch_AWS-CodeBuild_32.svg" width="32" height="32"/><br/>CodeBuild',
    '{{CodeDeploy}}': '<img src="aws-icons/service-icons/developer_tools/32/Arch_AWS-CodeDeploy_32.svg" width="32" height="32"/><br/>CodeDeploy',
    '{{CodePipeline}}': '<img src="aws-icons/service-icons/developer_tools/32/Arch_AWS-CodePipeline_32.svg" width="32" height="32"/><br/>CodePipeline',
    
    // Management & Governance
    '{{CloudWatch}}': '<img src="aws-icons/service-icons/management_governance/32/Arch_Amazon-CloudWatch_32.svg" width="32" height="32"/><br/>CloudWatch',
    '{{CloudTrail}}': '<img src="aws-icons/service-icons/management_governance/32/Arch_AWS-CloudTrail_32.svg" width="32" height="32"/><br/>CloudTrail',
    '{{Config}}': '<img src="aws-icons/service-icons/management_governance/32/Arch_AWS-Config_32.svg" width="32" height="32"/><br/>AWS Config',
    '{{CloudFormation}}': '<img src="aws-icons/service-icons/management_governance/32/Arch_AWS-CloudFormation_32.svg" width="32" height="32"/><br/>CloudFormation',
    
    // General
    '{{User}}': '<img src="aws-icons/group-icons/AWS-Account_32.svg" width="32" height="32"/><br/>User',
    '{{Users}}': '<img src="aws-icons/group-icons/Corporate-data-center_32.svg" width="32" height="32"/><br/>Users',
    '{{Internet}}': '<img src="aws-icons/group-icons/AWS-Cloud_32.svg" width="32" height="32"/><br/>Internet'
};

// Replace AWS icon placeholders with full HTML
function replaceAwsIconPlaceholders(code) {
    let processedCode = code;
    
    // Handle placeholders inside node brackets like A[{{User}}] -> A["icon HTML"]
    Object.keys(awsIconPlaceholders).forEach(placeholder => {
        const nodeId = placeholder.replace(/[{}]/g, ''); // Remove {{ }}
        const iconHtml = awsIconPlaceholders[placeholder];
        
        // Replace patterns like A[{{Service}}] with A["icon HTML"]
        const bracketPattern = new RegExp(`(\\w+)\\[${placeholder.replace(/[{}]/g, '\\$&')}\\]`, 'g');
        processedCode = processedCode.replace(bracketPattern, `$1["${iconHtml}"]`);
        
        // Replace standalone placeholders like {{Service}} with Service["icon HTML"]
        const standalonePattern = new RegExp(`(?<!\\[)${placeholder.replace(/[{}]/g, '\\$&')}(?!\\])`, 'g');
        processedCode = processedCode.replace(standalonePattern, `${nodeId}["${iconHtml}"]`);
    });
    
    return processedCode;
}

// Function to render Mermaid diagram
function renderDiagram(code) {
    if (!elements.output) return;
    
    if (!code.trim()) {
        elements.output.innerHTML = '<div class="loading">Enter Mermaid code to see the diagram...</div>';
        return;
    }
    
    elements.output.innerHTML = '<div class="loading">Rendering diagram...</div>';
    
    try {
        const processedCode = replaceAwsIconPlaceholders(code);
        elements.output.innerHTML = '';
        const diagramDiv = document.createElement('div');
        diagramDiv.className = 'mermaid';
        diagramDiv.innerHTML = processedCode;
        elements.output.appendChild(diagramDiv);
        
        mermaid.init(undefined, diagramDiv);
        
        setTimeout(() => {
            const svgElement = elements.output.querySelector('svg');
            if (svgElement) {
                svgElement.style.cursor = 'grab';
                updateTransform();
            }
        }, 100);
    } catch (error) {
        console.error('Mermaid rendering error:', error);
        elements.output.innerHTML = `<div class="error">Error rendering diagram: ${error.message}</div>`;
    }
}

// Initialize zoom and pan functionality
function initializeZoomPan() {
    diagramContent = document.getElementById('diagramContent');
    diagramViewport = document.getElementById('diagramViewport');
    
    if (!diagramContent || !diagramViewport) return;
    
    // Zoom buttons
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            zoom(1.2);
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            zoom(0.8);
        });
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => {
            resetZoom();
        });
    }
    
    // Mouse wheel zoom
    diagramViewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoom(delta);
    });
    
    // Mouse drag pan
    diagramViewport.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
}

function zoom(factor) {
    const newZoom = Math.max(0.1, Math.min(5, currentZoom * factor));
    
    if (newZoom !== currentZoom) {
        currentZoom = newZoom;
        updateTransform();
    }
}

function resetZoom() {
    currentZoom = 1;
    currentTranslate = { x: 0, y: 0 };
    updateTransform();
}

function startDrag(e) {
    if (e.target.closest('.mermaid') || e.target === diagramViewport) {
        isDragging = true;
        dragStart = { x: e.clientX - currentTranslate.x, y: e.clientY - currentTranslate.y };
        diagramViewport.style.cursor = 'grabbing';
        e.preventDefault();
    }
}

function drag(e) {
    if (isDragging) {
        currentTranslate.x = e.clientX - dragStart.x;
        currentTranslate.y = e.clientY - dragStart.y;
        updateTransform();
    }
}

function endDrag() {
    isDragging = false;
    if (diagramViewport) {
        diagramViewport.style.cursor = 'grab';
    }
}

// Update diagram transform
function updateTransform() {
    if (diagramContent) {
        diagramContent.style.transform = `scale(${currentZoom}) translate(${currentTranslate.x}px, ${currentTranslate.y}px)`;
    }
}

// Initialize input listeners
function initializeInputListeners() {
    if (input) {
        input.addEventListener('input', handleInput);
    }
}

// Debounced input handler for real-time updates
function handleInput() {
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
        renderDiagram(input.value);
    }, 500);
}

// Template button handlers
function initializeTemplateButtons() {
    const templateBtns = document.querySelectorAll('.template-btn');
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const template = btn.dataset.template;
            if (templates[template]) {
                if (codeEditor) {
                    codeEditor.setValue(templates[template]);
                } else {
                    input.value = templates[template];
                }
                renderDiagram(templates[template]);
            }
        });
    });
}

// Clear button handler
function initializeClearButton() {
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (codeEditor) {
                codeEditor.setValue('');
            } else if (input) {
                input.value = '';
            }
            renderDiagram('');
        });
    }
}

// Fullscreen functionality
function initializeFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exitFullscreenBtn = document.getElementById('exitFullscreenBtn');
    const diagramContainer = document.getElementById('diagramContainer');
    
    if (fullscreenBtn && diagramContainer) {
        fullscreenBtn.addEventListener('click', () => {
            diagramContainer.classList.add('fullscreen');
            fullscreenBtn.style.display = 'none';
            if (exitFullscreenBtn) exitFullscreenBtn.style.display = 'block';
        });
    }
    
    if (exitFullscreenBtn && diagramContainer) {
        exitFullscreenBtn.addEventListener('click', () => {
            diagramContainer.classList.remove('fullscreen');
            exitFullscreenBtn.style.display = 'none';
            if (fullscreenBtn) fullscreenBtn.style.display = 'block';
        });
    }
}

// API Key functionality
function initializeApiKey() {
    const apiKeyBtn = document.getElementById('apiKeyBtn');
    const apiKeyModal = document.getElementById('apiKeyModal');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const closeApiModal = document.getElementById('closeApiModal');
    
    if (apiKeyBtn && apiKeyModal) {
        apiKeyBtn.addEventListener('click', () => {
            apiKeyModal.style.display = 'flex';
        });
    }
    
    if (closeApiModal && apiKeyModal) {
        closeApiModal.addEventListener('click', () => {
            apiKeyModal.style.display = 'none';
        });
    }
    
    if (saveApiKeyBtn && apiKeyInput) {
        saveApiKeyBtn.addEventListener('click', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey) {
                localStorage.setItem('gemini_api_key', apiKey);
                updateApiStatus();
                if (apiKeyModal) apiKeyModal.style.display = 'none';
            }
        });
    }
}

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Initialize input event listeners
function initInputListeners() {
    const textarea = document.getElementById('mermaidInput');
    if (textarea) {
        textarea.addEventListener('input', handleInput);
        textarea.addEventListener('paste', handleInput);
        textarea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const currentValue = codeEditor ? codeEditor.getValue() : textarea.value;
                renderDiagram(currentValue);
            }
        });
    }
}

// Initialize zoom controls
function initZoomControls() {
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            currentZoom = Math.min(5, currentZoom * 1.2);
            updateTransform();
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            currentZoom = Math.max(0.1, currentZoom * 0.8);
            updateTransform();
        });
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => {
            currentZoom = 1;
            currentTranslate = { x: 0, y: 0 };
            updateTransform();
        });
    }
}

// Initialize fullscreen controls
function initFullscreenControls() {
    if (elements.fullscreenBtn) {
        elements.fullscreenBtn.addEventListener('click', () => {
            const container = document.getElementById('diagramContainer');
            if (container) {
                container.classList.add('fullscreen');
                elements.fullscreenBtn.style.display = 'none';
                if (elements.exitFullscreenBtn) elements.exitFullscreenBtn.style.display = 'block';
            }
        });
    }
    
    if (elements.exitFullscreenBtn) {
        elements.exitFullscreenBtn.addEventListener('click', () => {
            const container = document.getElementById('diagramContainer');
            if (container) {
                container.classList.remove('fullscreen');
                if (elements.fullscreenBtn) elements.fullscreenBtn.style.display = 'block';
                elements.exitFullscreenBtn.style.display = 'none';
            }
        });
    }
}

// Initialize clear button
function initClearButton() {
    if (elements.clearBtn) {
        elements.clearBtn.addEventListener('click', () => {
            if (codeEditor) {
                codeEditor.setValue('');
                codeEditor.focus();
            } else {
                input.value = '';
                input.focus();
            }
            renderDiagram('');
        });
    }
}


// Initialize API key management
function initApiKeyManagement() {
    if (elements.apiKeyInput) {
        elements.apiKeyInput.addEventListener('input', (e) => {
            currentApiKey = e.target.value.trim();
            if (currentApiKey) {
                localStorage.setItem('geminiApiKey', currentApiKey);
            } else {
                localStorage.removeItem('geminiApiKey');
            }
            updateApiStatus();
        });
    }
    
    if (elements.saveApiKey) {
        elements.saveApiKey.addEventListener('click', () => {
            const apiKey = elements.apiKeyInput ? elements.apiKeyInput.value.trim() : '';
            if (apiKey) {
                localStorage.setItem('geminiApiKey', apiKey);
                currentApiKey = apiKey;
                updateApiStatus();
                elements.apiKeyInput.value = '';
            }
        });
    }
}

function updateApiStatus() {
    if (!elements.apiStatus) return;
    
    if (!currentApiKey) {
        elements.apiStatus.textContent = '⚪';
        elements.apiStatus.style.background = 'rgba(231, 76, 60, 0.2)';
        if (elements.generateBtn) elements.generateBtn.disabled = true;
    } else if (currentApiKey.startsWith('AIza')) {
        elements.apiStatus.textContent = '🟢';
        elements.apiStatus.style.background = 'rgba(39, 174, 96, 0.2)';
        if (elements.generateBtn) elements.generateBtn.disabled = false;
    } else {
        elements.apiStatus.textContent = '🟡';
        elements.apiStatus.style.background = 'rgba(243, 156, 18, 0.2)';
        if (elements.generateBtn) elements.generateBtn.disabled = true;
    }
}

// Generate AWS Icons context for AI prompts
function generateAwsIconsContext() {
    return `
AWS ICONS REFERENCE - Use these PLACEHOLDER ABSTRACTIONS for clean, readable code:

IMPORTANT: Always use the {{ServiceName}} placeholder format. Do NOT use full HTML img tags.
The system will automatically replace these placeholders with the actual icons when rendering.

AVAILABLE PLACEHOLDERS:

COMPUTE SERVICES:
- {{EC2}} - EC2 Instance
- {{Lambda}} - Lambda Function  
- {{ECS}} - ECS Container
- {{EKS}} - EKS Cluster
- {{Fargate}} - Fargate

STORAGE SERVICES:
- {{S3}} - S3 Bucket
- {{EBS}} - EBS Volume
- {{EFS}} - EFS File System

DATABASE SERVICES:
- {{RDS}} - RDS Database
- {{DynamoDB}} - DynamoDB Table
- {{Aurora}} - Aurora Database
- {{ElastiCache}} - ElastiCache

NETWORKING & CDN:
- {{VPC}} - Virtual Private Cloud
- {{ALB}} - Application Load Balancer
- {{CloudFront}} - CloudFront CDN
- {{Route53}} - Route 53 DNS
- {{APIGateway}} - API Gateway

SECURITY & IDENTITY:
- {{IAM}} - Identity & Access Management
- {{Cognito}} - Cognito User Pool
- {{KMS}} - Key Management Service
- {{WAF}} - Web Application Firewall

APPLICATION INTEGRATION:
- {{SQS}} - Simple Queue Service
- {{SNS}} - Simple Notification Service
- {{EventBridge}} - EventBridge
- {{StepFunctions}} - Step Functions
- {{AppSync}} - AppSync GraphQL
- {{MQ}} - Amazon MQ

ANALYTICS:
- {{Kinesis}} - Kinesis Data Streams
- {{Athena}} - Athena Query Service
- {{Redshift}} - Redshift Data Warehouse
- {{QuickSight}} - QuickSight BI
- {{EMR}} - Elastic MapReduce
- {{Glue}} - AWS Glue ETL

MACHINE LEARNING:
- {{SageMaker}} - SageMaker ML Platform

DEVELOPER TOOLS:
- {{CodeCommit}} - CodeCommit Git
- {{CodeBuild}} - CodeBuild CI
- {{CodeDeploy}} - CodeDeploy
- {{CodePipeline}} - CodePipeline

MANAGEMENT & GOVERNANCE:
- {{CloudWatch}} - CloudWatch Monitoring
- {{CloudTrail}} - CloudTrail Audit
- {{Config}} - AWS Config
- {{CloudFormation}} - CloudFormation IaC

GENERAL:
- {{User}} - User/Client
- {{Users}} - Multiple Users
- {{Internet}} - Internet/External

EXAMPLE USAGE:
flowchart TD
    {{User}} --> {{Route53}}
    {{Route53}} --> {{CloudFront}}
    {{CloudFront}} --> {{ALB}}
    {{ALB}} --> {{EC2}}
    {{EC2}} --> {{RDS}}
    
    subgraph "AWS Cloud"
        {{CloudFront}}
        {{ALB}}
        {{EC2}}
        {{RDS}}
    end

NOTE: Use placeholders as standalone nodes ({{Service}}) NOT inside brackets like A[{{Service}}]
`;
}

// AI Integration with Google Gemini
async function callGemini(prompt, currentCode) {
    const awsIconsContext = generateAwsIconsContext();
    const systemPrompt = `You are an expert at creating and modifying Mermaid diagrams, especially AWS architecture diagrams.

${awsIconsContext}

CRITICAL REQUIREMENTS:
1. ALWAYS use {{ServiceName}} placeholder format as STANDALONE nodes - NEVER use full HTML img tags
2. DO NOT put placeholders inside brackets like A[{{User}}] - use {{User}} directly
3. The placeholders will be automatically converted to proper Mermaid nodes with icons
4. Keep the code clean and readable using only the placeholder abstractions
5. Use appropriate Mermaid syntax (flowchart TD, graph LR, etc.)
6. Group related services in subgraphs when logical
7. Use meaningful connections and clear flow
8. Ensure diagrams follow AWS best practices

Current code to modify:
${currentCode}

User request: ${prompt}

Provide ONLY clean Mermaid diagram code using {{ServiceName}} placeholders. No explanations or HTML tags.`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${currentApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nCurrent diagram:\n${currentCode}\n\nModification request: ${prompt}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 2048
                }
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        if (error.message.includes('quota') || error.message.includes('billing')) {
            throw new Error('Google API quota exceeded. Please check your billing at https://console.cloud.google.com/billing or try a different API key.');
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            throw new Error('Invalid API key. Please check your Google API key.');
        } else if (error.message.includes('429')) {
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
            throw new Error(`Google API Error: ${error.message}`);
        }
    }
}


// Initialize AI functionality
function initAI() {
    if (elements.generateBtn && elements.aiPromptInput) {
        elements.generateBtn.addEventListener('click', async () => {
            const prompt = elements.aiPromptInput.value.trim();
            if (!prompt) return;
            
            previousCode = codeEditor ? codeEditor.getValue() : input.value;
            elements.generateBtn.disabled = true;
            elements.generateBtn.innerHTML = '<div class="loading-spinner"></div>Thinking...';
            
            try {
                const currentCode = codeEditor ? codeEditor.getValue() : input.value;
                const updatedCode = await callGemini(prompt, currentCode);
                
                if (codeEditor) {
                    codeEditor.setValue(updatedCode);
                } else {
                    input.value = updatedCode;
                }
                renderDiagram(updatedCode);
                elements.aiPromptInput.value = '';
                
            } catch (error) {
                console.error('AI Error:', error);
                alert(`Error: ${error.message}`);
            } finally {
                elements.generateBtn.disabled = false;
                elements.generateBtn.textContent = 'Ask AI';
            }
        });
        
        // Enter key handler for AI prompt
        elements.aiPromptInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!elements.generateBtn.disabled) {
                    elements.generateBtn.click();
                }
            }
        });
    }
}


// Initialize popup functionality
function initPopups() {
    if (elements.closePopup) {
        elements.closePopup.addEventListener('click', () => {
            if (elements.popupOverlay) elements.popupOverlay.classList.remove('active');
            if (elements.instructionsPopup) elements.instructionsPopup.classList.remove('active');
        });
    }
    
    if (elements.popupOverlay) {
        elements.popupOverlay.addEventListener('click', () => {
            elements.popupOverlay.classList.remove('active');
            if (elements.instructionsPopup) elements.instructionsPopup.classList.remove('active');
        });
    }
}

// Initialize theme functionality
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (elements.themeToggle) {
        elements.themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
        elements.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            elements.themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Load saved API key
function loadSavedApiKey() {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
        currentApiKey = savedApiKey;
        if (elements.apiKeyInput) elements.apiKeyInput.value = savedApiKey;
        updateApiStatus();
    }
}



// Initialize CodeMirror
function initializeCodeEditor() {
    const textarea = document.getElementById('mermaidInput');
    const editorContainer = document.getElementById('codeEditor');
    
    if (!textarea || !editorContainer) {
        console.error('Required elements not found for CodeMirror initialization');
        return;
    }
    
    // Define Mermaid syntax highlighting
    CodeMirror.defineSimpleMode('mermaid', {
        start: [
            {regex: /\b(graph|flowchart|subgraph|end|TD|TB|BT|RL|LR)\b/, token: 'keyword'},
            {regex: /(-->|---)/g, token: 'operator'},
            {regex: /"[^"]*"/, token: 'string'},
            {regex: /\[[^\]]*\]/, token: 'bracket'},
            {regex: /\([^\)]*\)/, token: 'bracket'},
            {regex: /#.*/, token: 'comment'}
        ]
    });
    
    codeEditor = CodeMirror(editorContainer, {
        value: textarea.value,
        mode: 'mermaid',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2
    });
    
    // Sync changes back to textarea
    codeEditor.on('change', function() {
        textarea.value = codeEditor.getValue();
        handleInput();
    });
    
    // Update input reference to work with both textarea and CodeMirror
    input = {
        get value() { 
            return codeEditor ? codeEditor.getValue() : textarea.value; 
        },
        set value(val) { 
            textarea.value = val;
            if (codeEditor) {
                codeEditor.setValue(val);
            }
        },
        addEventListener: function(event, handler) {
            if (textarea) {
                textarea.addEventListener(event, handler);
            }
        }
    };
}

// Initialize keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const container = document.getElementById('diagramContainer');
            if (container && container.classList.contains('fullscreen')) {
                container.classList.remove('fullscreen');
                if (elements.fullscreenBtn) elements.fullscreenBtn.style.display = 'block';
                if (elements.exitFullscreenBtn) elements.exitFullscreenBtn.style.display = 'none';
            }
        }
    });
}

// AI Chat Toggle Functionality
function setupAIChat() {
    const aiToggle = document.getElementById('aiToggle');
    const aiChatFloat = document.getElementById('aiChatFloat');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    
    if (aiToggle && aiChatFloat) {
        aiToggle.addEventListener('click', () => {
            aiChatFloat.classList.toggle('active');
        });
    }
    
    if (aiCloseBtn && aiChatFloat) {
        aiCloseBtn.addEventListener('click', () => {
            aiChatFloat.classList.remove('active');
        });
    }
}

// Icons Popup Functionality
function setupIconsPopup() {
    const iconsInfoBtn = document.getElementById('iconsInfoBtn');
    const iconsPopup = document.getElementById('iconsPopup');
    const closeIconsPopup = document.getElementById('closeIconsPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    
    if (iconsInfoBtn && iconsPopup) {
        iconsInfoBtn.addEventListener('click', () => {
            iconsPopup.classList.add('active');
            if (popupOverlay) popupOverlay.classList.add('active');
        });
    }
    
    if (closeIconsPopup && iconsPopup) {
        closeIconsPopup.addEventListener('click', () => {
            iconsPopup.classList.remove('active');
            if (popupOverlay) popupOverlay.classList.remove('active');
        });
    }
    
    if (popupOverlay && iconsPopup) {
        popupOverlay.addEventListener('click', () => {
            iconsPopup.classList.remove('active');
            popupOverlay.classList.remove('active');
        });
    }
}

// Main initialization function
function initializeApp() {
    // Initialize CodeMirror first
    initializeCodeEditor();
    
    initializeInputListeners();
    initializeTemplateButtons();
    initializeZoomPan();
    initializeClearButton();
    initializeFullscreen();
    initializeApiKey();
    initAI();
    setupIconsPopup();
    setupAIChat();
    setupThemeToggle();
    setupKeyboardShortcuts();
    
    loadSavedApiKey();
    updateApiStatus();
    
    // Initial render with default template
    const defaultCode = templates.basic;
    if (codeEditor) {
        codeEditor.setValue(defaultCode);
    } else if (input) {
        input.value = defaultCode;
    }
    renderDiagram(defaultCode);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 100);
});
