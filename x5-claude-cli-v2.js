#!/usr/bin/env node

/**
 * Jack CLI v2.0 - Advanced UI
 * Modern CLI with autocomplete and better layout
 */

import readline from "readline";
import axios from "axios";
import chalk from "chalk";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the script's directory
dotenv.config({ path: join(__dirname, '.env') });

const API_KEY = process.env.X5_API_KEY;
const API_URL = process.env.X5_BASE_URL || 'https://api.x5lab.dev';
const VERSION = '2.0.0';

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
  
  // Display logo and info side by side
  for (let i = 0; i < Math.max(logo.length, info.length); i++) {
    const logoLine = logo[i] || '       ';
    const infoLine = info[i] || '';
    console.log(logoLine + '  ' + infoLine);
  }
  
  console.log('');
  console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
  console.log('');
}

function displayInputBorder() {
  console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
}

function displayResponse(content, tokens) {
  console.log('');
  console.log(content);
  console.log('');
  console.log(chalk.gray(`[↓ ${tokens.input} | ↑ ${tokens.output} | ∑ ${tokens.session_total}]`));
  console.log('');
}

async function showCommandMenu(rl, currentInput) {
  return new Promise((resolve) => {
    const filtered = COMMANDS.filter(cmd => 
      cmd.name.startsWith(currentInput) || currentInput === '/'
    );
    
    if (filtered.length === 0) {
      resolve(currentInput);
      return;
    }
    
    let selectedIndex = 0;
    
    // Display menu
    const displayMenu = () => {
      // Clear previous menu
      process.stdout.write('\x1B[' + (filtered.length + 2) + 'A'); // Move up
      process.stdout.write('\x1B[J'); // Clear from cursor down
      
      console.log('');
      filtered.forEach((cmd, index) => {
        const prefix = index === selectedIndex ? chalk.cyan('▶ ') : '  ';
        const cmdName = chalk.bold(cmd.name);
        const cmdDesc = chalk.gray(cmd.description);
        console.log(`${prefix}${cmdName.padEnd(15)} ${cmdDesc}`);
      });
      console.log('');
      console.log(chalk.gray('↑/↓ Navigate · enter Select · tab Complete · esc Cancel'));
      process.stdout.write(chalk.green('> ') + currentInput);
    };
    
    displayMenu();
    
    // Handle key presses
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    
    const onKeypress = (str, key) => {
      if (key.name === 'up') {
        selectedIndex = Math.max(0, selectedIndex - 1);
        displayMenu();
      } else if (key.name === 'down') {
        selectedIndex = Math.min(filtered.length - 1, selectedIndex + 1);
        displayMenu();
      } else if (key.name === 'return') {
        cleanup();
        resolve(filtered[selectedIndex].name);
      } else if (key.name === 'tab') {
        cleanup();
        resolve(filtered[selectedIndex].name);
      } else if (key.name === 'escape') {
        cleanup();
        resolve(currentInput);
      } else if (key.ctrl && key.name === 'c') {
        cleanup();
        process.exit(0);
      }
    };
    
    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      // Clear menu
      process.stdout.write('\x1B[' + (filtered.length + 3) + 'A');
      process.stdout.write('\x1B[J');
    };
    
    process.stdin.on('keypress', onKeypress);
  });
}

async function getUserInput(rl) {
  return new Promise((resolve) => {
    let input = '';
    let cursorPos = 0;
    let menuVisible = false;
    
    const displayPrompt = () => {
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
      process.stdout.write(chalk.green('> ') + input);
      readline.cursorTo(process.stdout, cursorPos + 2);
    };
    
    displayPrompt();
    
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    
    const onKeypress = async (str, key) => {
      if (key.name === 'return') {
        cleanup();
        console.log('');
        resolve(input);
      } else if (key.name === 'backspace') {
        if (cursorPos > 0) {
          input = input.slice(0, cursorPos - 1) + input.slice(cursorPos);
          cursorPos--;
          
          // Hide menu if / is deleted
          if (menuVisible && !input.startsWith('/')) {
            menuVisible = false;
            // Clear menu area
            process.stdout.write('\x1B[10A'); // Move up
            process.stdout.write('\x1B[J'); // Clear from cursor down
          }
          
          displayPrompt();
        }
      } else if (key.name === 'left') {
        cursorPos = Math.max(0, cursorPos - 1);
        displayPrompt();
      } else if (key.name === 'right') {
        cursorPos = Math.min(input.length, cursorPos + 1);
        displayPrompt();
      } else if (key.ctrl && key.name === 'c') {
        cleanup();
        process.exit(0);
      } else if (str && !key.ctrl && !key.meta) {
        input = input.slice(0, cursorPos) + str + input.slice(cursorPos);
        cursorPos++;
        displayPrompt();
        
        // Show menu if typing / or continuing /command
        if (input === '/' || (input.startsWith('/') && str !== ' ')) {
          cleanup();
          menuVisible = true;
          const selected = await showCommandMenu(rl, input);
          input = selected;
          cursorPos = input.length;
          menuVisible = false;
          displayPrompt();
          
          // Re-attach listener
          process.stdin.on('keypress', onKeypress);
        }
      }
    };
    
    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
    };
    
    process.stdin.on('keypress', onKeypress);
  });
}

async function callX5LabsAPI(messages, retries = 2) {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(`${API_URL}/v1/messages`, {
        model: currentModel,
        max_tokens: 4096,
        system: `You are Claude, an AI coding assistant. Help the user with code, debugging, and software development tasks.`,
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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  displayHeader();

  while (true) {
    displayInputBorder();
    const userInput = await getUserInput(rl);
    console.log(chalk.gray('? for shortcuts'));
    console.log('');

    // Handle commands
    if (userInput === '/exit') {
      console.log(chalk.cyan(`\n👋 Bye! Session tokens used: ${sessionTokens.toLocaleString()}`));
      rl.close();
      break;
    }

    if (userInput === '/help' || userInput === '?') {
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

    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: userInput
    });

    // Show loading
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
