#!/bin/bash

# Script to switch between UI versions

echo "╔════════════════════════════════════════╗"
echo "║   Jack CLI - UI Version Switcher       ║"
echo "╚════════════════════════════════════════╝"
echo ""

echo "Available versions:"
echo "  1. v1.3.0 - Simple UI (vertical layout)"
echo "  2. v2.0.0 - Advanced UI (horizontal layout + autocomplete)"
echo ""

read -p "Select version (1 or 2): " version

if [ "$version" == "1" ]; then
    echo ""
    echo "Switching to v1.3.0..."
    
    # Update package.json
    sed -i 's/"jack": "x5-claude-cli-v2.js"/"jack": "x5-claude-cli.js"/' package.json
    
    # Reinstall globally
    npm unlink -g jack 2>/dev/null
    npm link
    
    echo "✓ Switched to v1.3.0 (Simple UI)"
    echo ""
    echo "Test it:"
    echo "  jack"
    
elif [ "$version" == "2" ]; then
    echo ""
    echo "Switching to v2.0.0..."
    
    # Install dependencies if needed
    npm install
    
    # Update package.json
    sed -i 's/"jack": "x5-claude-cli.js"/"jack": "x5-claude-cli-v2.js"/' package.json
    
    # Reinstall globally
    npm unlink -g jack 2>/dev/null
    npm link
    
    echo "✓ Switched to v2.0.0 (Advanced UI)"
    echo ""
    echo "Test it:"
    echo "  jack"
    echo ""
    echo "New features:"
    echo "  - Horizontal layout (logo + info side by side)"
    echo "  - Autocomplete menu (type / to see commands)"
    echo "  - Arrow key navigation"
    echo "  - Bordered input field"
    
else
    echo "❌ Invalid selection"
    exit 1
fi
