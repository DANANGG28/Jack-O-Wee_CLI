# 🐛 Bug Fix v1.2.2

## Problem

```bash
root@NangzzDevices:/var/www/html/launDry# jack
❌ Error: X5_API_KEY tidak ditemukan di .env file
```

## Root Cause

`.env` file dicari di **current working directory** bukan di **installation directory**.

### Before (Wrong)
```javascript
// Loads .env from current directory
dotenv.config();

// If you run from /var/www/html/launDry
// It looks for /var/www/html/launDry/.env ❌
```

### After (Correct)
```javascript
// Loads .env from script's directory
dotenv.config({ path: join(__dirname, '.env') });

// Always looks for /var/www/html/agentz/.env ✅
```

## Solution

Updated both CLI files to load `.env` from script's installation directory:

### x5-claude-cli.js (ES Modules)
```javascript
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });
```

### x5-claude-cli-advanced.js (CommonJS)
```javascript
require('dotenv').config({ path: path.join(__dirname, '.env') });
```

## Fixed Files

- ✅ `x5-claude-cli.js` - Load .env from script directory
- ✅ `x5-claude-cli-advanced.js` - Load .env from script directory

## Verification

```bash
# Test from any folder
cd /var/www/html/launDry
jack

# Should work now!
╔════════════════════════════════════════╗
║   Jack Kow Wee | Claude                ║
╚════════════════════════════════════════╝

Commands:
  /clear   - Clear conversation history
  /tokens  - Show token usage
  /model   - Change AI model
  /exit    - Exit the program

You: Hello!
Jack | Opus: Hi! How can I help?
```

## How It Works Now

### Configuration Location

```
Installation Directory: /var/www/html/agentz/
Config File: /var/www/html/agentz/.env
```

### Usage from Any Folder

```bash
# Folder A
cd /var/www/html/project-a
jack  # ✅ Loads /var/www/html/agentz/.env

# Folder B
cd ~/Documents/my-app
jack  # ✅ Loads /var/www/html/agentz/.env

# Folder C
cd /tmp/test
jack  # ✅ Loads /var/www/html/agentz/.env
```

### Benefits

✅ **Centralized Config** - Single .env for all projects  
✅ **No Setup Required** - No need to create .env in each project  
✅ **Consistent API Key** - Same key everywhere  
✅ **Works from Anywhere** - Call `jack` from any folder  

## Update

If you already installed globally:

```bash
# Changes apply automatically (symlink)
# Just restart jack
cd /any/folder
jack
```

If you need to reinstall:

```bash
cd /var/www/html/agentz
npm unlink -g jack
npm link
```

## Testing

### Test 1: From Different Folders

```bash
# Test from home
cd ~
jack
You: /exit

# Test from /tmp
cd /tmp
jack
You: /exit

# Test from project folder
cd /var/www/html/launDry
jack
You: /exit
```

### Test 2: Verify .env Location

```bash
# Check where .env is loaded from
cd /tmp
jack
You: What is the API URL?
Jack: https://api.x5lab.dev (from /var/www/html/agentz/.env)
```

## Status

✅ **Fixed in v1.2.2**

Now you can use `jack` from any folder and it will always load config from installation directory! 🚀

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| .env location | Current directory | Installation directory |
| Works from any folder | ❌ No | ✅ Yes |
| Need .env in each project | ❌ Yes | ✅ No |
| Centralized config | ❌ No | ✅ Yes |

🎉 **Jack CLI now fully portable!**
