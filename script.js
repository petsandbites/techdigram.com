// Initialize Mermaid with AWS-friendly theme and HTML support
mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        primaryColor: '#FF9900',
        primaryTextColor: '#232F3E',
        primaryBorderColor: '#FF9900',
        lineColor: '#232F3E',
        secondaryColor: '#232F3E',
        tertiaryColor: '#fff'
    },
    securityLevel: 'loose',
    fontFamily: 'arial',
    fontSize: 14,
    htmlLabels: true,
    flowchart: {
        htmlLabels: true
    }
});

const input = document.getElementById('mermaidInput');
const output = document.getElementById('mermaidOutput');
const clearBtn = document.getElementById('clearBtn');
const templateBtns = document.querySelectorAll('.template-btn');

// AWS Architecture Templates with Font Awesome icons
const templates = {
    basic: `graph TD
    User["<i class='fas fa-user'></i><br/>User"] --> CF["<i class='fas fa-cloud'></i><br/>CloudFront"]
    CF --> ALB["<i class='fas fa-balance-scale'></i><br/>Load Balancer"]
    ALB --> EC2["<i class='fab fa-aws'></i><br/>EC2 Instance"]
    EC2 --> RDS["<i class='fas fa-server'></i><br/>RDS Database"]
    
    subgraph "AWS Cloud"
        CF
        ALB
        EC2
        RDS
    end`,
    lambda: `graph TD
    User["<i class='fas fa-user'></i><br/>User"] --> DNS["<i class='fas fa-globe'></i><br/>Route 53"]
    DNS --> CF["<i class='fas fa-cloud'></i><br/>CloudFront"]
    CF --> LE["<i class='fas fa-bolt'></i><br/>Lambda@Edge"]
    LE --> Origin["<i class='fas fa-server'></i><br/>Origin Server"]
    
    subgraph "Config Sources"
        S3["<i class='fas fa-database'></i><br/>S3 Bucket"]
        CFConfig["<i class='fas fa-cloud'></i><br/>CloudFront Config"]
    end
    
    LE --> S3
    LE --> CFConfig`,
    microservices: `graph TD
    User["<i class='fas fa-user'></i><br/>User"] --> API["<i class='fas fa-plug'></i><br/>API Gateway"]
    API --> Auth["<i class='fas fa-key'></i><br/>Cognito"]
    Auth --> ALB["<i class='fas fa-balance-scale'></i><br/>Load Balancer"]
    
    ALB --> UserService["<i class='fas fa-bolt'></i><br/>User Service<br/>(Lambda)"]
    ALB --> OrderService["<i class='fas fa-bolt'></i><br/>Order Service<br/>(Lambda)"]
    ALB --> PaymentService["<i class='fas fa-bolt'></i><br/>Payment Service<br/>(Lambda)"]
    
    UserService --> UserDB["<i class='fas fa-table'></i><br/>DynamoDB<br/>Users"]
    OrderService --> OrderDB["<i class='fas fa-table'></i><br/>DynamoDB<br/>Orders"]
    PaymentService --> PaymentDB["<i class='fas fa-server'></i><br/>RDS<br/>Payments"]
    
    OrderService --> SQS["<i class='fas fa-envelope'></i><br/>SQS Queue"]
    SQS --> NotificationService["<i class='fas fa-bolt'></i><br/>Notification<br/>Service"]
    
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

let renderTimeout;
let diagramCounter = 0;

// Function to render Mermaid diagram
async function renderDiagram(code) {
    if (!code.trim()) {
        output.innerHTML = '<div class="loading">Enter Mermaid code to see the diagram...</div>';
        return;
    }

    try {
        // Clear previous content
        output.innerHTML = '<div class="loading">Rendering diagram...</div>';
        
        // Create unique ID for this diagram
        const diagramId = `mermaid-diagram-${++diagramCounter}`;
        
        // Validate and render the diagram
        const { svg } = await mermaid.render(diagramId, code);
        
        // Display the rendered SVG
        output.innerHTML = svg;
        
    } catch (error) {
        console.error('Mermaid rendering error:', error);
        output.innerHTML = `
            <div class="error-message">
                <strong>Error rendering diagram:</strong><br>
                ${error.message || 'Invalid Mermaid syntax'}
            </div>
        `;
    }
}

// Debounced input handler for real-time updates
function handleInput() {
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(() => {
        renderDiagram(input.value);
    }, 500); // 500ms delay to avoid too frequent updates
}

// Template button handlers
templateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const template = btn.dataset.template;
        if (templates[template]) {
            input.value = templates[template];
            renderDiagram(input.value);
        }
    });
});

// Event listeners
input.addEventListener('input', handleInput);
input.addEventListener('paste', handleInput);

// Clear button functionality
clearBtn.addEventListener('click', () => {
    input.value = '';
    output.innerHTML = '<div class="loading">Enter Mermaid code to see the diagram...</div>';
    input.focus();
});

// Initial render
renderDiagram(input.value);

// Handle keyboard shortcuts
input.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to force re-render
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        renderDiagram(input.value);
    }
});
