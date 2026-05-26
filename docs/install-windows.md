# 🪟 Windows Installation Guide

## For WSL (Windows Subsystem for Linux)

### Installation

```bash
# 1. Open WSL terminal
wsl

# 2. Go to agentz folder
cd /var/www/html/agentz

# 3. Make installer executable
chmod +x install.sh

# 4. Run installer
./install.sh
```

### Usage

```bash
# Use from any folder in WSL
cd /var/www/html/my-project
jack
```

## For Windows (Native)

### Installation

```powershell
# 1. Open PowerShell as Administrator
# 2. Go to agentz folder
cd "\\wsl.localhost\Ubuntu\var\www\html\agentz"

# 3. Install globally
npm link

# 4. Verify
jack --version
```

### Usage

```powershell
# Use from any folder
cd C:\Users\YourName\Projects\my-project
jack
```

### Alternative: Create Batch File

Create `jack.bat` in a folder that's in your PATH (e.g., `C:\Windows\System32`):

```batch
@echo off
node "\\wsl.localhost\Ubuntu\var\www\html\agentz\x5-claude-cli.js" %*
```

Then you can use:
```powershell
cd C:\Projects\my-app
jack
```

## Troubleshooting

### WSL: "jack: command not found"

```bash
# Add to PATH
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Windows: "npm link" fails

```powershell
# Run PowerShell as Administrator
# Then try again
cd "\\wsl.localhost\Ubuntu\var\www\html\agentz"
npm link
```

### Cross-platform issues

If you need to use Jack from both WSL and Windows:

**Option 1: Use WSL for everything**
```powershell
# In Windows PowerShell
wsl jack
```

**Option 2: Install separately**
```bash
# In WSL
cd /var/www/html/agentz
npm link

# In Windows PowerShell (as Admin)
cd "\\wsl.localhost\Ubuntu\var\www\html\agentz"
npm link
```

## Recommended Setup

For best experience on Windows with WSL:

1. **Use WSL terminal** for development
2. **Install Jack in WSL** using `./install.sh`
3. **Access from Windows** using `wsl jack` if needed

```powershell
# Windows PowerShell
cd C:\Projects\my-app
wsl jack
```

This way you get:
- ✅ Native Linux performance
- ✅ Access from Windows
- ✅ Single installation
- ✅ Consistent behavior
