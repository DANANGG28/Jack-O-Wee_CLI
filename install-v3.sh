#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║   Installing Jack CLI v3.0             ║"
echo "╚════════════════════════════════════════╝"
echo ""

cd /var/www/html/agentz

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Making v3 executable..."
chmod +x x5-claude-cli-v3.js

echo ""
echo "🗑️  Removing old global link..."
npm unlink -g jack 2>/dev/null || true

echo ""
echo "🔗 Creating new global link..."
npm link

echo ""
echo "✅ Installation complete!"
echo ""
echo "Fixed in v3.0:"
echo "  ✓ Menu auto-hides when / is deleted"
echo "  ✓ Arrow keys (↑/↓) work properly"
echo "  ✓ Input field between 2 lines"
echo "  ✓ Input always at bottom"
echo ""
echo "Test it:"
echo "  jack"
echo ""
