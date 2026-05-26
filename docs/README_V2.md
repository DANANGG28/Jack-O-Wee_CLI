# 🚀 Jack CLI v2.0 - Advanced UI

## What's New in v2.0

### 1. Horizontal Layout
**Before (v1.3):**
```
    ╔═══╗
    ║J═╗║
    ╚══╩╝
  
    Jack CLI 1.3.0
    jack@terminal
```

**After (v2.0):**
```
  ┌───┐  Jack CLI 2.0.0
  │ J │  jack@terminal
  └───┘  Claude Opus 4.7 (Thinking)
```

### 2. Autocomplete Menu
Type `/` and menu appears:
```
  /clear          Clear conversation history
▶ /tokens         Show token usage
  /model          Change AI model
  /help           Show help
  /exit           Exit the program

↑/↓ Navigate · enter Select · tab Complete · esc Cancel
```

### 3. Bordered Input Field
```
────────────────────────────────────────
> Hello Jack!█
────────────────────────────────────────
? for shortcuts
```

## Quick Start

### Option 1: Test v2.0 (Without Switching)

```bash
cd /var/www/html/agentz
npm install
node x5-claude-cli-v2.js
```

### Option 2: Switch to v2.0 Globally

```bash
cd /var/www/html/agentz
chmod +x switch-ui.sh
./switch-ui.sh

# Select: 2 (for v2.0)
```

### Option 3: Manual Switch

```bash
cd /var/www/html/agentz

# Install dependencies
npm install

# Update package.json bin
# Change: "jack": "x5-claude-cli.js"
# To: "jack": "x5-claude-cli-v2.js"

# Reinstall globally
npm unlink -g jack
npm link

# Test
jack
```

## Features Comparison

| Feature | v1.3.0 | v2.0.0 |
|---------|--------|--------|
| Layout | Vertical | Horizontal |
| Logo position | Top | Left |
| Info position | Below logo | Right of logo |
| Autocomplete | ❌ | ✅ |
| Arrow navigation | ❌ | ✅ |
| Input borders | ❌ | ✅ Top & Bottom |
| Help position | Top | Bottom |
| Prompt | `>` | `>` |

## Usage

### Basic Commands

```bash
# Start Jack
jack

# Type / to see menu
> /

# Use arrow keys to navigate
↑ ↓

# Press Enter to select
Enter

# Or type command directly
> /model sonnet
```

### Autocomplete Demo

```
> /█

[Menu appears automatically]

  /clear          Clear conversation history
▶ /tokens         Show token usage
  /model          Change AI model
  /help           Show help
  /exit           Exit the program

[Press ↓ to move down]
[Press Enter to select]
```

### Model Switching

```
> /model

🤖 Current model: claude-opus-4.7

Available models:
  opus, opus-4.7     - Most powerful
  sonnet, sonnet-4.5 - Balanced
  haiku, haiku-4.5   - Fastest

> /model sonnet

✓ Switched to claude-sonnet-4.5
```

## Key Bindings

### Input Field
- `←` `→` - Move cursor
- `Backspace` - Delete
- `Enter` - Submit
- `Ctrl+C` - Exit

### Autocomplete Menu
- `↑` `↓` - Navigate
- `Enter` - Select
- `Tab` - Complete
- `Esc` - Cancel

## Customization

### Change to v1.3.0 UI

```bash
./switch-ui.sh
# Select: 1
```

### Change to v2.0.0 UI

```bash
./switch-ui.sh
# Select: 2
```

### Edit Logo

Edit `x5-claude-cli-v2.js`:

```javascript
const logo = [
  chalk.green('  ┌───┐'),
  chalk.green('  │') + chalk.yellow(' J ') + chalk.green('│'),
  chalk.green('  └───┘')
];
```

### Add Commands

Edit `COMMANDS` array:

```javascript
const COMMANDS = [
  { name: '/clear', description: 'Clear conversation history' },
  { name: '/tokens', description: 'Show token usage' },
  { name: '/model', description: 'Change AI model' },
  { name: '/help', description: 'Show help' },
  { name: '/custom', description: 'Your custom command' }, // Add here
  { name: '/exit', description: 'Exit the program' }
];
```

## Benefits

### v2.0 Advantages
✅ More compact header  
✅ Autocomplete for faster input  
✅ Arrow key navigation  
✅ Professional appearance  
✅ Better use of screen space  

### v1.3 Advantages
✅ Simpler code  
✅ No extra dependencies  
✅ Works on all terminals  
✅ Easier to customize  

## Which Version to Use?

### Use v1.3.0 if:
- You want simplicity
- Your terminal doesn't support raw mode
- You don't need autocomplete
- You prefer vertical layout

### Use v2.0.0 if:
- You want modern UI
- You use autocomplete frequently
- You prefer horizontal layout
- Your terminal supports advanced features

## Installation

### First Time Setup

```bash
cd /var/www/html/agentz

# Install all dependencies
npm install

# Choose version
./switch-ui.sh

# Test
jack
```

### Switching Versions

```bash
# Anytime you want to switch
cd /var/www/html/agentz
./switch-ui.sh
```

## Troubleshooting

### Autocomplete not working
- Check if terminal supports raw mode
- Try v1.3.0 instead
- Update Node.js to latest version

### Menu not showing
- Make sure you typed `/`
- Check terminal compatibility
- Try different terminal emulator

### Arrow keys not working
- Use Tab instead
- Check keyboard layout
- Try v1.3.0

## Documentation

- `UI_V2.md` - Complete v2.0 documentation
- `NEW_UI.md` - v1.3.0 documentation
- `CHANGELOG.md` - Version history
- `README.md` - Main documentation

## Summary

**v1.3.0 - Simple UI:**
- Vertical layout
- No autocomplete
- Simple and clean

**v2.0.0 - Advanced UI:**
- Horizontal layout
- Autocomplete menu
- Arrow navigation
- Bordered input
- Modern design

Choose the version that fits your needs! 🎨

## Quick Commands

```bash
# Test v2.0
node x5-claude-cli-v2.js

# Switch to v2.0
./switch-ui.sh  # Select 2

# Switch back to v1.3
./switch-ui.sh  # Select 1

# Use globally
jack
```

🚀 **Enjoy the new UI!**
