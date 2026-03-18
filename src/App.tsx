import { useState } from 'react';
import { BookOpen, Code, Server, MessageSquare, Terminal, CheckCircle, XCircle, AlertTriangle, ChevronRight, Copy, ExternalLink } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'continue' | 'cline' | 'proxy' | 'mcp'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <span className="text-xs text-slate-400">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copiedCode === id ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
        </button>
      </div>
      <pre className="bg-slate-900 p-4 pt-10 rounded-lg overflow-x-auto text-sm">
        <code className="text-slate-200">{code}</code>
      </pre>
    </div>
  );

  const OptionCard = ({
    title,
    icon: Icon,
    difficulty,
    recommendation,
    features,
    onClick,
    isActive
  }: {
    title: string;
    icon: any;
    difficulty: string;
    recommendation: number;
    features: string[];
    onClick: () => void;
    isActive: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        isActive
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon size={24} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-1 rounded ${
          difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
          difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>{difficulty}</span>
        <span className="text-xs text-slate-400">{'⭐'.repeat(recommendation)}</span>
      </div>
      <ul className="text-sm text-slate-400 space-y-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle size={12} className="text-green-500" />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Terminal size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Ollama + VS Code Integratie</h1>
              <p className="text-slate-400">Complete gids voor lokale LLM integratie</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Alert */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-amber-400 mb-1">Belangrijke Opmerking</h3>
            <p className="text-slate-300">
              <strong>Claude Code</strong> (de VS Code extensie van Anthropic) heeft <span className="text-red-400 font-semibold">GEEN</span> native Ollama ondersteuning. 
              Deze gids biedt 4 alternatieve methoden om Ollama te gebruiken in VS Code.
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <OptionCard
            title="Continue.dev"
            icon={MessageSquare}
            difficulty="Easy"
            recommendation={5}
            features={['Native Ollama', 'Chat + Autocomplete', 'Context aware']}
            onClick={() => setActiveTab('continue')}
            isActive={activeTab === 'continue'}
          />
          <OptionCard
            title="Cline"
            icon={Code}
            difficulty="Easy"
            recommendation={5}
            features={['Native Ollama', 'File editing', 'Terminal integration']}
            onClick={() => setActiveTab('cline')}
            isActive={activeTab === 'cline'}
          />
          <OptionCard
            title="API Proxy"
            icon={Server}
            difficulty="Medium"
            recommendation={3}
            features={['OpenAI compatible', 'Universal', 'Custom integration']}
            onClick={() => setActiveTab('proxy')}
            isActive={activeTab === 'proxy'}
          />
          <OptionCard
            title="MCP Server"
            icon={BookOpen}
            difficulty="Hard"
            recommendation={3}
            features={['Tool integration', 'Claude Code', 'Advanced']}
            onClick={() => setActiveTab('mcp')}
            isActive={activeTab === 'mcp'}
          />
        </div>

        {/* Content */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Overzicht</h2>
              <p className="text-slate-300 mb-6">
                Deze gids helpt je bij het integreren van Ollama (lokale LLM's) met VS Code. 
                Kies een van de 4 methoden hierboven voor gedetailleerde instructies.
              </p>
              
              <h3 className="font-semibold text-white mb-3">Vereisten</h3>
              <ul className="space-y-2 text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-blue-400" />
                  Ollama geïnstalleerd (<a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">Download <ExternalLink size={12} /></a>)
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-blue-400" />
                  VS Code geïnstalleerd
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-blue-400" />
                  Minstens één Ollama model gedownload
                </li>
              </ul>

              <h3 className="font-semibold text-white mb-3">Aanbeveling</h3>
              <p className="text-slate-300">
                Voor de meeste gebruikers raden we <strong className="text-blue-400">Continue.dev</strong> aan. 
                Het biedt de beste combinatie van features: chat, autocomplete, en context awareness.
              </p>
            </div>
          )}

          {activeTab === 'continue' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-blue-400" size={28} />
                <div>
                  <h2 className="text-xl font-bold text-white">Continue.dev</h2>
                  <p className="text-slate-400">De meest complete Ollama integratie voor VS Code</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 1: Installeer Continue.dev</h3>
                  <p className="text-slate-300 mb-2">Open VS Code Extensions en zoek naar "Continue":</p>
                  <CodeBlock
                    id="continue-install"
                    language="bash"
                    code={`# In VS Code:
# 1. Druk Ctrl+Shift+X (Extensions)
# 2. Zoek: "Continue"
# 3. Klik Install`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 2: Configureer Ollama</h3>
                  <p className="text-slate-300 mb-2">Open Continue configuratie:</p>
                  <CodeBlock
                    id="continue-config"
                    language="json"
                    code={`{
  "models": [
    {
      "title": "Ollama - Llama 3",
      "provider": "ollama",
      "model": "llama3",
      "apiBase": "http://localhost:11434"
    },
    {
      "title": "Ollama - CodeLlama",
      "provider": "ollama",
      "model": "codellama",
      "apiBase": "http://localhost:11434"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Autocomplete",
    "provider": "ollama",
    "model": "codellama:7b-code",
    "apiBase": "http://localhost:11434"
  }
}`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 3: Gebruik</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-slate-800 rounded text-sm">Ctrl+L</kbd>
                      Open Continue chat
                    </li>
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-slate-800 rounded text-sm">Ctrl+I</kbd>
                      Inline code edit
                    </li>
                    <li className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-slate-800 rounded text-sm">Tab</kbd>
                      Autocomplete (indien geconfigureerd)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cline' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="text-purple-400" size={28} />
                <div>
                  <h2 className="text-xl font-bold text-white">Cline</h2>
                  <p className="text-slate-400">Directe Ollama ondersteuning met file editing</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 1: Installeer Cline</h3>
                  <p className="text-slate-300 mb-2">Open VS Code Extensions en zoek naar "Cline":</p>
                  <CodeBlock
                    id="cline-install"
                    language="bash"
                    code={`# In VS Code:
# 1. Druk Ctrl+Shift+X (Extensions)
# 2. Zoek: "Cline"
# 3. Klik Install`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 2: Configureer Ollama</h3>
                  <p className="text-slate-300 mb-2">Open Cline settings en configureer:</p>
                  <CodeBlock
                    id="cline-config"
                    language="json"
                    code={`{
  "apiConfiguration": {
    "apiProvider": "ollama",
    "ollamaModelId": "codellama",
    "ollamaBaseUrl": "http://localhost:11434",
    "temperature": 0.7
  }
}`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 3: Gebruik</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Open Cline sidebar
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Typ je vraag in het chat venster
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Cline kan bestanden bewerken en terminal commando's uitvoeren
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proxy' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Server className="text-green-400" size={28} />
                <div>
                  <h2 className="text-xl font-bold text-white">OpenAI-Compatible Proxy</h2>
                  <p className="text-slate-400">Voor tools die OpenAI API verwachten</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 1: Start de Proxy</h3>
                  <CodeBlock
                    id="proxy-start"
                    language="bash"
                    code={`cd src/ollama-proxy
npm install
npm start

# Server draait op http://localhost:3000`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 2: Test de Proxy</h3>
                  <CodeBlock
                    id="proxy-test"
                    language="bash"
                    code={`# Health check
curl http://localhost:3000/health

# List models
curl http://localhost:3000/v1/models

# Chat completion
curl -X POST http://localhost:3000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 3: Gebruik met Continue.dev</h3>
                  <CodeBlock
                    id="proxy-continue"
                    language="json"
                    code={`{
  "title": "Ollama via Proxy",
  "provider": "openai",
  "model": "llama2",
  "apiKey": "dummy-key",
  "apiBase": "http://localhost:3000/v1"
}`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mcp' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-amber-400" size={28} />
                <div>
                  <h2 className="text-xl font-bold text-white">MCP Server</h2>
                  <p className="text-slate-400">Tool integratie voor Claude Code</p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-6">
                <p className="text-amber-200 text-sm">
                  <strong>Let op:</strong> MCP voegt tools toe aan Claude Code, maar vervangt NIET de LLM provider.
                  Je hebt nog steeds een Anthropic API key nodig.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 1: Installeer MCP Server</h3>
                  <CodeBlock
                    id="mcp-install"
                    language="bash"
                    code={`cd src/ollama-mcp-server
npm install`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Stap 2: Configureer in Claude Code</h3>
                  <p className="text-slate-300 mb-2">Voeg toe aan je MCP configuratie:</p>
                  <CodeBlock
                    id="mcp-config"
                    language="json"
                    code={`{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": ["/pad/naar/ollama-mcp-server/index.js"],
      "env": {
        "OLLAMA_HOST": "http://localhost:11434"
      }
    }
  }
}`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Beschikbare Tools</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li><code className="bg-slate-800 px-2 py-1 rounded">ollama_chat</code> - Chat met Ollama model</li>
                    <li><code className="bg-slate-800 px-2 py-1 rounded">ollama_generate</code> - Text generation</li>
                    <li><code className="bg-slate-800 px-2 py-1 rounded">ollama_list_models</code> - Lijst modellen</li>
                    <li><code className="bg-slate-800 px-2 py-1 rounded">ollama_pull_model</code> - Download model</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Vergelijking</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-3 text-slate-400 font-medium">Feature</th>
                  <th className="pb-3 text-blue-400 font-medium">Continue.dev</th>
                  <th className="pb-3 text-purple-400 font-medium">Cline</th>
                  <th className="pb-3 text-green-400 font-medium">Proxy</th>
                  <th className="pb-3 text-amber-400 font-medium">MCP</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-3">Installatie</td>
                  <td className="py-3">⭐ Makkelijk</td>
                  <td className="py-3">⭐ Makkelijk</td>
                  <td className="py-3">⭐⭐ Medium</td>
                  <td className="py-3">⭐⭐⭐ Moeilijk</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3">Chat</td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-3"><XCircle size={16} className="text-red-500" /></td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3">Autocomplete</td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-3"><XCircle size={16} className="text-red-500" /></td>
                  <td className="py-3"><XCircle size={16} className="text-red-500" /></td>
                  <td className="py-3"><XCircle size={16} className="text-red-500" /></td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3">File Editing</td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-3"><XCircle size={16} className="text-red-500" /></td>
                  <td className="py-3"><XCircle size={16} className="text-red-500" /></td>
                </tr>
                <tr>
                  <td className="py-3">MCP Support</td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-3"><XCircle size={16} className="text-red-500" /></td>
                  <td className="py-3"><CheckCircle size={16} className="text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;