# Design Document

## Overview

The LLM Diagram Generator is a frontend-only web application that transforms natural language descriptions into architecture diagrams using ChatGPT API and client-side PlantUML rendering. The application runs entirely in the browser with no backend dependencies.

## Architecture

The application follows a pure client-side architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Environment                       │
│                                                             │
│  ┌─────────────────┐    ┌──────────────────┐               │
│  │   Frontend UI   │───▶│   LLM Service    │──────────────┐ │
│  │                 │    │   (Client-side)  │              │ │
│  └─────────────────┘    └──────────────────┘              │ │
│           │                       │                       │ │
│           ▼                       ▼                       ▼ │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  │ PlantUML Render │    │ Local Storage    │    │   ChatGPT API   │
│  │ (Client-side)   │    │    Service       │    │   (External)    │
│  └─────────────────┘    └──────────────────┘    └─────────────────┘
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Frontend Framework**: React with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for responsive design
- **Code Editor**: Monaco Editor for PlantUML syntax highlighting
- **PlantUML Rendering**: PlantUML.js (client-side) or PlantUML Server API
- **HTTP Client**: Fetch API for ChatGPT communication
- **State Management**: React Context API for application state
- **Storage**: Browser localStorage for project persistence
- **Deployment**: Static hosting (Netlify, Vercel, GitHub Pages)

## Components and Interfaces

### 1. API Key Manager Component
```typescript
interface ApiKeyManager {
  apiKey: string | null;
  setApiKey(key: string): Promise<boolean>;
  validateApiKey(key: string): Promise<boolean>;
  clearApiKey(): void;
}
```

### 2. Prompt Input Component
```typescript
interface PromptInput {
  prompt: string;
  onPromptChange(prompt: string): void;
  onSubmit(): void;
  isLoading: boolean;
}
```

### 3. LLM Service
```typescript
interface LLMService {
  generateDiagram(prompt: string, apiKey: string): Promise<string>;
  extractPlantUML(response: string): string;
}
```

### 4. PlantUML Editor Component
```typescript
interface PlantUMLEditor {
  code: string;
  onChange(code: string): void;
  language: 'plantuml';
  theme: 'vs-dark' | 'light';
}
```

### 5. Diagram Renderer Component
```typescript
interface DiagramRenderer {
  plantUMLCode: string;
  onRenderSuccess(imageUrl: string): void;
  onRenderError(error: string): void;
  exportFormat: 'png' | 'svg' | 'pdf';
}
```

### 6. Project Manager Component
```typescript
interface ProjectManager {
  projects: DiagramProject[];
  currentProject: DiagramProject | null;
  saveProject(project: DiagramProject): void;
  loadProject(id: string): void;
  deleteProject(id: string): void;
}

interface DiagramProject {
  id: string;
  name: string;
  prompt: string;
  plantUMLCode: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Data Models

### DiagramProject Model
```typescript
interface DiagramProject {
  id: string;
  name: string;
  prompt: string;
  plantUMLCode: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AppState Model
```typescript
interface AppState {
  apiKey: string | null;
  currentPrompt: string;
  currentPlantUML: string;
  currentProject: DiagramProject | null;
  projects: DiagramProject[];
  isLoading: boolean;
  error: string | null;
}
```

### LLM Response Model
```typescript
interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
```

## Error Handling

### API Key Validation
- Invalid API key format: Display format requirements
- API key authentication failure: Show clear error message with troubleshooting steps
- Rate limiting: Display retry information and current usage

### LLM Service Errors
- Network connectivity issues: Retry mechanism with exponential backoff
- API quota exceeded: Clear messaging about usage limits
- Invalid response format: Fallback to manual PlantUML editing

### PlantUML Rendering Errors
- Syntax errors: Highlight problematic lines with error descriptions
- Client-side rendering failures: Fallback to PlantUML server API
- Large diagram performance: Implement rendering optimization and user feedback

### Storage Errors
- localStorage quota exceeded: Implement cleanup mechanism
- Corrupted project data: Validation and recovery procedures
- Browser compatibility: Graceful degradation for unsupported features

## Testing Strategy

### Unit Testing
- **LLM Service**: Mock API responses, test PlantUML extraction logic
- **Storage Service**: Test CRUD operations, data validation
- **Utility Functions**: Test prompt processing, error handling

### Integration Testing
- **API Integration**: Test ChatGPT API communication with various prompts
- **PlantUML Rendering**: Test diagram generation with different PlantUML syntax
- **End-to-End Workflow**: Test complete user journey from prompt to rendered diagram

### User Interface Testing
- **Component Testing**: Test React components in isolation
- **User Interaction**: Test form validation, button states, loading indicators
- **Responsive Design**: Test across different screen sizes and devices

### Error Scenario Testing
- **Network Failures**: Test offline behavior and error recovery
- **Invalid Inputs**: Test malformed prompts and API responses
- **Browser Compatibility**: Test across different browsers and versions

## Security Considerations

### API Key Security
- Store API keys only in memory during session
- Clear API keys on page refresh or navigation
- Never log or transmit API keys in plain text
- Implement secure input fields with proper masking
- All API calls made directly from browser to ChatGPT (no proxy server)

### Data Privacy
- All data processing happens client-side only
- No server-side storage or processing of user data
- User prompts and diagrams stored only in browser localStorage
- Clear localStorage option for privacy-conscious users
- Transparent data handling with no external data transmission except to ChatGPT API

## Performance Optimization

### Rendering Performance
- Implement debounced rendering for real-time updates
- Cache rendered diagrams to avoid unnecessary re-rendering
- Lazy load PlantUML rendering service
- Optimize image formats for faster loading

### Memory Management
- Implement project cleanup for old/unused projects
- Limit localStorage usage with size monitoring
- Efficient state updates to prevent unnecessary re-renders
- Proper cleanup of event listeners and subscriptions