# 🤖 Jack's Agentic CLI

> Claude Code-like CLI menggunakan eksternal API **TANPA 5-hour time limit!**

## ✨ Features

### Core Features
- ✅ **Interactive Prompt** - Conversational interface seperti Claude Code
- ✅ **Conversation Memory** - Context tersimpan sepanjang session
- ✅ **Token Tracking** - Monitor penggunaan token real-time
- ✅ **No Time Limit** - Pakai 24/7 selama token ada
- ✅ **Auto-Retry** - Handle temporary network errors automatically

### Advanced Features (v1.1.0)
- 🔄 **Model Switching** - Ganti model on-the-fly tanpa restart
- 🏷️ **Dynamic Labels** - Bot name berubah sesuai model (Jack | Opus/Sonnet/Haiku)
- 💾 **Session Persistence** - Auto-save conversation (advanced version)
- 📝 **Code Management** - Extract & save code blocks (advanced version)

## 🚀 Quick Start

### Option 1: Global Installation (Recommended)

Install Jack CLI globally supaya bisa dipanggil dari folder manapun:

```bash
# Go to agentz folder
cd /var/www/html/agentz

# Run installer
chmod +x install.sh
./install.sh

# Now use from anywhere!
cd /any/project/folder
jack
```

### Option 2: Local Usage

```bash
# Run from agentz folder
cd /var/www/html/agentz
npm start
```

### Configuration

### Configuration

Edit `.env` (akan dibuat otomatis oleh installer):
```env
X5_API_KEY=your_x5_api_key_here
X5_BASE_URL=https://api.x5lab.dev
CLAUDE_MODEL=claude-opus-4.7
```

## 💬 Usage

### Global Usage (After Installation)

```bash
# Go to any project
cd /path/to/your/project

# Start Jack
jack

# Jack will work in context of current folder
You: List files here
You: Read package.json
You: Help me debug this code
```

### Local Usage

```bash
# Basic version
npm start

# Advanced version
node x5-claude-cli-advanced.js
```

### Basic Commands

| Command | Description |
|---------|-------------|
| `/model` | Show current model & available options |
| `/model <name>` | Switch to different model |
| `/tokens` | Show token usage |
| `/clear` | Clear conversation history |
| `/exit` | Exit program |

### Advanced Commands (Advanced version only)

| Command | Description |
|---------|-------------|
| `/code` | Show all code blocks from conversation |
| `/save [filename]` | Save code block to file |
| `/load <filepath>` | Load file as context |
| `/help` | Show help message |

## 🤖 Available Models

| Model | Alias | Use Case | Speed | Cost |
|-------|-------|----------|-------|------|
| claude-opus-4.7 | `opus` | Complex tasks, best quality | Slow | High |
| claude-sonnet-4.5 | `sonnet` | Balanced, recommended | Medium | Medium |
| claude-haiku-4.5 | `haiku` | Quick tasks, simple queries | Fast | Low |

### Model Switching Example

```bash
You: /model
🤖 Current model: claude-opus-4.7

You: /model sonnet
✓ Switched to claude-sonnet-4.5

You: Hello!
Jack | Sonnet: Hey, I'm Kiro — let's build something.
[Tokens: input=4145, output=10, session=4155]

You: /model haiku
✓ Switched to claude-haiku-4.5

You: What is 2+2?
Jack | Haiku: 2 + 2 = 4
[Tokens: input=4149, output=8, session=4163]
```

## 🎯 Use Cases

### Cost Optimization Workflow
```
1. Start with Haiku for brainstorming (cheap)
2. Switch to Sonnet for implementation (balanced)
3. Switch to Opus for review (quality)
```

### Speed Optimization
```
1. Use Haiku for rapid prototyping (fast)
2. Switch to Opus for final polish (quality)
```

### Quality First
```
1. Use Opus for critical code (best)
2. Switch to Sonnet for maintenance (good enough)
```

## 📊 Pricing

X5 Labs gateway pricing:
- **Rp 45,000** = 5M tokens (~normal usage seminggu)
- **Rp 150,000** = 50M tokens (~heavy usage/burst)

### Token Cost Comparison

| Model | Approx Cost per 1M tokens |
|-------|---------------------------|
| Opus | Highest |
| Sonnet | ~50% of Opus |
| Haiku | ~10% of Opus |

**Example Session:**
- 100 messages with Opus: ~Rp 50,000
- 100 messages with Sonnet: ~Rp 25,000
- 100 messages with Haiku: ~Rp 5,000
- Mixed (50 Haiku + 30 Sonnet + 20 Opus): ~Rp 20,000

## 🔧 Technical Details

### Architecture
- **Runtime:** Node.js 18+
- **API:** X5 Labs (OpenAI-compatible format)
- **Dependencies:** axios, chalk, dotenv, readline

### Response Format
X5 Labs uses OpenAI format:
```json
{
  "choices": [
    {
      "message": {
        "content": "Response text",
        "role": "assistant"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 1187,
    "completion_tokens": 13,
    "total_tokens": 1200
  }
}
```

### Auto-Retry Logic
- Retry up to 2 times on network/timeout errors
- Exponential backoff: 1s, 2s
- No retry on auth errors (fail fast)

## 📚 Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [MODEL_SWITCHING.md](MODEL_SWITCHING.md) - Model switching guide
- [DYNAMIC_LABEL.md](DYNAMIC_LABEL.md) - Dynamic label feature
- [RETRY_LOGIC.md](RETRY_LOGIC.md) - Auto-retry documentation
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [DEMO.md](DEMO.md) - Demo & verification

## 🧪 Testing

```bash
# Test API connection
node test-api.js

# Test all models
node quick-test.js

# Test dynamic labels
node test-dynamic-label.js
```

## 🎨 Customization

### Change Bot Name
Edit `x5-claude-cli.js`:
```javascript
process.stdout.write(chalk.cyan(`YourName | ${getModelDisplayName(currentModel)}: `));
```

### Change Default Model
Edit `.env`:
```env
CLAUDE_MODEL=claude-sonnet-4.5
```

### Adjust Retry Count
Edit `callX5LabsAPI` function:
```javascript
async function callX5LabsAPI(messages, retries = 3) { // Change from 2 to 3
```

## 🐛 Troubleshooting

### "Invalid API key" Error
```bash
# Check .env file
cat .env

# Pastikan X5_API_KEY sudah benar
# Tidak ada spasi di awal/akhir
```

### "Cannot find module" Error
```bash
npm install
```

### Slow Response
```bash
# Switch to faster model
You: /model haiku
```

### First Request Error
- Auto-retry akan handle ini
- Kalau masih error, coba lagi manual

## 📈 Comparison: Claude Code vs Jack's CLI

| Feature | Claude Code | Jack's CLI |
|---------|-------------|------------|
| Interactive prompt | ✅ | ✅ |
| Time limit | ❌ 5-hour window | ✅ NONE |
| Pricing | Subscription | Pay per token |
| Model switching | ❌ | ✅ |
| Context memory | ✅ | ✅ |
| Rate limits | Complex | Simple |
| 24/7 usage | ❌ Limited | ✅ Full |
| Cost flexibility | Rigid | Flexible |
| Dynamic labels | ❌ | ✅ |
| Auto-retry | ❌ | ✅ |

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📝 License

MIT

## 🔗 Links

- [X5 Labs](https://x5lab.dev)
- [Claude Documentation](https://docs.claude.com)
- [Node.js](https://nodejs.org)

---

**Made with ❤️ by Jack Kow Wee**

Happy coding! 🚀
