# Ollama + VS Code Integratie Handleiding

## Overzicht

Dit document beschrijft hoe je Ollama (lokale LLM's) kunt integreren met VS Code via verschillende methoden.

---

## Optie 1: Continue.dev Extensie (Aanbevolen)

### Installatie

1. Open VS Code
2. Ga naar Extensions (Ctrl+Shift+X)
3. Zoek naar "Continue"
4. Klik op Install

### Configuratie

1. Open het Continue configuratiebestand:
   - Druk op `Ctrl+Shift+P`
   - Type "Continue: Open Config.json"
   - Selecteer het commando

2. Vervang de inhoud met de configuratie uit `continue-config.json`

3. Herstart VS Code

### Gebruik

- Druk op `Ctrl+L` om de Continue sidebar te openen
- Selecteer een Ollama model uit de dropdown
- Begin met chatten!

---

## Optie 2: Cline Extensie (Directe Ollama ondersteuning)

### Installatie

1. Open VS Code
2. Ga naar Extensions (Ctrl+Shift+X)
3. Zoek naar "Cline"
4. Klik op Install

### Configuratie

1. Open Cline settings:
   - Klik op het Cline icoon in de sidebar
   - Klik op het tandwiel icoon (Settings)

2. Configureer als volgt:
   - **API Provider**: Selecteer "Ollama"
   - **Model ID**: `codellama` (of ander model)
   - **Base URL**: `http://localhost:11434`

3. Sla de instellingen op

### Gebruik

- Open Cline via de sidebar
- Typ je vraag in het chat venster
- Cline gebruikt automatisch je lokale Ollama model

---

## Optie 3: OpenAI-Compatible Proxy

### Stap 1: Start de Proxy Server

```bash
cd src/ollama-proxy
npm install
npm start
```

De proxy draait nu op `http://localhost:3000`

### Stap 2: Configureer Continue.dev

Voeg dit toe aan je Continue configuratie:

```json
{
  "title": "Ollama via Proxy",
  "provider": "openai",
  "model": "llama2",
  "apiKey": "dummy-key",
  "apiBase": "http://localhost:3000/v1"
}
```

---

## Optie 4: MCP Server voor Claude Code

### Stap 1: Configureer MCP Server

1. Open Claude Code
2. Ga naar Settings → MCP Servers
3. Voeg een nieuwe server toe:

```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": ["/pad/naar/ollama-mcp-server/index.js"],
      "env": {
        "OLLAMA_HOST": "http://localhost:11434"
      }
    }
  }
}
```

### Stap 2: Gebruik in Claude Code

- De MCP server biedt tools aan die je kunt aanroepen
- Typ bijvoorbeeld: "Gebruik ollama_chat om een samenvatting te maken van dit bestand"

---

## Ollama Modellen Installeren

### Vereisten

1. Installeer Ollama: https://ollama.com/download
2. Start Ollama: `ollama serve`

### Modellen Downloaden

```bash
# Llama 2
ollama pull llama2

# Mistral
ollama pull mistral

# CodeLlama (voor code)
ollama pull codellama

# Llama 3
ollama pull llama3

# Andere modellen
ollama pull phi
ollama pull neural-chat
```

### Modellen Lijst

```bash
ollama list
```

---

## Troubleshooting

### Ollama niet gevonden

```bash
# Controleer of Ollama draait
curl http://localhost:11434/api/tags

# Start Ollama opnieuw
ollama serve
```

### Proxy verbindingsproblemen

```bash
# Test de proxy
curl http://localhost:3000/health

# Test OpenAI-compatible endpoint
curl http://localhost:3000/v1/models
```

### Continue.dev werkt niet

1. Controleer of het model is gedownload: `ollama list`
2. Controleer de Continue logs: `Ctrl+Shift+P` → "Continue: Open Logs"
3. Ververs Continue: `Ctrl+Shift+P` → "Continue: Reload Window"

---

## Vergelijking van Opties

| Optie | Moeilijkheid | Features | Aanbeveling |
|-------|-------------|----------|-------------|
| Continue.dev | ⭐ Makkelijk | Chat, autocomplete, context | ⭐⭐⭐⭐⭐ |
| Cline | ⭐ Makkelijk | Chat, file editing, commands | ⭐⭐⭐⭐⭐ |
| Proxy | ⭐⭐ Medium | Universele OpenAI-compatibiliteit | ⭐⭐⭐ |
| MCP Server | ⭐⭐⭐ Moeilijk | Tool integratie in Claude Code | ⭐⭐⭐ |

---

## Conclusie

Voor de beste ervaring met Ollama in VS Code:

1. **Continue.dev** - Beste voor dagelijks gebruik met chat en autocomplete
2. **Cline** - Beste voor code editing taken
3. **Proxy** - Handig als je andere tools hebt die OpenAI API verwachten
4. **MCP** - Specifiek voor Claude Code tool integratie

Claude Code zelf heeft GEEN native Ollama ondersteuning, dus je moet een van deze alternatieven gebruiken.
