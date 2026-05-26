# 🔄 Switch to UI v2.0

## Problem

Setelah Ctrl+C dan jalankan `jack` lagi, tampilan kembali ke UI lama (v1.3).

## Solution

Update global installation untuk menggunakan v2.0.

## Steps

### Method 1: Automatic (Recommended)

```bash
cd /var/www/html/agentz
chmod +x update-to-v2.sh
./update-to-v2.sh
```

### Method 2: Manual

```bash
cd /var/www/html/agentz

# 1. Install dependencies
npm install

# 2. Make v2 executable
chmod +x x5-claude-cli-v2.js

# 3. Unlink old version
npm unlink -g jack

# 4. Link new version (v2)
npm link

# 5. Test
jack
```

### Method 3: Quick Fix

```bash
cd /var/www/html/agentz

# Just reinstall
npm unlink -g jack
npm link

# Test
jack
```

## Verification

After running the steps above, test:

```bash
# From any folder
cd /var/www/html/launDry
jack
```

You should see the new UI:

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

## What Changed

**package.json:**
```json
"bin": {
  "jack": "x5-claude-cli-v2.js"  // Changed from x5-claude-cli.js
}
```

This tells npm to use v2 when you run `jack` command.

## Troubleshooting

### Still showing old UI

```bash
# Check which file is linked
which jack
ls -la $(which jack)

# Should point to x5-claude-cli-v2.js

# If not, reinstall
cd /var/www/html/agentz
npm unlink -g jack
npm link
```

### "inquirer" not found

```bash
cd /var/www/html/agentz
npm install
npm link
```

### Permission denied

```bash
sudo npm unlink -g jack
sudo npm link
```

## Switch Back to v1.3

If you want to go back to simple UI:

```bash
cd /var/www/html/agentz

# Edit package.json
# Change: "jack": "x5-claude-cli-v2.js"
# To: "jack": "x5-claude-cli.js"

# Reinstall
npm unlink -g jack
npm link
```

Or use the switcher:

```bash
./switch-ui.sh
# Select: 1 (for v1.3)
```

## Summary

✅ **Updated package.json** to point to v2  
✅ **Reinstall globally** with `npm link`  
✅ **Test** with `jack` command  
✅ **New UI** persists after Ctrl+C  

🎉 **Now v2.0 is your default!**
