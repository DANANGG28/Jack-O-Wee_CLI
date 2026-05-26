#!/usr/bin/env node

/**
 * X5 Labs Claude CLI - Advanced Version
 * Interactive coding assistant dengan file handling dan better UX
 */

const readline = require('readline');
const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Load .env from the script's directory (not current working directory)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const API_KEY = process.env.X5_API_KEY;
const API_URL = process.env.X5_BASE_URL || 'https://api.x5lab.dev';
const SESSION_DIR = '.x5-sessions';

if (!API_KEY) {
  console.error(chalk.red('❌ Error: X5_API_KEY tidak ditemukan di .env file'));
  process.exit(1);
}

// Create session directory
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  history: loadHistory(),
  historySize: 100
});

let conversationHistory = [];
let sessionTokens = 0;
let currentModel = process.env.CLAUDE_MODEL || 'claude-opus-4.7';
const sessionFile = path.join(SESSION_DIR, `session-${Date.now()}.json`);

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

function loadHistory() {
  try {
    const files = fs.readdirSync(SESSION_DIR);
    const latest = files.sort().reverse()[0];
    if (latest) {
      const data = JSON.parse(fs.readFileSync(path.join(SESSION_DIR, latest), 'utf8'));
      return data.history || [];
    }
  } catch (e) {
    return [];
  }
  return [];
}

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function callX5LabsAPI(messages, retries = 2) {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(`${API_URL}/v1/messages`, {
        model: currentModel,
        max_tokens: 4096,
        system: `You are Claude, an AI coding assistant. Help the user with code, debugging, and software development tasks. You have no time limits - you can work on long-running sessions. 

When providing code, use markdown code blocks with language specification. Be clear and concise.`,
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
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Try shorter prompt.');
      }
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

function saveSession() {
  try {
    fs.writeFileSync(sessionFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      tokens: sessionTokens,
      history: conversationHistory,
      history: conversationHistory.map(msg => msg.content.substring(0, 100))
    }, null, 2));
  } catch (e) {
    console.error(chalk.yellow('⚠️ Could not save session'));
  }
}

function extractCodeBlock(text) {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  const blocks = [];
  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'txt',
      code: match[2].trim()
    });
  }
  return blocks;
}

function displayWelcome() {
  console.clear();
  console.log(chalk.cyan.bold('\n╔═══════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║   🚀 X5 Labs Claude CLI (Advanced v1.0)      ║'));
  console.log(chalk.cyan.bold('║       No Time Limit • Full Conversation       ║'));
  console.log(chalk.cyan.bold('╚═══════════════════════════════════════════════╝\n'));
  
  console.log(chalk.gray('Commands:'));
  console.log(chalk.gray('  /clear       - Clear conversation history'));
  console.log(chalk.gray('  /tokens      - Show token usage'));
  console.log(chalk.gray('  /model       - Change AI model'));
  console.log(chalk.gray('  /save <name> - Save code block to file'));
  console.log(chalk.gray('  /code        - Show last code blocks'));
  console.log(chalk.gray('  /load <file> - Load file as context'));
  console.log(chalk.gray('  /help        - Show help'));
  console.log(chalk.gray('  /exit        - Exit program\n'));
}

async function handleSaveCode(args) {
  const blocks = extractCodeBlock(
    conversationHistory.map(h => h.content).join('\n')
  );
  
  if (blocks.length === 0) {
    console.log(chalk.yellow('No code blocks found in conversation.'));
    return;
  }

  console.log(chalk.blue(`Found ${blocks.length} code block(s):\n`));
  blocks.forEach((block, i) => {
    console.log(chalk.gray(`[${i}] ${block.language} - ${block.code.split('\n').length} lines`));
  });

  const idx = await question(chalk.cyan('Select block to save (number): '));
  const blockIdx = parseInt(idx);

  if (blockIdx < 0 || blockIdx >= blocks.length) {
    console.log(chalk.red('Invalid selection.'));
    return;
  }

  const filename = args || `code-${Date.now()}.${blocks[blockIdx].language}`;
  fs.writeFileSync(filename, blocks[blockIdx].code);
  console.log(chalk.green(`✓ Saved to ${filename}\n`));
}

async function handleLoadFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    conversationHistory.push({
      role: 'user',
      content: `Here's the code I want you to review/improve:\n\n\`\`\`\n${content}\n\`\`\``
    });
    console.log(chalk.green(`✓ Loaded ${filepath} as context\n`));
  } catch (e) {
    console.log(chalk.red(`Cannot load file: ${e.message}`));
  }
}

function displayHelp() {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════╗
║           Command Reference               ║
╚═══════════════════════════════════════════╝

CONVERSATION:
  /clear              Reset conversation history
  /tokens             Show token usage breakdown
  /model [name]       Change AI model (opus/sonnet/haiku)
  /exit               Exit program

CODE MANAGEMENT:
  /save [filename]    Save last code block to file
  /code               Display all code blocks from conversation
  /load <filepath>    Load file as conversation context

HELP:
  /help               Show this message
  
TIPS:
  • Type multi-line prompts: Ctrl+V paste large text
  • Use /load to give context about existing files
  • /save saves without asking if you ran /code first
  • Session auto-saves in .x5-sessions/ folder
  • Switch models mid-conversation with /model

EXAMPLES:
  You: /model sonnet
  (Switches to Claude Sonnet for faster/cheaper responses)
  
  You: /load app.js
  You: Review this code and suggest improvements
  
  You: /save utils.js
  (Saves the last code block to utils.js)
`));
}

async function main() {
  displayWelcome();

  while (true) {
    const userInput = await question(chalk.green('You: '));

    // Handle commands
    if (userInput === '/exit') {
      saveSession();
      console.log(chalk.cyan(`\n👋 Goodbye! Session tokens used: ${sessionTokens.toLocaleString()}`));
      console.log(chalk.gray(`Session saved to: ${sessionFile}\n`));
      rl.close();
      break;
    }

    if (userInput === '/clear') {
      conversationHistory = [];
      sessionTokens = 0;
      console.log(chalk.yellow('✓ Conversation cleared\n'));
      continue;
    }

    if (userInput === '/tokens') {
      const total = conversationHistory.length;
      console.log(chalk.blue(`
📊 Token Usage:
  Session total: ${sessionTokens.toLocaleString()}
  Messages: ${total}
  Avg per message: ${Math.round(sessionTokens / (total || 1))}
  Current model: ${currentModel}
`));
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
        const oldModel = currentModel;
        currentModel = AVAILABLE_MODELS[modelKey];
        console.log(chalk.green(`✓ Switched from ${chalk.dim(oldModel)} to ${chalk.bold(currentModel)}\n`));
      } else {
        console.log(chalk.red(`❌ Unknown model: ${args}`));
        console.log(chalk.gray('Available: opus, opus-4.7, sonnet, sonnet-4.5, haiku, haiku-4.5\n'));
      }
      continue;
    }

    if (userInput === '/code') {
      const blocks = extractCodeBlock(
        conversationHistory.map(h => h.content).join('\n')
      );
      if (blocks.length === 0) {
        console.log(chalk.yellow('No code blocks found.\n'));
      } else {
        blocks.forEach((block, i) => {
          console.log(chalk.cyan(`\n[Code Block ${i + 1} - ${block.language}]`));
          console.log(chalk.gray(block.code));
          console.log();
        });
      }
      continue;
    }

    if (userInput.startsWith('/save')) {
      const args = userInput.replace('/save', '').trim();
      await handleSaveCode(args);
      continue;
    }

    if (userInput.startsWith('/load')) {
      const filepath = userInput.replace('/load', '').trim();
      await handleLoadFile(filepath);
      continue;
    }

    if (userInput === '/help') {
      displayHelp();
      continue;
    }

    if (!userInput.trim()) {
      continue;
    }

    conversationHistory.push({
      role: 'user',
      content: userInput
    });

    // Loading animation
    process.stdout.write(chalk.cyan(`Jack | ${getModelDisplayName(currentModel)}: `));
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let spinIdx = 0;
    const spinInterval = setInterval(() => {
      process.stdout.write(`\b${spinner[spinIdx++ % spinner.length]}`);
    }, 80);

    try {
      const response = await callX5LabsAPI(formatMessages(conversationHistory));
      clearInterval(spinInterval);
      process.stdout.write('\b ');

      console.log(response.content);
      console.log(chalk.gray(
        `\n[↓ ${response.tokens.input} | ↑ ${response.tokens.output} | ∑ ${response.tokens.session_total}]\n`
      ));

      conversationHistory.push({
        role: 'assistant',
        content: response.content
      });

      saveSession();

    } catch (error) {
      clearInterval(spinInterval);
      process.stdout.write('\b ');
      
      // Show more helpful error messages
      if (error.message.includes('timeout')) {
        console.log(chalk.red(`\n❌ Request timeout. Server mungkin sedang sibuk. Coba lagi.\n`));
      } else if (error.message.includes('API Error')) {
        console.log(chalk.red(`\n❌ API Error: ${error.message}\n`));
      } else {
        console.log(chalk.red(`\n❌ Error: ${error.message}\n`));
        console.log(chalk.yellow(`💡 Tip: Coba lagi atau gunakan prompt yang lebih pendek.\n`));
      }
    }
  }
}

process.on('SIGINT', () => {
  console.log(chalk.cyan('\n\n👋 Saved session!'));
  saveSession();
  process.exit(0);
});

main().catch(err => {
  console.error(chalk.red('Fatal error:', err.message));
  process.exit(1);
});
