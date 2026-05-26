# Changelog

## [1.3.0] - 2024-05-25

### ✨ Added
- **New UI Design** - Modern, clean interface inspired by Antigravity CLI
  - Persistent header with logo, version, model, and directory
  - Simple `>` prompt instead of "You:"
  - Clean response display without "Jack | Model:" prefix
  - "Thinking" loading indicator
  - Dynamic status (Thinking/Ready/Fast) based on model
  - `?` shortcut for help
  - Better visual separators
  - Responses scroll up, input always at bottom

### 🔧 Changed
- Redesigned welcome screen with header layout
- Updated prompt from "You:" to ">"
- Removed "Jack | Model:" prefix from responses
- Changed loading animation to "Thinking ⠴"
- Model switching now refreshes header
- Clear command now refreshes header
- Better token display format: `[↓ input | ↑ output | ∑ total]`

### 📚 Documentation
- Added `NEW_UI.md` - Complete UI design documentation

---

## [1.2.3] - 2024-05-25

### 🐛 Fixed
- **Missing question function** - Added back `question` helper function
  - Fixed "question is not defined" error
  - CLI now properly accepts user input
  - Restored async/await input handling

---

## [1.2.2] - 2024-05-25

### 🐛 Fixed
- **.env Loading Issue** - Fixed .env file not found when running from different folders
  - Now loads .env from installation directory instead of current directory
  - Works correctly when called from any folder
  - Centralized configuration for all projects
  - Updated both basic and advanced versions

---

## [1.2.1] - 2024-05-25

### 🐛 Fixed
- **Syntax Error** - Removed duplicate `getModelDisplayName` function declaration
  - Fixed "Identifier 'getModelDisplayName' has already been declared" error
  - CLI now works properly when called from any folder

---

## [1.2.0] - 2024-05-25

### ✨ Added
- **Global Installation** - Install Jack CLI globally untuk dipakai dari folder manapun
  - Command `jack` bisa dipanggil dari any directory
  - Automated installer script (`install.sh`)
  - Automated uninstaller script (`uninstall.sh`)
  - Works in context of current working directory
  - Centralized configuration (.env di installation folder)
  
- **Installation Scripts**
  - `install.sh` - One-command installation
  - `uninstall.sh` - Easy uninstallation
  - Windows-specific guide (`install-windows.md`)

### 🔧 Changed
- Updated `package.json` bin command from `x5-claude` to `jack`
- Updated README with global installation instructions

### 📚 Documentation
- Added `GLOBAL_INSTALL.md` - Complete global installation guide
- Added `QUICK_START.md` - Quick start guide
- Added `install-windows.md` - Windows installation guide
- Added `INSTALLATION_SUMMARY.md` - Installation summary

---

## [1.1.0] - 2024-05-25

### ✨ Added
- **Model Switching Feature** - Ganti model AI secara dinamis tanpa restart
  - Command `/model` untuk lihat model saat ini
  - Command `/model <name>` untuk switch model
  - Support 6 aliases: opus, opus-4.7, sonnet, sonnet-4.5, haiku, haiku-4.5
  - Error handling untuk invalid model names
  - Model info ditampilkan di `/tokens` command

- **Dynamic Label Feature** - Bot name berubah sesuai model
  - `Jack | Opus` untuk claude-opus-4.7
  - `Jack | Sonnet` untuk claude-sonnet-4.5
  - `Jack | Haiku` untuk claude-haiku-4.5
  - Visual clarity untuk tahu model mana yang sedang respond

- **Auto-Retry Logic** - Automatic retry untuk handle temporary errors
  - Retry up to 2 times on network/timeout errors
  - Exponential backoff (1s, 2s)
  - Smart error detection (no retry on auth errors)
  - Better error messages dengan helpful tips

### 🔧 Changed
- Updated model names sesuai X5 Labs official settings:
  - Opus: `claude-opus-4.7` (was: claude-opus-4-20250514)
  - Sonnet: `claude-sonnet-4.5` (was: claude-sonnet-4.6-20250514)
  - Haiku: `claude-haiku-4.5` (was: claude-haiku-4.5-20250514)
- Default model changed to `claude-opus-4.7`
- Updated help text di welcome screen
- Updated `.env` file dengan model yang benar
- Improved error messages dengan context-aware tips

### 🐛 Fixed
- **Response Parsing Error** - Fixed "Cannot read properties of undefined"
  - X5 Labs uses OpenAI format, not Anthropic format
  - Added support for both response formats
  - Proper token tracking (prompt_tokens vs input_tokens)
- **Intermittent Errors** - First request sometimes fails
  - Added auto-retry with exponential backoff
  - Better handling of network/timeout issues
- Model names sekarang match dengan X5 Labs settings.json
- Conversation context preserved saat switch model
- Token tracking continues across model switches

### 📚 Documentation
- Added `MODEL_SWITCHING.md` - Comprehensive guide untuk fitur model switching
- Added `DEMO.md` - Demo dan verification checklist
- Added `FIXED.md` - Bug fix documentation
- Added `RETRY_LOGIC.md` - Auto-retry feature documentation
- Added `DYNAMIC_LABEL.md` - Dynamic label feature documentation
- Added `CHANGELOG.md` - Version history
- Added test scripts: `test-api.js`, `quick-test.js`, `test-dynamic-label.js`

---

## [1.0.0] - Initial Release

### Features
- Interactive CLI interface
- Conversation memory
- Token tracking
- Commands: /clear, /tokens, /exit
- Loading animation
- Error handling
- Two versions: basic dan advanced
- Advanced features: /save, /load, /code, session persistence

### Models
- Claude Opus (default)
- Claude Sonnet
- Claude Haiku

### Configuration
- Environment-based config (.env)
- X5 Labs API integration
- No time limits
