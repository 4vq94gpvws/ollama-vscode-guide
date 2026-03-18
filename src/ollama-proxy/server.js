const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', ollama_host: OLLAMA_HOST });
});

// List models (OpenAI-compatible)
app.get('/v1/models', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    const data = await response.json();
    
    const models = data.models.map(model => ({
      id: model.name,
      object: 'model',
      created: Date.now(),
      owned_by: 'ollama',
      permission: [],
      root: model.name,
      parent: null
    }));
    
    res.json({
      object: 'list',
      data: models
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Chat completions (OpenAI-compatible)
app.post('/v1/chat/completions', async (req, res) => {
  const { model, messages, stream = false, temperature = 0.7, max_tokens } = req.body;
  
  try {
    // Convert OpenAI format to Ollama format
    const ollamaMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const ollamaBody = {
      model: model || 'llama2',
      messages: ollamaMessages,
      stream: stream,
      options: {
        temperature: temperature,
        num_predict: max_tokens
      }
    };
    
    if (stream) {
      // Handle streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ollamaBody)
      });
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('
').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              content += data.message.content;
              const openaiChunk = {
                id: `chatcmpl-${Date.now()}`,
                object: 'chat.completion.chunk',
                created: Math.floor(Date.now() / 1000),
                model: model,
                choices: [{
                  index: 0,
                  delta: { content: data.message.content },
                  finish_reason: null
                }]
              };
              res.write(`data: ${JSON.stringify(openaiChunk)}

`);
            }
            if (data.done) {
              res.write('data: [DONE]

');
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
      res.end();
    } else {
      // Handle non-streaming response
      const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ollamaBody)
      });
      
      const data = await response.json();
      
      const openaiResponse = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: data.message?.content || ''
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: -1,
          completion_tokens: -1,
          total_tokens: -1
        }
      };
      
      res.json(openaiResponse);
    }
  } catch (error) {
    console.error('Error in chat completion:', error);
    res.status(500).json({ error: error.message });
  }
});

// Completions endpoint (for compatibility)
app.post('/v1/completions', async (req, res) => {
  const { model, prompt, stream = false, temperature = 0.7, max_tokens } = req.body;
  
  try {
    const ollamaBody = {
      model: model || 'llama2',
      prompt: prompt,
      stream: stream,
      options: {
        temperature: temperature,
        num_predict: max_tokens
      }
    };
    
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaBody)
    });
    
    const data = await response.json();
    
    res.json({
      id: `cmpl-${Date.now()}`,
      object: 'text_completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [{
        text: data.response || '',
        index: 0,
        logprobs: null,
        finish_reason: 'stop'
      }]
    });
  } catch (error) {
    console.error('Error in completion:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`
🚀 Ollama OpenAI Proxy running on http://localhost:${PORT}`);
  console.log(`📡 Proxying to Ollama at ${OLLAMA_HOST}`);
  console.log(`
Endpoints:`);
  console.log(`  GET  /v1/models          - List available models`);
  console.log(`  POST /v1/chat/completions - Chat completions`);
  console.log(`  POST /v1/completions      - Text completions`);
  console.log(`  GET  /health              - Health check
`);
});
