# ⚡ Quick Start Guide

## Install Jack CLI Globally

### One-Line Installation

```bash
cd /var/www/html/agentz && chmod +x install.sh && ./install.sh
```

### Step-by-Step

```bash
# 1. Go to agentz folder
cd /var/www/html/agentz

# 2. Make installer executable
chmod +x install.sh

# 3. Run installer
./install.sh
```

## Usage

### Use from Any Folder

```bash
# Go to your project
cd /var/www/html/my-project

# Start Jack
jack

# Start chatting!
You: Hello Jack!
Jack | Opus: Hi! How can I help?
```

### Example Workflow

```bash
# Project A
cd ~/projects/website
jack
You: Review this React component
You: /exit

# Project B  
cd ~/projects/api
jack
You: Help me debug this endpoint
You: /exit

# Project C
cd ~/Documents/app
jack
You: Write tests for this function
You: /exit
```

## Commands

```bash
jack          # Start Jack CLI
/model        # Switch AI model
/model sonnet # Switch to Sonnet
/model haiku  # Switch to Haiku
/tokens       # Show token usage
/clear        # Clear conversation
/exit         # Exit
```

## Model Switching

```bash
You: /model
🤖 Current model: claude-opus-4.7

Available models:
  opus, opus-4.7     - Most powerful (expensive)
  sonnet, sonnet-4.5 - Balanced (recommended)
  haiku, haiku-4.5   - Fastest (cheapest)

You: /model sonnet
✓ Switched to claude-sonnet-4.5

You: Hello!
Jack | Sonnet: Hey! Let's build something.
```

## Uninstall

```bash
cd /var/www/html/agentz
chmod +x uninstall.sh
./uninstall.sh
```

## Troubleshooting

### "jack: command not found"

```bash
# Add npm global bin to PATH
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc
source ~/.bashrc
```

### "Permission denied"

```bash
# Run with sudo
cd /var/www/html/agentz
sudo ./install.sh
```

### Changes not reflecting

```bash
# Reinstall
cd /var/www/html/agentz
npm unlink -g jack
npm link
```

## Tips

### 1. Use Haiku for Quick Tasks
```bash
You: /model haiku
You: What is 2+2?
Jack | Haiku: 4
```

### 2. Use Sonnet for Daily Work
```bash
You: /model sonnet
You: Implement this feature
Jack | Sonnet: [Balanced implementation]
```

### 3. Use Opus for Complex Tasks
```bash
You: /model opus
You: Refactor this entire architecture
Jack | Opus: [Detailed analysis]
```

### 4. Track Token Usage
```bash
You: /tokens
📊 Tokens used this session: 5,234
```

### 5. Clear History to Save Tokens
```bash
You: /clear
✓ Conversation history cleared
```

## Next Steps

- Read [README.md](README.md) for complete documentation
- Read [MODEL_SWITCHING.md](MODEL_SWITCHING.md) for model guide
- Read [GLOBAL_INSTALL.md](GLOBAL_INSTALL.md) for advanced installation

🚀 **Happy coding with Jack!**
