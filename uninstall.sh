#!/bin/bash

# Jack CLI Global Uninstaller

echo "╔════════════════════════════════════════╗"
echo "║   Jack CLI - Uninstaller               ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if jack is installed
if ! command -v jack &> /dev/null; then
    echo "ℹ️  Jack CLI is not installed globally"
    exit 0
fi

echo "📍 Found Jack CLI at: $(which jack)"
echo ""

# Confirm uninstallation
read -p "Are you sure you want to uninstall Jack CLI? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Uninstallation cancelled"
    exit 0
fi

# Uninstall
echo "🗑️  Uninstalling Jack CLI..."
npm unlink -g jack

if [ $? -eq 0 ]; then
    echo "✅ Jack CLI uninstalled successfully!"
    echo ""
    echo "To reinstall, run:"
    echo "  ./install.sh"
else
    echo "❌ Failed to uninstall!"
    echo "   Try with sudo: sudo npm unlink -g jack"
fi
