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

// AI Elements
const apiKeyInput = document.getElementById('apiKeyInput');
const apiStatus = document.getElementById('apiStatus');
const aiPanel = document.getElementById('aiPanel');
const aiPromptInput = document.getElementById('aiPromptInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiResponse = document.getElementById('aiResponse');
const aiResponseText = document.getElementById('aiResponseText');
const applyBtn = document.getElementById('applyBtn');

// Popup elements
const infoIcon = document.getElementById('infoIcon');
const popupOverlay = document.getElementById('popupOverlay');
const instructionsPopup = document.getElementById('instructionsPopup');
const closePopup = document.getElementById('closePopup');

let currentApiKey = '';
let lastAiResponse = '';

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

// API Key Management
apiKeyInput.addEventListener('input', (e) => {
    currentApiKey = e.target.value.trim();
    updateApiStatus();
});

function updateApiStatus() {
    if (!currentApiKey) {
        apiStatus.textContent = 'No API key';
        apiStatus.style.background = 'rgba(231, 76, 60, 0.2)';
        aiSendBtn.disabled = true;
        aiPanel.classList.remove('active');
    } else if (currentApiKey.startsWith('AIza')) {
        apiStatus.textContent = 'API key valid';
        apiStatus.style.background = 'rgba(39, 174, 96, 0.2)';
        aiSendBtn.disabled = false;
        aiPanel.classList.add('active');
    } else {
        apiStatus.textContent = 'Invalid format (should start with AIza)';
        apiStatus.style.background = 'rgba(243, 156, 18, 0.2)';
        aiSendBtn.disabled = true;
        aiPanel.classList.remove('active');
    }
}

// AI Integration with Google Gemini
async function callGemini(prompt, currentCode) {
    const systemPrompt = `You are an expert at creating and modifying Mermaid diagrams, especially AWS architecture diagrams. 

The user has a current Mermaid diagram and wants to modify it. Please:
1. Analyze their current diagram
2. Understand their modification request
3. Generate the updated Mermaid code
4. Use Font Awesome icons in the format: ["<i class='fas fa-icon-name'></i><br/>Service Name"]
5. Keep AWS services properly organized in subgraphs when appropriate

Respond with ONLY the updated Mermaid code, no explanations or markdown formatting.`;
    
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
                    maxOutputTokens: 1000
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

// AI Send Button Handler
aiSendBtn.addEventListener('click', async () => {
    const prompt = aiPromptInput.value.trim();
    if (!prompt) return;
    
    aiSendBtn.disabled = true;
    aiSendBtn.innerHTML = '<div class="loading-spinner"></div>Thinking...';
    aiResponse.classList.remove('active');
    
    try {
        const currentCode = input.value;
        const updatedCode = await callGemini(prompt, currentCode);
        
        lastAiResponse = updatedCode;
        aiResponseText.textContent = `AI suggests this updated diagram:\n\n${updatedCode}`;
        aiResponse.classList.add('active');
        
    } catch (error) {
        let errorMessage = error.message;
        if (error.message.includes('quota')) {
            errorMessage += '\n\nAlternatives:\n• Check your Google Cloud billing\n• Use a different API key\n• Try the manual templates above';
        }
        aiResponseText.textContent = `Error: ${errorMessage}`;
        aiResponse.classList.add('active');
    } finally {
        aiSendBtn.disabled = false;
        aiSendBtn.textContent = 'Ask AI';
    }
});

// Apply Changes Button
applyBtn.addEventListener('click', () => {
    if (lastAiResponse) {
        input.value = lastAiResponse;
        renderDiagram(lastAiResponse);
        aiPromptInput.value = '';
        aiResponse.classList.remove('active');
    }
});

// Enter key in AI prompt
aiPromptInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!aiSendBtn.disabled) {
            aiSendBtn.click();
        }
    }
});

// Popup functionality
infoIcon.addEventListener('click', () => {
    popupOverlay.classList.add('active');
    instructionsPopup.classList.add('active');
});

closePopup.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
    instructionsPopup.classList.remove('active');
});

popupOverlay.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
    instructionsPopup.classList.remove('active');
});

// Initialize API status
updateApiStatus();
