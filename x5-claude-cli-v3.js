#!/usr/bin/env node

/**
 * Jack CLI v3.2 - Inline Autocomplete
 * Real-time dropdown when typing / with arrow-key navigation
 * Centered input prompt, no external menu dependency
 */

import readline from "readline";
import axios from "axios";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
// inquirer removed — all interactive menus are now custom raw-mode implementations
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const API_KEY = process.env.X5_API_KEY;
const API_URL = process.env.X5_BASE_URL || 'https://api.x5lab.dev';
const VERSION = '3.2.0';

if (!API_KEY) {
  console.error(chalk.red('❌ Error: X5_API_KEY tidak ditemukan di .env file'));
  process.exit(1);
}

let conversationHistory = [];
let sessionTokens = 0;
let currentModel = process.env.CLAUDE_MODEL || 'claude-opus-4.7';
let currentDirectory = process.cwd();

const AVAILABLE_MODELS = {
  'opus': 'claude-opus-4.7',
  'opus-4.7': 'claude-opus-4.7',
  'sonnet': 'claude-sonnet-4.5',
  'sonnet-4.5': 'claude-sonnet-4.5',
  'haiku': 'claude-haiku-4.5',
  'haiku-4.5': 'claude-haiku-4.5'
};

const COMMANDS = [
  { name: '/clear', description: 'Clear conversation history' },
  { name: '/tokens', description: 'Show token usage' },
  { name: '/model', description: 'Change AI model' },
  { name: '/help', description: 'Show help' },
  { name: '/exit', description: 'Exit the program' }
];

function getModelDisplayName(model) {
  if (model.includes('opus')) return 'Opus';
  if (model.includes('sonnet')) return 'Sonnet';
  if (model.includes('haiku')) return 'Haiku';
  return 'Claude';
}

function getModelStatus(model) {
  if (model.includes('opus')) return 'Thinking';
  if (model.includes('sonnet')) return 'Ready';
  if (model.includes('haiku')) return 'Fast';
  return 'Active';
}

function displayHeader() {
  const logo = [
    chalk.green('  ┌───┐'),
    chalk.green('  │') + chalk.yellow(' J ') + chalk.green('│'),
    chalk.green('  └───┘')
  ];
  
  const modelName = `Claude ${getModelDisplayName(currentModel)}`;
  const modelVersion = currentModel.match(/\d+\.\d+/)?.[0] || '4.7';
  const status = getModelStatus(currentModel);
  
  const info = [
    chalk.green.bold(`Jack O Wee CLI ${VERSION}`),
    chalk.gray('jack@terminal'),
    chalk.blue(`${modelName} ${modelVersion} (${status})`),
    chalk.gray(currentDirectory)
  ];
  
  console.clear();
  
  for (let i = 0; i < Math.max(logo.length, info.length); i++) {
    const logoLine = logo[i] || '       ';
    const infoLine = info[i] || '';
    console.log(logoLine + '  ' + infoLine);
  }
  
  console.log('');
  console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
  console.log(chalk.gray('  Type / for commands, ? for help'));
  console.log('');
}

function displaySeparator() {
  // Separator line (used after response, before input)
  console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
}

function displayResponse(content, tokens) {
  console.log('');
  console.log(content);
  console.log('');
  console.log(chalk.gray(`[↓ ${tokens.input} | ↑ ${tokens.output} | ∑ ${tokens.session_total}]`));
  console.log('');
}

/**
 * Render the dropdown menu below the prompt line.
 * Shows filtered commands with the selected index highlighted.
 */
function renderDropdown(commands, selectedIndex) {
  const cols = process.stdout.columns || 80;
  const menuWidth = Math.min(40, cols - 4);
  const leftPad = Math.floor((cols - menuWidth) / 2);
  const pad = ' '.repeat(leftPad);
  
  let output = '';
  
  // Top border
  output += '\n' + pad + chalk.gray('┌' + '─'.repeat(menuWidth - 2) + '┐');
  
  commands.forEach((cmd, i) => {
    const isSelected = i === selectedIndex;
    const cmdName = cmd.name.padEnd(10);
    const desc = cmd.description;
    const content = ` ${cmdName}  ${desc}`;
    const truncated = content.substring(0, menuWidth - 4);
    const padded = truncated.padEnd(menuWidth - 4);
    
    if (isSelected) {
      output += '\n' + pad + chalk.gray('│') + chalk.bgCyan.black(' ▸ ' + padded.substring(0, menuWidth - 5)) + chalk.gray('│');
    } else {
      output += '\n' + pad + chalk.gray('│') + chalk.gray('   ') + chalk.white(padded.substring(0, menuWidth - 5)) + chalk.gray('│');
    }
  });
  
  // Bottom border
  output += '\n' + pad + chalk.gray('└' + '─'.repeat(menuWidth - 2) + '┘');
  
  // Hint line
  output += '\n' + pad + chalk.gray('  ↑↓ navigate  ⏎ select  esc cancel');
  
  return output;
}

/**
 * Render the input UI (top separator, prompt line, bottom separator, dropdown if visible).
 * Returns the total number of lines rendered.
 */
function renderUI(buffer, cursorPos, dropdownVisible, filteredCommands, selectedIndex, renderedLines) {
  // Clear previous render
  if (renderedLines > 0) {
    // Cursor is on the prompt line. The top separator is 1 line above the prompt line.
    // Move up 1 line to the top separator, and clear to the bottom.
    process.stdout.write('\r\x1b[1A\x1b[J');
  }

  const cols = process.stdout.columns || 80;
  const separator = chalk.gray('─'.repeat(cols));
  
  let output = '';
  // Top separator
  output += separator + '\n';
  // Prompt line (left aligned)
  output += chalk.green(' > ') + buffer + '\n';
  // Bottom separator
  output += separator;
  
  let dropdownLineCount = 0;
  if (dropdownVisible && filteredCommands.length > 0) {
    const dropdownStr = renderDropdown(filteredCommands, selectedIndex);
    output += dropdownStr;
    dropdownLineCount = dropdownStr.split('\n').length - 1;
  }
  
  // Render the entire layout
  process.stdout.write(output);
  
  // Position cursor back onto the prompt line
  const linesUp = 1 + dropdownLineCount;
  if (linesUp > 0) {
    process.stdout.write(`\x1b[${linesUp}A`);
  }
  
  // Column positioning: ' > ' prompt is 3 chars, so cursor is at 3 + cursorPos
  const col = 3 + cursorPos + 1; // 1-indexed
  process.stdout.write(`\r\x1b[${col}G`);
  
  return 3 + dropdownLineCount;
}

/**
 * Get user input with real-time slash-command autocomplete.
 */
async function getUserInput() {
  return new Promise((resolve) => {
    let buffer = '';
    let cursorPos = 0;
    let dropdownVisible = false;
    let selectedIndex = 0;
    let filteredCommands = [];
    let renderedLines = 0;
    
    // Enable raw mode for character-by-character input
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    // Initial render
    renderedLines = renderUI(buffer, cursorPos, dropdownVisible, filteredCommands, selectedIndex, renderedLines);
    
    function updateDropdown() {
      if (buffer.startsWith('/')) {
        const search = buffer.toLowerCase();
        filteredCommands = COMMANDS.filter(cmd => cmd.name.startsWith(search));
        
        if (filteredCommands.length > 0) {
          dropdownVisible = true;
          selectedIndex = Math.min(selectedIndex, filteredCommands.length - 1);
        } else {
          dropdownVisible = false;
        }
      } else {
        dropdownVisible = false;
      }
      renderedLines = renderUI(buffer, cursorPos, dropdownVisible, filteredCommands, selectedIndex, renderedLines);
    }
    
    function finish(result) {
      // Clear the interactive UI completely
      if (renderedLines > 0) {
        process.stdout.write('\r\x1b[1A\x1b[J');
      }
      
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
      
      // Print the final clean line in history
      if (result) {
        console.log(chalk.green(' > ') + chalk.white(result));
      }
      
      resolve(result);
    }
    
    function onData(data) {
      const key = data.toString();
      const hex = data.toString('hex');
      
      // Ctrl+C → exit
      if (key === '\x03') {
        if (renderedLines > 0) {
          process.stdout.write('\r\x1b[1A\x1b[J');
        }
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        console.log(chalk.cyan('\n👋 Goodbye!'));
        process.exit(0);
      }
      
      // Escape → dismiss dropdown or clear buffer
      if (key === '\x1b' && data.length === 1) {
        if (dropdownVisible) {
          dropdownVisible = false;
          buffer = '';
          cursorPos = 0;
          renderedLines = renderUI(buffer, cursorPos, dropdownVisible, filteredCommands, selectedIndex, renderedLines);
          return;
        }
        return;
      }
      
      // Enter → submit
      if (key === '\r' || key === '\n') {
        if (dropdownVisible && filteredCommands.length > 0) {
          finish(filteredCommands[selectedIndex].name);
        } else {
          finish(buffer.trim());
        }
        return;
      }
      
      // Arrow Up
      if (hex === '1b5b41') {
        if (dropdownVisible && filteredCommands.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
          renderedLines = renderUI(buffer, cursorPos, dropdownVisible, filteredCommands, selectedIndex, renderedLines);
        }
        return;
      }
      
      // Arrow Down
      if (hex === '1b5b42') {
        if (dropdownVisible && filteredCommands.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredCommands.length;
          renderedLines = renderUI(buffer, cursorPos, dropdownVisible, filteredCommands, selectedIndex, renderedLines);
        }
        return;
      }
      
      // Arrow Left
      if (hex === '1b5b44') {
        if (cursorPos > 0) {
          cursorPos--;
          renderedLines = renderUI(buffer, cursorPos, dropdownVisible, filteredCommands, selectedIndex, renderedLines);
        }
        return;
      }
      
      // Arrow Right
      if (hex === '1b5b43') {
        if (cursorPos < buffer.length) {
          cursorPos++;
          renderedLines = renderUI(buffer, cursorPos, dropdownVisible, filteredCommands, selectedIndex, renderedLines);
        }
        return;
      }
      
      // Backspace
      if (key === '\x7f' || key === '\x08') {
        if (cursorPos > 0) {
          buffer = buffer.slice(0, cursorPos - 1) + buffer.slice(cursorPos);
          cursorPos--;
          selectedIndex = 0;
          updateDropdown();
        }
        return;
      }
      
      // Tab → auto-complete if single match or select highlighted
      if (key === '\t') {
        if (dropdownVisible && filteredCommands.length === 1) {
          finish(filteredCommands[0].name);
        } else if (dropdownVisible && filteredCommands.length > 0) {
          finish(filteredCommands[selectedIndex].name);
        }
        return;
      }
      
      // Regular character input (printable ASCII)
      if (key.length === 1 && key.charCodeAt(0) >= 32) {
        buffer = buffer.slice(0, cursorPos) + key + buffer.slice(cursorPos);
        cursorPos++;
        selectedIndex = 0;
        updateDropdown();
        return;
      }
    }
    
    process.stdin.on('data', onData);
  });
}

/**
 * Show an interactive model picker using raw mode.
 * Same visual style as the slash command dropdown.
 */
async function showModelPicker() {
  const models = [
    { name: 'opus', description: 'Most powerful (Thinking)', value: 'opus' },
    { name: 'sonnet', description: 'Balanced (Ready)', value: 'sonnet' },
    { name: 'haiku', description: 'Fastest', value: 'haiku' },
  ];

  return new Promise((resolve) => {
    let selectedIndex = 0;
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    function render() {
      const cols = process.stdout.columns || 80;
      const menuWidth = Math.min(44, cols - 4);
      const leftPad = Math.floor((cols - menuWidth) / 2);
      const pad = ' '.repeat(leftPad);
      
      // Clear previous render
      if (render._rendered) {
        // Move up and clear previous menu lines
        const totalLines = models.length + 3; // border top (1) + items (3) + border bottom (1) + hint (1) = 6 lines
        for (let i = 0; i < totalLines; i++) {
          process.stdout.write('\x1b[1A\x1b[2K');
        }
      }
      
      // Top border
      console.log(pad + chalk.cyan('┌' + '─'.repeat(menuWidth - 2) + '┐'));
      
      models.forEach((model, i) => {
        const isSelected = i === selectedIndex;
        const label = model.name.padEnd(10);
        const desc = model.description;
        const content = `${label} ${desc}`;
        const padded = content.padEnd(menuWidth - 6);
        
        if (isSelected) {
          console.log(pad + chalk.cyan('│') + chalk.bgCyan.black(` ▸ ${padded.substring(0, menuWidth - 5)}`) + chalk.cyan('│'));
        } else {
          console.log(pad + chalk.cyan('│') + chalk.gray(`   ${padded.substring(0, menuWidth - 5)}`) + chalk.cyan('│'));
        }
      });
      
      // Bottom border
      console.log(pad + chalk.cyan('└' + '─'.repeat(menuWidth - 2) + '┘'));
      
      // Hint
      console.log(pad + chalk.gray('  ↑↓ navigate  ⏎ select  esc cancel'));
      
      render._rendered = true;
    }
    
    render();
    
    function cleanMenu() {
      if (render._rendered) {
        const totalLines = models.length + 3;
        for (let i = 0; i < totalLines; i++) {
          process.stdout.write('\x1b[1A\x1b[2K');
        }
      }
    }
    
    function onData(data) {
      const key = data.toString();
      const hex = data.toString('hex');
      
      // Ctrl+C or Escape → cancel
      if (key === '\x03' || (key === '\x1b' && data.length === 1)) {
        cleanMenu();
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        resolve(null);
        return;
      }
      
      // Arrow Up
      if (hex === '1b5b41') {
        selectedIndex = (selectedIndex - 1 + models.length) % models.length;
        render();
        return;
      }
      
      // Arrow Down
      if (hex === '1b5b42') {
        selectedIndex = (selectedIndex + 1) % models.length;
        render();
        return;
      }
      
      // Enter → select
      if (key === '\r' || key === '\n') {
        cleanMenu();
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        resolve(models[selectedIndex].value);
        return;
      }
    }
    
    process.stdin.on('data', onData);
  });
}

/**
 * Dynamically list files in the current workspace directory.
 */
function getWorkspaceContext() {
  try {
    const files = fs.readdirSync(currentDirectory);
    const fileList = files
      .filter(f => !f.startsWith('.') && f !== 'node_modules')
      .slice(0, 50); // Limit to 50 files to keep prompt clean
    return {
      directory: currentDirectory,
      files: fileList
    };
  } catch (e) {
    return {
      directory: currentDirectory,
      files: []
    };
  }
}

/**
 * Scan user input for both explicit "@filename" tags and implicit matches of
 * existing filenames (e.g. prd.md, agent.md) or base names (e.g. prd, agent) 
 * in the workspace, and automatically append their content as context.
 */
async function processUserInput(input) {
  if (!input) return input;
  
  // 1. Get all files in the current workspace directory
  let availableFiles = [];
  try {
    availableFiles = fs.readdirSync(currentDirectory).filter(f => !f.startsWith('.') && f !== 'node_modules');
  } catch (e) {
    // Ignore folder read errors
  }

  const filesToLoad = new Set();
  
  // 2. Find explicit @ references (e.g., @prd.md, @prd)
  const explicitRegex = /@([a-zA-Z0-9_\-\.\/]+)/g;
  let match;
  while ((match = explicitRegex.exec(input)) !== null) {
    const ref = match[1];
    // Check if direct match
    if (availableFiles.includes(ref)) {
      filesToLoad.add(ref);
    } else {
      // Check if matches a base name
      const matchedFile = availableFiles.find(f => {
        const ext = path.extname(f);
        const base = path.basename(f, ext);
        return base.toLowerCase() === ref.toLowerCase();
      });
      if (matchedFile) {
        filesToLoad.add(matchedFile);
      } else {
        filesToLoad.add(ref); // Fallback
      }
    }
  }
  
  // 3. Scan the input text for any implicit filename or base name matches
  // Split input into words, ignoring common punctuation
  const words = input.toLowerCase().split(/[\s,;!?"'()\[\]\{\}\*\_]+/);
  for (const word of words) {
    if (!word || word.length < 2) continue; // Skip empty or single-char words
    
    // Check for exact filename match (case-insensitive)
    const exactFile = availableFiles.find(f => f.toLowerCase() === word);
    if (exactFile) {
      filesToLoad.add(exactFile);
    } else {
      // Check for base name match (e.g. user says "prd" and "prd.md" exists)
      const baseMatchFile = availableFiles.find(f => {
        const ext = path.extname(f);
        const base = path.basename(f, ext);
        return base.toLowerCase() === word && ext.length > 0;
      });
      if (baseMatchFile) {
        filesToLoad.add(baseMatchFile);
      }
    }
  }
  
  if (filesToLoad.size === 0) {
    return input;
  }
  
  let enrichedInput = input;
  const loadedFiles = [];
  
  for (const filename of filesToLoad) {
    const filepath = path.resolve(currentDirectory, filename);
    try {
      if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
        const content = fs.readFileSync(filepath, 'utf8');
        enrichedInput += `\n\n---\n[Context File: ${filename}]\n\`\`\`\n${content}\n\`\`\``;
        loadedFiles.push(filename);
      }
    } catch (e) {
      // Ignore if file cannot be read
    }
  }
  
  if (loadedFiles.length > 0) {
    console.log(chalk.cyan(`📎 Auto-loaded context: ${loadedFiles.join(', ')}`));
  }
  
  return enrichedInput;
}

async function callX5LabsAPI(messages, retries = 2) {
  let lastError;
  
  const context = getWorkspaceContext();
  const fileListStr = context.files.length > 0 
    ? `Available files in the workspace:\n${context.files.map(f => `- ${f}`).join('\n')}` 
    : 'No accessible files found in this workspace.';
  
  const systemPrompt = `You are Claude, an AI coding assistant. Help the user with code, debugging, and software development tasks.
You are running locally in the user's terminal.
Current Working Directory: ${context.directory}
${fileListStr}

When providing code, use markdown code blocks with language specification. Be clear, concise, and helpful.`;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(`${API_URL}/v1/messages`, {
        model: currentModel,
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      const usage = response.data.usage || {};
      sessionTokens += (usage.prompt_tokens || usage.input_tokens || 0) + (usage.completion_tokens || usage.output_tokens || 0);

      let content = 'No response';
      
      if (response.data.choices && response.data.choices[0]?.message?.content) {
        content = response.data.choices[0].message.content;
      } else if (response.data.content) {
        if (Array.isArray(response.data.content)) {
          content = response.data.content[0]?.text || 'No response';
        } else if (typeof response.data.content === 'string') {
          content = response.data.content;
        }
      }

      return {
        content: content,
        tokens: {
          input: usage.prompt_tokens || usage.input_tokens || 0,
          output: usage.completion_tokens || usage.output_tokens || 0,
          session_total: sessionTokens
        }
      };
    } catch (error) {
      lastError = error;
      
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Check .env file.');
      }
      
      if (attempt < retries && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || !error.response)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      if (error.response?.data) {
        throw new Error(`API Error: ${JSON.stringify(error.response.data)}`);
      }
      throw new Error(error.message || 'Unknown error');
    }
  }
  
  throw lastError;
}

function formatMessages(history) {
  return history.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

async function main() {
  displayHeader();

  while (true) {
    const userInput = await getUserInput();

    if (userInput === '/exit') {
      console.log(chalk.cyan(`\n👋 Bye! Session tokens used: ${sessionTokens.toLocaleString()}`));
      break;
    }

    if (userInput === '/help' || userInput === '?') {
      console.log('');
      console.log(chalk.cyan.bold('Commands:'));
      COMMANDS.forEach(cmd => {
        console.log(`  ${chalk.bold(cmd.name).padEnd(15)} ${chalk.gray(cmd.description)}`);
      });
      console.log('');
      continue;
    }

    if (userInput === '/clear') {
      conversationHistory = [];
      sessionTokens = 0;
      displayHeader();
      console.log(chalk.yellow('✓ Conversation cleared'));
      console.log('');
      continue;
    }

    if (userInput === '/tokens') {
      console.log(chalk.blue(`📊 Tokens used this session: ${sessionTokens.toLocaleString()}`));
      console.log('');
      continue;
    }

    if (userInput === '/model' || userInput.startsWith('/model ')) {
      const args = userInput.replace('/model', '').trim();
      
      if (!args) {
        console.log(chalk.blue(`🤖 Current model: ${chalk.bold(currentModel)}`));
        console.log('');
        console.log(chalk.gray('Available models:'));
        console.log(chalk.gray('  opus, opus-4.7     - Most powerful'));
        console.log(chalk.gray('  sonnet, sonnet-4.5 - Balanced'));
        console.log(chalk.gray('  haiku, haiku-4.5   - Fastest'));
        console.log('');

        // Offer interactive model selection
        const modelChoice = await showModelPicker();
        if (modelChoice && modelChoice !== '__keep__') {
          currentModel = AVAILABLE_MODELS[modelChoice];
          displayHeader();
          console.log(chalk.green(`✓ Switched to ${chalk.bold(currentModel)}`));
          console.log('');
        }
        continue;
      }

      const modelKey = args.toLowerCase();
      if (AVAILABLE_MODELS[modelKey]) {
        currentModel = AVAILABLE_MODELS[modelKey];
        displayHeader();
        console.log(chalk.green(`✓ Switched to ${chalk.bold(currentModel)}`));
        console.log('');
      } else {
        console.log(chalk.red(`❌ Unknown model: ${args}`));
        console.log('');
      }
      continue;
    }

    if (!userInput.trim()) {
      continue;
    }

    const processedInput = await processUserInput(userInput);

    conversationHistory.push({
      role: 'user',
      content: processedInput
    });

    process.stdout.write(chalk.gray('Thinking '));
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let spinnerIdx = 0;
    const spinInterval = setInterval(() => {
      process.stdout.write(`\r${chalk.gray('Thinking')} ${chalk.cyan(spinner[spinnerIdx++ % spinner.length])}`);
    }, 80);

    try {
      const response = await callX5LabsAPI(formatMessages(conversationHistory));
      
      clearInterval(spinInterval);
      process.stdout.write('\r' + ' '.repeat(20) + '\r');

      displayResponse(response.content, response.tokens);

      conversationHistory.push({
        role: 'assistant',
        content: response.content
      });

    } catch (error) {
      clearInterval(spinInterval);
      process.stdout.write('\r' + ' '.repeat(20) + '\r');
      
      console.log('');
      console.log(chalk.red(`❌ Error: ${error.message}`));
      console.log('');
    }
  }
}

process.on('SIGINT', () => {
  console.log(chalk.cyan('\n\n👋 Goodbye!'));
  process.exit(0);
});

main().catch(err => {
  console.error(chalk.red('Fatal error:', err.message));
  process.exit(1);
});
