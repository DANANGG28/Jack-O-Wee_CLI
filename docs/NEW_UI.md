# 🎨 New UI Design - v1.3.0

## Overview

UI baru dengan layout yang lebih clean dan modern, mirip dengan Antigravity CLI!

## Features

### 1. Header Section (Always on Top)

```
    ╔═══╗
    ║J═╗║
    ╚══╩╝
  
    Jack CLI 1.2.3
    jack@terminal
    Claude Opus 4.7 (Thinking)
    /var/www/html/launDry

────────────────────────────────────────

? for shortcuts
```

**Components:**
- ✅ Logo (ASCII art)
- ✅ App name & version
- ✅ Username@hostname
- ✅ Current model & status
- ✅ Current working directory
- ✅ Separator line
- ✅ Help hint

### 2. Conversation Area (Scrolls Up)

```
Hello, how can I help?

[↓ 1187 | ↑ 13 | ∑ 1200]

────────────────────────────────────────

What is 2+2?

2 + 2 = 4

[↓ 10 | ↑ 8 | ∑ 1218]

────────────────────────────────────────
```

**Features:**
- ✅ Responses appear above input
- ✅ Token info after each response
- ✅ Separator between messages
- ✅ Scrolls up as conversation grows

### 3. Input Field (Always at Bottom)

```
> █
```

**Features:**
- ✅ Simple `>` prompt
- ✅ Always at bottom
- ✅ Clean and minimal

## UI Comparison

### Before (Old UI)

```
╔════════════════════════════════════════╗
║   Jack O Wee | Claude                  ║
╚════════════════════════════════════════╝

Commands:
  /clear   - Clear conversation history
  /tokens  - Show token usage
  /model   - Change AI model
  /exit    - Exit the program

You: Hello
Jack | Opus: ⠴ Hi! How can I help?
[Tokens: input=1187, output=13, session=1200]

You: _
```

### After (New UI)

```
    ╔═══╗
    ║J═╗║
    ╚══╩╝
  
    Jack CLI 1.2.3
    jack@terminal
    Claude Opus 4.7 (Thinking)
    /var/www/html/launDry

────────────────────────────────────────

? for shortcuts

> Hello

Thinking ⠴

Hi! How can I help?

[↓ 1187 | ↑ 13 | ∑ 1200]

────────────────────────────────────────

> _
```

## Key Improvements

### 1. Persistent Header
- Shows current context at all times
- Model name updates when switched
- Directory shows where you're working

### 2. Clean Input
- Simple `>` prompt
- No "You:" prefix
- Minimal and clean

### 3. Better Response Display
- No "Jack | Opus:" prefix
- Response appears directly
- Token info below response
- Clear separators

### 4. Loading Indicator
- "Thinking ⠴" instead of "Jack | Opus: ⠴"
- Clears after response
- Less cluttered

### 5. Dynamic Status
- "Thinking" for Opus
- "Ready" for Sonnet
- "Fast" for Haiku

## Commands

### Shortcuts

```
> ?

Shortcuts:
  ?        - Show this help
  /clear   - Clear conversation
  /tokens  - Show token usage
  /model   - Change AI model
  /exit    - Exit program
```

### Model Switching

```
> /model sonnet

    ╔═══╗
    ║J═╗║
    ╚══╩╝
  
    Jack CLI 1.2.3
    jack@terminal
    Claude Sonnet 4.5 (Ready)  ← Updated!
    /var/www/html/launDry

────────────────────────────────────────

✓ Switched to claude-sonnet-4.5

> _
```

### Clear Conversation

```
> /clear

    ╔═══╗
    ║J═╗║
    ╚══╩╝
  
    Jack CLI 1.2.3
    jack@terminal
    Claude Opus 4.7 (Thinking)
    /var/www/html/launDry

────────────────────────────────────────

✓ Conversation cleared

> _
```

## Customization

### Change Logo

Edit `displayHeader()` function in `x5-claude-cli.js`:

```javascript
function displayHeader() {
  const logo = `
${chalk.cyan('    ╔═══╗')}
${chalk.cyan('    ║')}${chalk.yellow('J')}${chalk.cyan('═╗║')}
${chalk.cyan('    ╚══')}${chalk.yellow('╩')}${chalk.cyan('╝')}
  `;
  
  // Your custom logo here
  const customLogo = `
${chalk.cyan('    ╔═══╗')}
${chalk.cyan('    ║')}${chalk.red('X')}${chalk.cyan('═╗║')}
${chalk.cyan('    ╚══')}${chalk.red('╩')}${chalk.cyan('╝')}
  `;
  
  console.clear();
  console.log(customLogo); // Use custom logo
  // ...
}
```

### Change Colors

```javascript
// Header
console.log(chalk.cyan.bold(`    Jack CLI ${VERSION}`));

// Change to:
console.log(chalk.magenta.bold(`    Jack CLI ${VERSION}`));

// Model info
console.log(chalk.blue(`    ${modelName} ${modelVersion} (${status})`));

// Change to:
console.log(chalk.green(`    ${modelName} ${modelVersion} (${status})`));
```

### Change Status Text

```javascript
function getModelStatus(model) {
  if (model.includes('opus')) return 'Thinking';
  if (model.includes('sonnet')) return 'Ready';
  if (model.includes('haiku')) return 'Fast';
  return 'Active';
}

// Customize:
function getModelStatus(model) {
  if (model.includes('opus')) return '🧠 Thinking';
  if (model.includes('sonnet')) return '⚡ Ready';
  if (model.includes('haiku')) return '💨 Fast';
  return '✨ Active';
}
```

## Technical Details

### Header Function

```javascript
function displayHeader() {
  const logo = `...`;
  const modelName = `Claude ${getModelDisplayName(currentModel)}`;
  const modelVersion = currentModel.match(/\d+\.\d+/)?.[0] || '4.7';
  const status = getModelStatus(currentModel);
  
  console.clear();
  console.log(logo);
  console.log(chalk.cyan.bold(`    Jack CLI ${VERSION}`));
  console.log(chalk.gray(`    jack@terminal`));
  console.log(chalk.blue(`    ${modelName} ${modelVersion} (${status})`));
  console.log(chalk.gray(`    ${currentDirectory}`));
  console.log('');
  console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
  console.log('');
}
```

### Response Display

```javascript
function displayResponse(content, tokens) {
  console.log('');
  console.log(content);
  console.log('');
  console.log(chalk.gray(`[↓ ${tokens.input} | ↑ ${tokens.output} | ∑ ${tokens.session_total}]`));
  console.log('');
  console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
  console.log('');
}
```

### Loading Indicator

```javascript
// Show loading
console.log('');
process.stdout.write(chalk.gray('Thinking...'));
const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let spinnerIdx = 0;
const spinInterval = setInterval(() => {
  process.stdout.write(`\r${chalk.gray('Thinking')} ${chalk.cyan(spinner[spinnerIdx++ % spinner.length])}`);
}, 80);

// Clear loading
clearInterval(spinInterval);
process.stdout.write('\r' + ' '.repeat(20) + '\r');
```

## Benefits

1. **Cleaner** - Less visual clutter
2. **Modern** - Contemporary CLI design
3. **Contextual** - Always shows current state
4. **Minimal** - Focus on conversation
5. **Professional** - Polished appearance

## Example Session

```
    ╔═══╗
    ║J═╗║
    ╚══╩╝
  
    Jack CLI 1.2.3
    jack@terminal
    Claude Opus 4.7 (Thinking)
    /var/www/html/launDry

────────────────────────────────────────

? for shortcuts

> /model sonnet

✓ Switched to claude-sonnet-4.5

> Write a function to validate email

Thinking ⠴

Here's a function to validate email addresses:

```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

[↓ 4145 | ↑ 50 | ∑ 4195]

────────────────────────────────────────

> /tokens

📊 Tokens used this session: 4,195

> /exit

👋 Bye! Session tokens used: 4,195
```

## Summary

✅ **New UI** - Modern, clean design  
✅ **Persistent Header** - Always shows context  
✅ **Simple Input** - Just `>` prompt  
✅ **Clean Responses** - No prefixes  
✅ **Better Loading** - "Thinking" indicator  
✅ **Dynamic Status** - Changes with model  
✅ **Shortcuts** - `?` for help  

🎉 **UI upgrade complete!**
