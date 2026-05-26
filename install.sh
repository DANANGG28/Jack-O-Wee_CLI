#!/bin/bash

# Jack CLI Global Installer
# This script installs Jack CLI globally so you can use it from any folder

echo "╔════════════════════════════════════════╗"
echo "║   Jack CLI - Global Installer          ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Please install Node.js first: https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✓ npm found: $(npm --version)"
echo ""

# Get current directory
INSTALL_DIR=$(pwd)
echo "📁 Installation directory: $INSTALL_DIR"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Creating from .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✓ Created .env file"
        echo "⚠️  Please edit .env and add your X5_API_KEY!"
        echo ""
    else
        echo "❌ .env.example not found!"
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Make executable
echo "🔧 Making script executable..."
chmod +x x5-claude-cli.js
chmod +x x5-claude-cli-advanced.js
echo "✓ Scripts are now executable"
echo ""

# Install globally
echo "🌍 Installing globally..."
npm link

if [ $? -ne 0 ]; then
    echo "❌ Failed to install globally!"
    echo "   Try with sudo: sudo npm link"
    exit 1
fi

echo "✓ Jack CLI installed globally!"
echo ""

# Verify installation
if command -v jack &> /dev/null; then
    echo "✅ Installation successful!"
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║   Jack CLI is ready to use!            ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    echo "Usage:"
    echo "  1. Go to any project folder:"
    echo "     cd /path/to/your/project"
    echo ""
    echo "  2. Start Jack CLI:"
    echo "     jack"
    echo ""
    echo "  3. Start chatting!"
    echo "     You: Hello Jack!"
    echo ""
    echo "Commands:"
    echo "  jack          - Start Jack CLI (basic version)"
    echo "  /model        - Switch AI model"
    echo "  /tokens       - Show token usage"
    echo "  /clear        - Clear conversation"
    echo "  /exit         - Exit"
    echo ""
    echo "Documentation:"
    echo "  README.md           - Complete guide"
    echo "  GLOBAL_INSTALL.md   - Global installation guide"
    echo "  MODEL_SWITCHING.md  - Model switching guide"
    echo ""
    echo "🚀 Happy coding!"
else
    echo "⚠️  Installation completed but 'jack' command not found in PATH"
    echo ""
    echo "Try adding npm global bin to your PATH:"
    echo "  echo 'export PATH=\"\$PATH:\$(npm config get prefix)/bin\"' >> ~/.bashrc"
    echo "  source ~/.bashrc"
    echo ""
    echo "Or use full path:"
    echo "  $(npm config get prefix)/bin/jack"
fi
