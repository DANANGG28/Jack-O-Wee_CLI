# 🔄 Auto-Retry Logic

## Problem

Kadang request pertama error tapi request kedua berhasil:
```
You: haloo
❌ Error:

You: apakah kamu bisa menjawab pesan ini
✓ Success!
```

## Root Causes

1. **Network Issues** - Temporary connection problems
2. **API Warmup** - Server butuh waktu untuk initialize
3. **Rate Limiting** - Request terlalu cepat
4. **Timeout** - Response terlalu lama

## Solution: Auto-Retry with Exponential Backoff

### Features

✅ **Automatic Retry** - Retry up to 2 times on failure  
✅ **Exponential Backoff** - Wait 1s, 2s before retry  
✅ **Smart Error Detection** - Only retry on network/timeout errors  
✅ **No Retry on Auth Errors** - Fail fast on invalid API key  
✅ **Better Error Messages** - User-friendly error descriptions  

### How It Works

```javascript
async function callX5LabsAPI(messages, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Make API call
      const response = await axios.post(...);
      return response; // Success!
      
    } catch (error) {
      // Don't retry on auth errors
      if (error.response?.status === 401) {
        throw error;
      }
      
      // Retry on network/timeout errors
      if (attempt < retries && isRetryableError(error)) {
        await sleep(1000 * (attempt + 1)); // Exponential backoff
        continue; // Try again
      }
      
      throw error; // Give up
    }
  }
}
```

### Retry Strategy

| Attempt | Wait Time | Total Time |
|---------|-----------|------------|
| 1st try | 0s | 0s |
| 2nd try | 1s | 1s |
| 3rd try | 2s | 3s |

### Retryable Errors

✅ **Will Retry:**
- `ECONNABORTED` - Connection aborted
- `ETIMEDOUT` - Request timeout
- `ECONNRESET` - Connection reset
- No response from server

❌ **Won't Retry:**
- `401 Unauthorized` - Invalid API key
- `400 Bad Request` - Invalid request format
- `429 Too Many Requests` - Rate limit (should wait longer)
- Other HTTP errors

## User Experience

### Before (No Retry)
```
You: hello
Jack | Opus: ⠴
❌ Error:

You: hello
Jack | Opus: ⠴
Hi! How can I help?
```

### After (With Retry)
```
You: hello
Jack | Opus: ⠴ [auto-retry happening in background]
Hi! How can I help?
[Tokens: input=1187, output=5, session=1192]
```

User tidak perlu tahu ada retry - it just works! ✨

## Error Messages

### Timeout Error
```
❌ Request timeout. Server mungkin sedang sibuk. Coba lagi.
```

### API Error
```
❌ API Error: {"error": "rate_limit_exceeded"}
```

### Generic Error with Tip
```
❌ Error: Network connection failed

💡 Tip: Coba lagi atau gunakan prompt yang lebih pendek.
```

## Configuration

Default: **2 retries** (3 total attempts)

Untuk mengubah:
```javascript
// In callX5LabsAPI function
const response = await callX5LabsAPI(messages, 3); // 3 retries = 4 attempts
```

## Testing

### Test Retry Logic

```bash
# Simulate network issues
node test-retry.js
```

### Expected Behavior

1. **First request fails** → Auto-retry after 1s
2. **Second request fails** → Auto-retry after 2s
3. **Third request succeeds** → Return response
4. **All fail** → Show error message

## Benefits

1. **Better UX** - Users don't see random errors
2. **Higher Success Rate** - Handles temporary issues
3. **Transparent** - Works in background
4. **Smart** - Doesn't retry on permanent errors
5. **Fast** - Exponential backoff prevents spam

## Monitoring

Track retry attempts (optional):
```javascript
if (attempt > 0) {
  console.log(chalk.yellow(`⟳ Retrying... (attempt ${attempt + 1})`));
}
```

## Production Tips

### 1. Adjust Timeout
```javascript
timeout: 60000 // 60 seconds (current)
timeout: 30000 // 30 seconds (faster fail)
```

### 2. Adjust Retries
```javascript
retries = 2  // Default (good for most cases)
retries = 1  // Faster fail (for quick responses)
retries = 3  // More resilient (for important requests)
```

### 3. Add Logging
```javascript
if (process.env.DEBUG) {
  console.log(`[Retry] Attempt ${attempt + 1} failed:`, error.message);
}
```

## Comparison

| Scenario | Without Retry | With Retry |
|----------|---------------|------------|
| Network glitch | ❌ Error | ✅ Success |
| API warmup | ❌ Error | ✅ Success |
| Temporary timeout | ❌ Error | ✅ Success |
| Invalid API key | ❌ Error | ❌ Error (fast) |
| Rate limit | ❌ Error | ❌ Error (after retries) |

## Summary

✅ **Implemented in:**
- `x5-claude-cli.js` - Basic version
- `x5-claude-cli-advanced.js` - Advanced version

✅ **Features:**
- Auto-retry up to 2 times
- Exponential backoff (1s, 2s)
- Smart error detection
- Better error messages
- Transparent to user

✅ **Result:**
- Higher success rate
- Better user experience
- More reliable CLI

🚀 **Now your CLI handles temporary errors gracefully!**
