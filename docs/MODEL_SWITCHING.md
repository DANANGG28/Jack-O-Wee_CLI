# 🤖 Model Switching Feature

## Overview

Sekarang kamu bisa ganti model AI secara dinamis **tanpa restart program**! Fitur ini tersedia di kedua versi CLI (basic dan advanced).

## Usage

### Lihat Model Saat Ini

```bash
You: /model
```

Output:
```
🤖 Current model: claude-opus-4-20250514

Available models:
  opus, opus-4.7     - Most powerful (expensive)
  sonnet, sonnet-4.6 - Balanced (recommended)
  haiku, haiku-4.5   - Fastest (cheapest)

Usage: /model <name>
Example: /model sonnet
```

### Ganti Model

```bash
You: /model sonnet
```

Output:
```
✓ Switched to claude-sonnet-4.6-20250514
```

## Available Models

| Alias | Full Model Name | Use Case | Speed | Cost |
|-------|----------------|----------|-------|------|
| `opus` | claude-opus-4-20250514 | Complex reasoning, code generation | Slow | High |
| `opus-4.7` | claude-opus-4.7 | Latest Opus version | Slow | High |
| `sonnet` | claude-sonnet-4.6-20250514 | Balanced performance | Medium | Medium |
| `sonnet-4.6` | claude-sonnet-4.6-20250514 | Same as above | Medium | Medium |
| `haiku` | claude-haiku-4.5-20250514 | Quick tasks, simple queries | Fast | Low |
| `haiku-4.5` | claude-haiku-4.5-20250514 | Same as above | Fast | Low |

## When to Switch Models

### Use **Opus** when:
- Complex code refactoring
- Architecture design decisions
- Debugging difficult bugs
- Writing comprehensive documentation
- Need highest quality output

### Use **Sonnet** when:
- General coding tasks (recommended default)
- Code reviews
- Writing tests
- Moderate complexity features
- Balance between speed and quality

### Use **Haiku** when:
- Quick questions
- Simple code snippets
- Syntax checks
- Fast iterations
- Cost optimization

## Examples

### Example 1: Start with Sonnet, Switch to Opus for Complex Task

```bash
You: /model sonnet
✓ Switched to claude-sonnet-4.6-20250514

You: Explain how async/await works in JavaScript
Claude: [Quick explanation]

You: /model opus
✓ Switched to claude-opus-4-20250514

You: Refactor this entire codebase to use dependency injection pattern
Claude: [Detailed analysis and refactoring]
```

### Example 2: Use Haiku for Quick Checks

```bash
You: /model haiku
✓ Switched to claude-haiku-4.5-20250514

You: What's the syntax for array destructuring?
Claude: [Quick answer]

You: Is this regex correct: /^\d{3}-\d{3}-\d{4}$/
Claude: [Fast validation]
```

### Example 3: Cost Optimization Strategy

```bash
# Start session with Haiku for exploration
You: /model haiku
You: Show me examples of React hooks

# Switch to Sonnet for implementation
You: /model sonnet
You: Build a custom hook for form validation

# Switch to Opus for complex edge cases
You: /model opus
You: Handle nested form validation with async validation rules
```

## Token Usage Tracking

Token usage tetap tracked per session, regardless of model switches:

```bash
You: /tokens

📊 Token Usage:
  Session total: 15,234
  Messages: 12
  Avg per message: 1,269
  Current model: claude-sonnet-4.6-20250514
```

## Conversation Context

**Important:** Conversation history tetap tersimpan saat ganti model. Model baru akan punya akses ke semua context sebelumnya.

```bash
You: /model opus
You: Buatkan function untuk validasi email

Claude (Opus): [Creates function]

You: /model haiku
You: Apakah function tadi sudah handle edge cases?

Claude (Haiku): [Haiku bisa lihat function yang dibuat Opus]
```

## Default Model

Default model ditentukan dari `.env` file:

```env
CLAUDE_MODEL=claude-opus-4.7
```

Kalau tidak ada di `.env`, default ke `claude-opus-4-20250514`.

## Tips & Best Practices

### 💡 Cost Optimization
- Start dengan Haiku untuk explorasi
- Switch ke Sonnet untuk implementation
- Use Opus hanya untuk complex problems

### 💡 Speed Optimization
- Use Haiku untuk rapid prototyping
- Switch ke Opus saat butuh quality review

### 💡 Quality Optimization
- Use Opus untuk critical code
- Sonnet untuk day-to-day work
- Haiku untuk quick checks

### 💡 Workflow Example
```
Morning: /model haiku (planning & exploration)
  ↓
Afternoon: /model sonnet (implementation)
  ↓
Evening: /model opus (review & optimization)
```

## Error Handling

Kalau typo atau model tidak ada:

```bash
You: /model gpt4
❌ Unknown model: gpt4
Available: opus, opus-4.7, sonnet, sonnet-4.6, haiku, haiku-4.5
```

## Integration with Other Commands

Model switching works seamlessly dengan semua commands:

```bash
You: /model sonnet
You: /load app.js
You: Review this code

You: /model opus
You: Now suggest architectural improvements

You: /save refactored-app.js
You: /tokens
```

## Technical Details

- Model switch happens **immediately** pada request berikutnya
- No restart required
- No conversation loss
- Token tracking continues
- Session persistence maintained (advanced version)

## Pricing Impact

Switching models affects token costs:

| Model | Approx Cost per 1M tokens |
|-------|---------------------------|
| Opus | Highest |
| Sonnet | ~50% of Opus |
| Haiku | ~10% of Opus |

**Example Session:**
- 100 messages with Opus: ~Rp 50,000
- 100 messages with Sonnet: ~Rp 25,000
- 100 messages with Haiku: ~Rp 5,000

**Mixed Strategy:**
- 50 Haiku + 30 Sonnet + 20 Opus: ~Rp 20,000

## Troubleshooting

### Model switch tidak work?
```bash
# Check current model
You: /model

# Try exact alias
You: /model sonnet
```

### Response quality menurun?
```bash
# Switch to higher tier model
You: /model opus
```

### Response terlalu lambat?
```bash
# Switch to faster model
You: /model haiku
```

---

**Happy model switching! 🚀**

Optimize your workflow dengan memilih model yang tepat untuk setiap task.
