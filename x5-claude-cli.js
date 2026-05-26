#!/usr/bin/env node

/**
 * X5 Labs Claude CLI
 * Interactive coding assistant dengan X5 Labs API (tanpa 5-hour limit)
 * 
 * Installation:
 * npm install readline axios chalk dotenv
 * 
 * Usage:
 * 1. Create .env file dengan:
 *    X5_API_KEY=your_api_key_here
 *    X5_BASE_URL=https://api.x5lab.dev
 * 
 * 2. Run: node x5-claude-cli.js
 */

// const readline = require('readline');
// const axios = require('axios');
// const chalk = require('chalk');
// require('dotenv').config();

import readline from "readline";
import axios from "axios";
import chalk from "chalk";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the script's directory (not current working directory)
dotenv.config({ path: join(__dirname, '.env') });

const API_KEY = process.env.X5_API_KEY;
const API_URL = process.env.X5_BASE_URL || 'https://api.x5lab.dev';
const VERSION = '1.2.3';

if (!API_KEY) {
  console.error(chalk.red('❌ Error: X5_API_KEY tidak ditemukan di .env file'));
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function getModelDisplayName(model) {
  if (model.includes('opus')) return 'Opus';
  if (model.includes('sonnet')) return 'Sonnet';
  if (model.includes('haiku')) return 'Haiku';
  return 'Claude';
}

function getModelStatus(model) {
  // Return status based on model
  if (model.includes('opus')) return 'Thinking';
  if (model.includes('sonnet')) return 'Ready';
  if (model.includes('haiku')) return 'Fast';
  return 'Active';
}

function displayHeader() {
  const logo = `
${chalk.cyan('    ╔═══╗')}
${chalk.cyan('    ║')}${chalk.yellow('J')}${chalk.cyan('═╗║')}
${chalk.cyan('    ╚══')}${chalk.yellow('╩')}${chalk.cyan('╝')}
  `;
  
  const modelName = `Claude ${getModelDisplayName(currentModel)}`;
  const modelVersion = currentModel.match(/\d+\.\d+/)?.[0] || '4.7';
  const status = getModelStatus(currentModel);
  
  console.clear();
  console.log(logo);
  console.log(chalk.cyan.bold(`    Jack O Wee CLI ${VERSION}`));
  console.log(chalk.gray(`    jack@terminal`));
  console.log(chalk.blue(`    ${modelName} ${modelVersion} (${status})`));
  console.log(chalk.gray(`    ${currentDirectory}`));
  console.log('');
  console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
  console.log('');
}

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function callX5LabsAPI(messages, retries = 2) {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(`${API_URL}/v1/messages`, {
        model: currentModel,
        max_tokens: 4096,
        system: `You are Claude, an AI coding assistant. Help the user with code, debugging, and software development tasks. You have no time limits - you can work on long-running sessions. When appropriate, provide code examples and explanations.`,
        messages: messages
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      });

      // Debug: Log response structure (comment out in production)
      if (process.env.DEBUG) {
        console.log('\n[DEBUG] Response structure:', JSON.stringify(response.data, null, 2));
      }

      const usage = response.data.usage || {};
      sessionTokens += (usage.prompt_tokens || usage.input_tokens || 0) + (usage.completion_tokens || usage.output_tokens || 0);

      // Handle different response formats (OpenAI vs Anthropic)
      let content = 'No response';
      
      // OpenAI format (X5 Labs uses this)
      if (response.data.choices && response.data.choices[0]?.message?.content) {
        content = response.data.choices[0].message.content;
      }
      // Anthropic format
      else if (response.data.content) {
        if (Array.isArray(response.data.content)) {
          content = response.data.content[0]?.text || response.data.content[0]?.content || 'No response';
        } else if (typeof response.data.content === 'string') {
          content = response.data.content;
        }
      } 
      // Fallback formats
      else if (response.data.text) {
        content = response.data.text;
      } else if (response.data.message) {
        content = response.data.message;
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
      
      // Don't retry on auth errors
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Check .env file.');
      }
      
      // Retry on network/timeout errors
      if (attempt < retries && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || !error.response)) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      // Last attempt or non-retryable error
      if (error.response?.data) {
        throw new Error(`API Error: ${JSON.stringify(error.response.data)}`);
      }
      throw new Error(error.message || 'Unknown error');
    }
  }
  
  // All retries failed
  throw lastError;
}

function formatMessages(history) {
  return history.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

function displayWelcome() {
  displayHeader();
  console.log(chalk.gray('? for shortcuts'));
  console.log('');
}

function displayResponse(content, tokens) {
  console.log('');
  console.log(content);
  console.log('');
  console.log(chalk.gray(`[↓ ${tokens.input} | ↑ ${tokens.output} | ∑ ${tokens.session_total}]`));
  console.log('');
  console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
  console.log('');
}

async function main() {
  displayWelcome();

  while (true) {
    const userInput = await question(chalk.green('> '));

    // Handle commands
    if (userInput === '/exit') {
      console.log(chalk.cyan(`\n👋 Bye! Session tokens used: ${sessionTokens.toLocaleString()}`));
      rl.close();
      break;
    }

    if (userInput === '?') {
      console.log('');
      console.log(chalk.cyan.bold('Shortcuts:'));
      console.log(chalk.gray('  ?        - Show this help'));
      console.log(chalk.gray('  /clear   - Clear conversation'));
      console.log(chalk.gray('  /tokens  - Show token usage'));
      console.log(chalk.gray('  /model   - Change AI model'));
      console.log(chalk.gray('  /exit    - Exit program'));
      console.log('');
      console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
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
      console.log(chalk.blue(`\n📊 Tokens used this session: ${sessionTokens.toLocaleString()}\n`));
      continue;
    }

    if (userInput === '/model' || userInput.startsWith('/model ')) {
      const args = userInput.replace('/model', '').trim();
      
      if (!args) {
        // Show current model and available options
        console.log(chalk.blue(`\n🤖 Current model: ${chalk.bold(currentModel)}\n`));
        console.log(chalk.gray('Available models:'));
        console.log(chalk.gray('  opus, opus-4.7     - Most powerful (expensive)'));
        console.log(chalk.gray('  sonnet, sonnet-4.5 - Balanced (recommended)'));
        console.log(chalk.gray('  haiku, haiku-4.5   - Fastest (cheapest)\n'));
        console.log(chalk.gray('Usage: /model <name>'));
        console.log(chalk.gray('Example: /model sonnet\n'));
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
        console.log(chalk.gray('Available: opus, opus-4.7, sonnet, sonnet-4.5, haiku, haiku-4.5\n'));
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

    // Show loading indicator
    console.log('');
    process.stdout.write(chalk.gray('Thinking...'));
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let spinnerIdx = 0;
    const spinInterval = setInterval(() => {
      process.stdout.write(`\r${chalk.gray('Thinking')} ${chalk.cyan(spinner[spinnerIdx++ % spinner.length])}`);
    }, 80);

    try {
      const response = await callX5LabsAPI(formatMessages(conversationHistory));
      
      clearInterval(spinInterval);
      process.stdout.write('\r' + ' '.repeat(20) + '\r'); // Clear loading line

      // Display response
      displayResponse(response.content, response.tokens);

      // Add to history
      conversationHistory.push({
        role: 'assistant',
        content: response.content
      });

    } catch (error) {
      clearInterval(spinInterval);
      process.stdout.write('\r' + ' '.repeat(20) + '\r'); // Clear loading line
      
      // Show more helpful error messages
      console.log('');
      if (error.message.includes('timeout')) {
        console.log(chalk.red(`❌ Request timeout. Server mungkin sedang sibuk. Coba lagi.`));
      } else if (error.message.includes('API Error')) {
        console.log(chalk.red(`❌ API Error: ${error.message}`));
      } else {
        console.log(chalk.red(`❌ Error: ${error.message}`));
        console.log(chalk.yellow(`💡 Tip: Coba lagi atau gunakan prompt yang lebih pendek.`));
      }
      console.log('');
      console.log(chalk.gray('─'.repeat(process.stdout.columns || 80)));
      console.log('');
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.cyan('\n\n👋 Goodbye!'));
  process.exit(0);
});

main().catch(err => {
  console.error(chalk.red('Fatal error:', err.message));
  process.exit(1);
});
