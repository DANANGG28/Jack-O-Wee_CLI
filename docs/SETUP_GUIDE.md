# X5 Labs Claude CLI - Setup Guide

Ini adalah custom CLI system yang **persis seperti Claude Code**, tapi menggunakan **X5 Labs API** — **TANPA 5-hour time limit!**

## ✨ Features

X5 Labs Claude CLI (No Time Limit)

✅ Interactive prompt session (seperti Claude Code CLI)  
✅ Conversation memory (konteks terus tersimpan)  
✅ Token tracking (lihat berapa token yang sudah pakai)  
✅ No time limit (pakai 24 jam kalau mau!)  
✅ Flexible pricing (Rp 45k-150k sesuai kebutuhan)  
✅ Commands support (/clear, /tokens, /exit)  

## 🚀 Setup

### 1. Prerequisites
- Node.js 18+ (download dari https://nodejs.org)
- X5 Labs API key (dari https://x5lab.dev)

### 2. Installation

```bash
# Clone atau download folder ini
cd x5-claude-cli

# Install dependencies
npm install

# Atau jika pakai yarn/pnpm
yarn install
# atau
pnpm install
```

### 3. Configure API Key

```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dengan API key kamu
nano .env
# atau buka dengan editor
# X5_API_KEY=your_actual_api_key_here
```

Cari API key:
1. Login ke https://x5lab.dev
2. Pergi ke Settings atau API Keys
3. Copy API key kamu
4. Paste ke `.env` file

### 4. Run!

```bash
npm start
# atau
node x5-claude-cli.js
```

## 💬 Usage

### Basic Usage

```
You: Buatkan function untuk validasi email di JavaScript
Claude: [AI response dengan code]

You: Refactor code itu supaya lebih efficient
Claude: [Improved version]

You: /tokens
[Shows token usage]

You: /exit
```

### Available Commands

| Command | Purpose |
|---------|---------|
| `/clear` | Clear conversation history (reset session) |
| `/tokens` | Show total tokens used in this session |
| `/exit` | Exit the program |
| `Ctrl+C` | Force exit |

## 💰 Pricing

Pakai X5 Labs gateway:
- **Rp 45,000** = 5M tokens (~normal usage seminggu)
- **Rp 150,000** = 50M tokens (~heavy usage/burst)

Dengan harga ini, kamu bisa:
- Prompt setiap hari tanpa khawatir time limit
- Pakai 24/7 selama token ada
- Restart session tanpa kehilangan token allocation

## 🔄 Conversation Memory

Session ini automatically save conversation history. Jadi:

```
Session 1 (Start):
- You: Buatkan function X
- Claude: [Response]

Session 2 (Lanjut):
- You: Improve function tadi
- Claude: [Punya konteks dari session sebelumnya]
```

Untuk reset: pakai command `/clear`

## 🛠️ Customization

### Ganti Model

Edit `x5-claude-cli.js`, cari bagian:

```javascript
model: 'claude-opus-4-20250514',  // Ganti ke model lain
```

Opsi:
- `claude-opus-4-20250514` (most powerful, default)
- `claude-sonnet-4.6-20250514` (balanced)
- `claude-haiku-4.5-20250514` (fastest, cheapest)

### Adjust Max Tokens

```javascript
max_tokens: 4096,  // Ganti nilai ini
```

Default 4096 sudah bagus. Lebih tinggi = lebih panjang response tapi pakai lebih banyak token.

### Custom System Prompt

Edit bagian `system:` untuk customize behavior Claude:

```javascript
system: `You are Claude, an AI assistant specialized in [YOUR_DOMAIN]. 
         Help user dengan [SPECIFIC_TASKS]. Remember [IMPORTANT_CONTEXT].`,
```

## 📊 Token Tracking

CLI ini automatically track token usage:

```
[Tokens: input=245, output=512, session=1250]
```

Artinya:
- `input`: Token dari prompt kamu (245)
- `output`: Token dari response Claude (512)
- `session`: Total token used sampai sekarang di session ini (1250)

Kalau sudah 5M tokens pakai, beli top-up X5 Labs baru.

## ❓ Troubleshooting

### "Invalid API key" Error

```
Solusi:
1. Check .env file sudah di root folder
2. Pastikan API key sudah benar (copy-paste lagi)
3. Pastikan ga ada space di awal/akhir API key
```

### "Cannot find module" Error

```bash
Solusi:
npm install
# Pastikan semua dependencies sudah installed
```

### Slow Response

```
Mungkin:
1. Internet connection lambat
2. X5 Labs server sedang ramai
3. Coba request lebih kecil dulu

Debug:
node x5-claude-cli.js --verbose
```

## 📈 Tips & Tricks

### 1. Use untuk Project Development
```
You: Analyze folder structure untuk project React
You: Suggest refactoring untuk component X
You: Write unit test untuk function Y
```

### 2. Save Conversation
Conversation history tersimpan selama session berjalan. Untuk save permanent:
```bash
# Redirect output ke file
node x5-claude-cli.js | tee session.log
```

### 3. Batch Prompting
Kalau ada banyak task:
```
You: Task 1: [explain code]
Claude: [response]

You: Task 2: [improve code]
Claude: [response]

...continue...
```

### 4. Long Sessions
Pakai di background kalau perlu:
```bash
nohup node x5-claude-cli.js &
# atau pakai tmux/screen untuk persistent terminal
```

## 🎯 Comparison: Claude Code vs This CLI

| Feature | Claude Code | X5 Labs CLI |
|---------|-------------|------------|
| Interactive prompt | ✅ | ✅ |
| Time limit | ❌ 5-hour window | ✅ NONE |
| Pricing | Subscription | Pay per token |
| Context memory | ✅ | ✅ |
| Rate limits | Complex | Simple |
| 24/7 usage | ❌ Limited | ✅ Full |
| Setup complexity | Simple | Medium |
| Cost flexibility | Rigid | Flexible |

## 💡 Best Use Cases

✅ **Perfect untuk:**
- Project coding dengan long sessions
- Testing berbagai approach tanpa time pressure
- Tugas kuliah dengan research phase panjang
- Lagi rame order (burst usage)
- Continuous improvement loop

❌ **Not ideal untuk:**
- Quick one-off prompts (overkill)
- GUI preference (command line only)
- Multiple users

## 🔗 Links

- X5 Labs: https://x5lab.dev
- Claude Documentation: https://docs.claude.com
- Node.js: https://nodejs.org
- Axios: https://axios-http.com

## 📝 License

MIT

---

**Questions?** Check X5 Labs documentation atau Claude API docs.

Happy coding! 🚀
