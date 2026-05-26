# 🌍 Global Installation Guide

## Overview

Install Jack CLI secara global supaya bisa dipanggil dari **folder manapun** dengan command `jack`.

## Installation

### Method 1: npm link (Recommended for Development)

```bash
# Di folder agentz
cd /var/www/html/agentz

# Install globally via symlink
npm link

# Test
cd ~
jack
```

**Keuntungan:**
- ✅ Perubahan code langsung apply (symlink)
- ✅ Easy to update
- ✅ Easy to uninstall

**Uninstall:**
```bash
npm unlink -g jack
```

### Method 2: npm install -g (Production)

```bash
# Di folder agentz
cd /var/www/html/agentz

# Install globally
npm install -g .

# Test
cd ~
jack
```

**Keuntungan:**
- ✅ Standalone installation
- ✅ Tidak depend on source folder

**Uninstall:**
```bash
npm uninstall -g jack
```

### Method 3: Manual Symlink (Linux/macOS)

```bash
# Di folder agentz
cd /var/www/html/agentz

# Make executable
chmod +x x5-claude-cli.js

# Create symlink
sudo ln -s $(pwd)/x5-claude-cli.js /usr/local/bin/jack

# Test
cd ~
jack
```

**Uninstall:**
```bash
sudo rm /usr/local/bin/jack
```

## Usage

### Basic Usage

```bash
# Go to any project folder
cd /var/www/html/my-project

# Start Jack CLI
jack

# Jack CLI akan berjalan di context folder my-project
You: List files in this directory
Jack | Opus: [Lists files from my-project]
```

### Example Workflow

```bash
# Project 1
cd /var/www/html/project-a
jack
You: Review this codebase
You: /exit

# Project 2
cd /var/www/html/project-b
jack
You: Help me debug this
You: /exit

# Project 3
cd ~/Documents/my-app
jack
You: Write tests for this
You: /exit
```

## How It Works

### Current Working Directory

Jack CLI akan menggunakan **current working directory** sebagai context:

```bash
# Example
cd /var/www/html/my-app
jack

You: What files are in this folder?
Jack: [Reads from /var/www/html/my-app]

You: Read package.json
Jack: [Reads /var/www/html/my-app/package.json]
```

### Environment Variables

`.env` file tetap dibaca dari **installation folder** (`/var/www/html/agentz/.env`), bukan dari current directory.

Ini berarti:
- ✅ API key sama untuk semua project
- ✅ Tidak perlu setup `.env` di setiap project
- ✅ Centralized configuration

## Configuration

### Global Config Location

```bash
# Installation folder
/var/www/html/agentz/

# Config files
/var/www/html/agentz/.env          # API keys
/var/www/html/agentz/package.json  # Dependencies
```

### Per-Project Config (Optional)

Kalau mau per-project config, bisa buat `.jack.config.js`:

```javascript
// .jack.config.js in your project root
module.exports = {
  model: 'claude-sonnet-4.5',
  maxTokens: 2048,
  systemPrompt: 'You are a React expert.'
};
```

*Note: Feature ini belum implemented, tapi bisa ditambahkan nanti.*

## Verification

### Check Installation

```bash
# Check if jack is installed
which jack

# Expected output (npm link):
/usr/local/bin/jack -> /usr/local/lib/node_modules/jack/x5-claude-cli.js

# Check version
jack --version  # (if implemented)
```

### Test from Different Folders

```bash
# Test 1
cd /tmp
jack
You: /exit

# Test 2
cd ~
jack
You: /exit

# Test 3
cd /var/www/html
jack
You: /exit
```

## Troubleshooting

### "jack: command not found"

**Solution 1: Check npm global bin path**
```bash
npm config get prefix
# Should be /usr/local or ~/.npm-global

# Add to PATH if needed
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc
source ~/.bashrc
```

**Solution 2: Use full path**
```bash
$(npm config get prefix)/bin/jack
```

**Solution 3: Reinstall**
```bash
cd /var/www/html/agentz
npm unlink -g jack
npm link
```

### "Permission denied"

```bash
# Make executable
chmod +x /var/www/html/agentz/x5-claude-cli.js

# Or reinstall with sudo
sudo npm link
```

### "Cannot find module"

```bash
# Reinstall dependencies
cd /var/www/html/agentz
npm install

# Then link again
npm link
```

### Changes not reflecting

```bash
# If using npm link, changes should reflect immediately
# If not, try:
cd /var/www/html/agentz
npm unlink -g jack
npm link
```

## Advanced Usage

### Alias for Different Versions

```bash
# In ~/.bashrc or ~/.zshrc
alias jack-basic='node /var/www/html/agentz/x5-claude-cli.js'
alias jack-advanced='node /var/www/html/agentz/x5-claude-cli-advanced.js'

# Usage
jack-basic      # Basic version
jack-advanced   # Advanced version
```

### Custom Command Name

```bash
# Link with different name
cd /var/www/html/agentz
npm link

# Create alias
alias ai='jack'
alias code-helper='jack'

# Usage
ai              # Same as jack
code-helper     # Same as jack
```

### Multiple Installations

```bash
# Install different versions
npm link                           # jack (latest)
npm link --name jack-dev          # jack-dev (development)
npm link --name jack-prod         # jack-prod (production)
```

## Best Practices

### 1. Use npm link for Development

```bash
cd /var/www/html/agentz
npm link
# Now you can edit code and changes apply immediately
```

### 2. Use npm install -g for Production

```bash
cd /var/www/html/agentz
npm install -g .
# Standalone installation, no dependency on source folder
```

### 3. Keep .env Secure

```bash
# Make sure .env is not world-readable
chmod 600 /var/www/html/agentz/.env
```

### 4. Update Regularly

```bash
cd /var/www/html/agentz
git pull  # If using git
npm link  # Relink if needed
```

## Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| npm link | Changes apply instantly, easy to develop | Depends on source folder | Development |
| npm install -g | Standalone, production-ready | Need to reinstall for updates | Production |
| Manual symlink | Full control | Manual management | Advanced users |

## Summary

✅ **Install globally:**
```bash
cd /var/www/html/agentz
npm link
```

✅ **Use from anywhere:**
```bash
cd /any/project/folder
jack
```

✅ **Uninstall:**
```bash
npm unlink -g jack
```

🚀 **Now you can use Jack from any folder!**
