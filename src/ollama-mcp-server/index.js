#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

// MCP Server setup
const server = new Server(
  {
    name: 'ollama-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'ollama_chat',
        description: 'Chat with a local Ollama model',
        inputSchema: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Model name (e.g., llama2, mistral, codellama)',
            },
            message: {
              type: 'string',
              description: 'The message to send to the model',
            },
            system: {
              type: 'string',
              description: 'Optional system prompt',
            },
            temperature: {
              type: 'number',
              description: 'Temperature for generation (0.0 - 1.0)',
              default: 0.7,
            },
          },
          required: ['model', 'message'],
        },
      },
      {
        name: 'ollama_generate',
        description: 'Generate text using Ollama (non-chat mode)',
        inputSchema: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Model name (e.g., llama2, mistral)',
            },
            prompt: {
              type: 'string',
              description: 'The prompt to generate from',
            },
            temperature: {
              type: 'number',
              description: 'Temperature for generation (0.0 - 1.0)',
              default: 0.7,
            },
          },
          required: ['model', 'prompt'],
        },
      },
      {
        name: 'ollama_list_models',
        description: 'List all available Ollama models',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'ollama_pull_model',
        description: 'Pull a new model from Ollama registry',
        inputSchema: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: 'Model name to pull (e.g., llama2, mistral)',
            },
          },
          required: ['model'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'ollama_chat': {
        const { model, message, system, temperature = 0.7 } = args;
        const messages = [];
        
        if (system) {
          messages.push({ role: 'system', content: system });
        }
        messages.push({ role: 'user', content: message });
        
        const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages,
            stream: false,
            options: { temperature }
          }),
        });
        
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: data.message?.content || 'No response',
            },
          ],
        };
      }
      
      case 'ollama_generate': {
        const { model, prompt, temperature = 0.7 } = args;
        
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt,
            stream: false,
            options: { temperature }
          }),
        });
        
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: data.response || 'No response',
            },
          ],
        };
      }
      
      case 'ollama_list_models': {
        const response = await fetch(`${OLLAMA_HOST}/api/tags`);
        const data = await response.json();
        const models = data.models.map(m => m.name).join('
');
        
        return {
          content: [
            {
              type: 'text',
              text: `Available models:
${models}`,
            },
          ],
        };
      }
      
      case 'ollama_pull_model': {
        const { model } = args;
        
        const response = await fetch(`${OLLAMA_HOST}/api/pull`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: model }),
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `Started pulling model: ${model}. This may take a while...`,
            },
          ],
        };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Ollama MCP Server running on stdio');
}

main().catch(console.error);
