#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║   Installing Jack CLI v2.0             ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Make sure we're in the right directory
cd /var/www/html/agentz

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Making v2 executable..."
chmod +x x5-claude-cli-v2.js

echo ""
echo "🗑️  Removing old global link..."
npm unlink -g jack 2>/dev/null || true

echo ""
echo "🔗 Creating new global link..."
npm link

echo ""
echo "✅ Installation complete!"
echo ""
echo "Test it:"
echo "  jack"
echo ""
echo "You should see:"
echo "  ┌───┐  Jack CLI 2.0.0"
echo "  │ J │  jack@terminal"
echo "  └───┘  Claude Opus 4.7 (Thinking)"
echo ""
