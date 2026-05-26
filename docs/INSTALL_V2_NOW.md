# 🚀 Install UI v2.0 - Step by Step

## Current Problem

Kamu masih lihat UI lama (vertical layout) seperti ini:

```
    ╔═══╗
    ║J═╗║
    ╚══╩╝
  
    Jack CLI 1.2.3
```

## Solution

Jalankan command ini **di WSL terminal** (bukan PowerShell):

### Step 1: Open WSL Terminal

```bash
# Di PowerShell, ketik:
wsl
```

### Step 2: Go to agentz folder

```bash
cd /var/www/html/agentz
```

### Step 3: Run install script

```bash
chmod +x install-v2.sh
./install-v2.sh
```

### Step 4: Test

```bash
# Go to any folder
cd /var/www/html/launDry

# Run jack
jack
```

## Expected Result

Kamu harus lihat UI baru seperti ini:

```
  ┌───┐  Jack CLI 2.0.0
  │ J │  jack@terminal
  └───┘  Claude Opus 4.7 (Thinking)
         /var/www/html/launDry

────────────────────────────────────────

────────────────────────────────────────
> _
────────────────────────────────────────
? for shortcuts
```

## Complete Commands (Copy-Paste)

```bash
# 1. Open WSL
wsl

# 2. Go to folder
cd /var/www/html/agentz

# 3. Install
chmod +x install-v2.sh && ./install-v2.sh

# 4. Test
cd /var/www/html/launDry && jack
```

## If Still Not Working

### Manual Method

```bash
# In WSL terminal
cd /var/www/html/agentz

# Install dependencies
npm install

# Make executable
chmod +x x5-claude-cli-v2.js

# Remove old link
npm unlink -g jack

# Create new link
npm link

# Test
jack
```

### Check Installation

```bash
# Check which file is linked
which jack
# Should show: /usr/local/bin/jack

# Check what it points to
ls -la $(which jack)
# Should point to: x5-claude-cli-v2.js

# Check version
head -1 $(which jack)
# Should show: #!/usr/bin/env node
```

## Troubleshooting

### "npm: command not found"

```bash
# Install Node.js in WSL
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### "Permission denied"

```bash
sudo chmod +x install-v2.sh
sudo ./install-v2.sh
```

### Still showing old UI

```bash
# Force reinstall
cd /var/www/html/agentz
sudo npm unlink -g jack
sudo npm link

# Clear npm cache
npm cache clean --force

# Try again
jack
```

## Why This Happens

The issue is that `npm link` needs to be run **inside WSL**, not from PowerShell/Windows.

When you run `npm link` from PowerShell, it creates a Windows link, not a WSL link.

## Summary

✅ **Open WSL terminal** (not PowerShell)  
✅ **Run install-v2.sh** in WSL  
✅ **Test with jack** command  
✅ **Should see horizontal layout**  

🎯 **Key: Run everything in WSL, not PowerShell!**
