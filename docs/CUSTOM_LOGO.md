# 🎨 Custom Logo Guide

## How to Add Your Logo

### Step 1: Create ASCII Art

Gunakan tool online untuk convert gambar ke ASCII art:
- https://www.ascii-art-generator.org/
- https://www.text-image.com/convert/ascii.html
- https://manytools.org/hacker-tools/convert-images-to-ascii-art/

### Step 2: Edit x5-claude-cli.js

Buka file `x5-claude-cli.js` dan cari function `displayHeader()`:

```javascript
function displayHeader() {
  const logo = `
${chalk.cyan('    ╔═══╗')}
${chalk.cyan('    ║')}${chalk.yellow('J')}${chalk.cyan('═╗║')}
${chalk.cyan('    ╚══')}${chalk.yellow('╩')}${chalk.cyan('╝')}
  `;
```

### Step 3: Replace with Your Logo

```javascript
function displayHeader() {
  // Your custom logo here
  const logo = `
${chalk.cyan('    ╔═══════╗')}
${chalk.cyan('    ║')} ${chalk.yellow('JACK')} ${chalk.cyan('║')}
${chalk.cyan('    ╚═══════╝')}
  `;
  
  // Or use the Antigravity-style logo:
  const logo = `
${chalk.blue('    ╱╲')}
${chalk.cyan('   ╱  ╲')}
${chalk.green('  ╱    ╲')}
${chalk.yellow(' ╱      ╲')}
${chalk.red('╱        ╲')}
  `;
  
  // Or use your custom ASCII art:
  const logo = `
${chalk.cyan('  ██╗ █████╗  ██████╗██╗  ██╗')}
${chalk.cyan('  ██║██╔══██╗██╔════╝██║ ██╔╝')}
${chalk.cyan('  ██║███████║██║     █████╔╝ ')}
${chalk.cyan('  ██║██╔══██║██║     ██╔═██╗ ')}
${chalk.cyan('  ██║██║  ██║╚██████╗██║  ██╗')}
${chalk.cyan('  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝')}
  `;
  
  console.clear();
  console.log(logo);
  // ... rest of the function
}
```

## Example Logos

### 1. Simple Box Logo

```javascript
const logo = `
${chalk.cyan('    ┌─────┐')}
${chalk.cyan('    │')} ${chalk.yellow('J')} ${chalk.cyan('A')} ${chalk.green('C')} ${chalk.blue('K')} ${chalk.cyan('│')}
${chalk.cyan('    └─────┘')}
`;
```

Output:
```
    ┌─────┐
    │ J A C K │
    └─────┘
```

### 2. Rainbow Arch (Antigravity Style)

```javascript
const logo = `
${chalk.blue('        ▄▄')}
${chalk.cyan('      ▄▀  ▀▄')}
${chalk.green('    ▄▀      ▀▄')}
${chalk.yellow('  ▄▀          ▀▄')}
${chalk.red(' ▀              ▀')}
`;
```

### 3. Block Letters

```javascript
const logo = `
${chalk.cyan('  ██╗ █████╗  ██████╗██╗  ██╗')}
${chalk.cyan('  ██║██╔══██╗██╔════╝██║ ██╔╝')}
${chalk.cyan('  ██║███████║██║     █████╔╝ ')}
${chalk.cyan('  ██║██╔══██║██║     ██╔═██╗ ')}
${chalk.cyan('  ██║██║  ██║╚██████╗██║  ██╗')}
${chalk.cyan('  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝')}
`;
```

### 4. Minimalist

```javascript
const logo = `
${chalk.cyan('    [ J ]')}
`;
```

### 5. Gradient Effect

```javascript
const logo = `
${chalk.blue('    ╔═══╗')}
${chalk.cyan('    ║')}${chalk.yellow('J')}${chalk.cyan('═╗║')}
${chalk.green('    ╚══')}${chalk.yellow('╩')}${chalk.green('╝')}
`;
```

## Color Options

### Available Colors

```javascript
chalk.black()
chalk.red()
chalk.green()
chalk.yellow()
chalk.blue()
chalk.magenta()
chalk.cyan()
chalk.white()
chalk.gray()
```

### Styles

```javascript
chalk.bold()
chalk.dim()
chalk.italic()
chalk.underline()
```

### Combinations

```javascript
chalk.bold.cyan('Text')
chalk.dim.gray('Text')
chalk.bold.yellow.bgBlue('Text')
```

## Tips

### 1. Keep It Small
- Logo should be 5-10 lines max
- Fits in terminal without scrolling

### 2. Use Colors Wisely
- 2-3 colors max for clean look
- Use cyan/blue for tech feel
- Use gradients for modern look

### 3. Test Different Terminals
- Test in different terminal sizes
- Make sure it looks good in 80-column width

### 4. Align Properly
- Use spaces for indentation
- Keep logo centered

## Example: Adding Your Logo

### Before
```javascript
function displayHeader() {
  const logo = `
${chalk.cyan('    ╔═══╗')}
${chalk.cyan('    ║')}${chalk.yellow('J')}${chalk.cyan('═╗║')}
${chalk.cyan('    ╚══')}${chalk.yellow('╩')}${chalk.cyan('╝')}
  `;
```

### After (Your Custom Logo)
```javascript
function displayHeader() {
  // My awesome logo!
  const logo = `
${chalk.magenta('    ★ ★ ★')}
${chalk.cyan('    JACK')}
${chalk.magenta('    ★ ★ ★')}
  `;
```

### Result
```
    ★ ★ ★
    JACK
    ★ ★ ★
  
    Jack CLI 1.3.0
    jack@terminal
    Claude Opus 4.7 (Thinking)
    /var/www/html/launDry
```

## ASCII Art Resources

### Online Generators
- https://patorjk.com/software/taag/ (Text to ASCII)
- https://www.ascii-art-generator.org/ (Image to ASCII)
- https://www.text-image.com/convert/ascii.html
- https://manytools.org/hacker-tools/convert-images-to-ascii-art/

### ASCII Art Collections
- https://www.asciiart.eu/
- https://ascii.co.uk/art
- https://www.chris.com/ascii/

## Testing Your Logo

```bash
# Test the CLI with your new logo
cd /var/www/html/agentz
node x5-claude-cli.js

# Should show your custom logo!
```

## Troubleshooting

### Logo Too Wide
- Reduce character count per line
- Use shorter ASCII art

### Colors Not Showing
- Make sure chalk is imported
- Check terminal supports colors

### Alignment Issues
- Add/remove spaces for centering
- Use consistent indentation

## Summary

1. **Choose/Create** ASCII art
2. **Edit** `displayHeader()` function
3. **Replace** logo variable
4. **Test** in terminal
5. **Adjust** colors and spacing

🎨 **Make it yours!**
