# Evo AI - AI Agents Platform (Frontend)

Evo AI is an open-source platform for creating and managing AI agents, enabling integration with different AI models and services.

## 🚀 Overview

The Evo AI frontend platform enables:

- User-friendly interface for creating and managing AI agents
- Integration with different language models
- Client management
- Visual configuration of MCP servers
- Custom tools management
- JWT authentication with email verification
- **Agent 2 Agent (A2A) Protocol Support**: Interface for interoperability between AI agents following Google's A2A specification
- **Workflow Agent with ReactFlow**: Visual interface for building complex agent workflows
- **Secure API Key Management**: Interface for encrypted storage of API keys
- **Agent Organization**: Folder structure for organizing agents by categories

## 🧩 Agent Creation Interface

The frontend offers intuitive interfaces for creating different types of agents:

### 1. LLM Agent (Language Model)

Interface for configuring agents based on models like GPT-4, Claude, etc. with tools, MCP servers, and sub-agents.

### 2. A2A Agent (Agent-to-Agent)

Interface for implementing Google's A2A protocol for agent interoperability.

### 3. Sequential Agent

Interface for executing sub-agents in a specific order.

### 4. Parallel Agent

Interface for executing multiple sub-agents simultaneously.

### 5. Loop Agent

Interface for executing sub-agents in a loop with a defined number of iterations.

### 6. Workflow Agent

Visual interface based on ReactFlow for creating complex workflows between agents.

## 🛠️ Technologies

- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [React Query](https://tanstack.com/query/latest) - Data fetching and state management
- [Zustand](https://zustand-demo.pmnd.rs/) - Global state management
- [React Flow](https://reactflow.dev/) - Library for building node-based visual workflows
- [Axios](https://axios-http.com/) - HTTP client for API communication

## 📋 Requirements

- Node.js 18+ (LTS recommended)
- npm, yarn, or pnpm package manager
- Evo AI backend running

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/EvolutionAPI/evo-ai-frontend.git
cd evo-ai-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit the .env file with your settings
```

## 🚀 Running the Project

```bash
# Development mode
npm run dev
# or
yarn dev
# or
pnpm dev

# Production build
npm run build
# or
yarn build
# or
pnpm build

# Start production server
npm run start
# or
yarn start
# or
pnpm start
```

The project will be available at [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

The frontend implements JWT authentication integrated with the backend:

- **User Registration**: Form for creating new accounts
- **Email Verification**: Process for verifying via email
- **Login**: Authentication of existing users
- **Password Recovery**: Complete password recovery flow
- **Secure Storage**: Tokens stored in HttpOnly cookies

## 🖥️ Main Interface Features

### Dashboard

Main dashboard showing:
- Agent overview
- Usage statistics
- Recent activities
- Quick links for agent creation

### Agent Editor

Complete interface for:
- Creating new agents
- Editing existing agents
- Configuring instructions
- Selecting models
- Setting up API keys

### Workflow Editor

Visual editor based on ReactFlow for:
- Creating complex workflows
- Connecting different agents
- Defining conditionals and decision flows
- Visualizing data flow

### API Key Manager

Interface for:
- Adding new API keys
- Securely encrypting keys
- Managing existing keys
- Rotating and updating keys

### Agent Organization

System for:
- Creating folders and categories
- Organizing agents by type or use case
- Searching and filtering agents

## 🔄 Backend Integration

The frontend communicates with the backend through:

- **RESTful API**: Endpoints for resource management
- **WebSockets**: Real-time communication for agent messages
- **Response Streaming**: Support for streaming model responses

## 🐳 Docker Support

The project includes Docker configuration for containerized deployment:

```bash
# Build the Docker image
./docker_build.sh
# or
docker build -t nextjs-frontend .

# Run the container
docker run -p 3000:3000 nextjs-frontend
```

# 🐳 Docker Compose
```bash
# Copy the .env file
cp .env.example .env

# Build and deploy
 docker-compose up -d --build
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes and add tests if possible
4. Run tests and make sure they pass
5. Commit your changes following conventional commits format (`feat: add amazing feature`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

**Trademark Notice:** The name "Evo AI" and related branding are protected trademarks. Unauthorized use is prohibited.

## 👨‍💻 Development Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [ReactFlow](https://reactflow.dev/) 
