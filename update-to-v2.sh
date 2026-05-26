#!/bin/bash

echo "🔄 Updating Jack CLI to v2.0..."
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Make executable
echo "🔧 Making script executable..."
chmod +x x5-claude-cli-v2.js

# Reinstall globally
echo "🌍 Reinstalling globally..."
npm unlink -g jack 2>/dev/null
npm link

echo ""
echo "✅ Updated to v2.0!"
echo ""
echo "Test it:"
echo "  jack"
echo ""
echo "New UI features:"
echo "  ✓ Horizontal layout (logo + info side by side)"
echo "  ✓ Autocomplete menu (type / to see commands)"
echo "  ✓ Arrow key navigation (↑/↓)"
echo "  ✓ Bordered input field"
echo "  ✓ Menu auto-hides when / is deleted"
