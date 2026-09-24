# Winston Logger Setup

## Overview

Your backend uses **Winston Logger** for error tracking and logging. It's:
- ✅ Completely free (no trial, no credit card)
- ✅ Self-hosted (logs stay on your server)
- ✅ Automatic log rotation
- ✅ Sensitive data sanitization
- ✅ Production-ready

---

## How It Works

### Log Files

Two main log files in `logs/` directory:

```
logs/
├── error.log        # Errors only (level: error)
├── combined.log     # All levels (info, warn, error, debug)
└── (auto-rotated when reaching 5MB)
```

### Log Levels

```
error  → Critical failures (HTTP 500+)
warn   → Issues that may need attention (HTTP 400+, slow requests)
info   → Normal API operations (successful requests)
debug  → Detailed debugging info (database queries, etc.)
```

### Environment

```
Development:
- Logs appear in console (colored, readable)
- Logs also written to files
- Full debugging information

Production:
- Logs only written to files
- No console output
- JSON format for parsing
```

---

## Development - Viewing Logs

### In Terminal (Live)

```bash
# Start backend
pnpm dev

# Logs appear in terminal immediately:
# 2026-09-24 18:45:30 [GET] /api/v1/users/me - 200 (45ms)
# 2026-09-24 18:45:31 [error] Request failed: POST /api/v1/uploads
```

### View Log Files

```bash
# Watch error logs in real-time
tail -f logs/error.log

# View last 100 lines of combined logs
tail -100 logs/combined.log

# Search for specific errors
grep "TypeError" logs/error.log

# Count errors by type
grep "error" logs/combined.log | wc -l
```

---

## Production - Accessing Logs

### On Your Server (Render/Railway)

```bash
# SSH into server
ssh your-server

# View recent errors
tail logs/error.log

# Stream log file (live follow)
tail -f logs/combined.log

# Download logs locally
scp your-server:~/logs/error.log ./logs-backup/
```

### Log Rotation

Logs automatically rotate when reaching 5MB:

```
logs/
├── error.log          (current, <5MB)
├── error.log.1        (older, ~5MB)
├── error.log.2        (older, ~5MB)
├── error.log.3        (older, ~5MB)
├── error.log.4        (older, ~5MB)
├── error.log.5        (oldest, ~5MB)
└── (older logs deleted)
```

---

## Log Format

### Console Output (Development)

```
2026-09-24 18:45:30 [info] GET /api/v1/users/me - 200 (45ms)
2026-09-24 18:45:31 [error] Request failed: POST /api/v1/uploads
2026-09-24 18:45:32 [warn] Slow request detected: GET /api/v1/search - took 1250ms
```

### File Output (JSON)

```json
{
  "timestamp": "2026-09-24 18:45:30",
  "level": "error",
  "message": "Request failed: POST /api/v1/uploads",
  "service": "rbxfolio-api",
  "statusCode": 500,
  "duration_ms": 125,
  "url": "/api/v1/uploads",
  "method": "POST",
  "error": {
    "message": "ENOENT: no such file or directory",
    "stack": "Error: ENOENT...",
    "name": "Error"
  }
}
```

---

## What Gets Logged

### Automatic (Every Request)

✅ **All HTTP requests:**
- Method (GET, POST, etc.)
- URL
- Status code
- Response time
- IP address

✅ **Errors:**
- Error message
- Stack trace
- Request context
- HTTP status code

✅ **Slow requests:**
- When response time > 1000ms
- Flagged as warning

✅ **Sensitive data redaction:**
- Passwords: `[REDACTED]`
- Tokens: `[REDACTED]`
- API keys: `[REDACTED]`
- Credit cards: `[REDACTED]`

### Manual (When Needed)

```typescript
import { LoggerService } from './logger.service';

export class MyService {
  constructor(private logger: LoggerService) {}

  doSomething() {
    // Log info
    this.logger.info('Processing started', { userId: 123 });

    try {
      // ... do work
      this.logger.info('Processing completed', { result: 'success' });
    } catch (error) {
      // Log error
      this.logger.error('Processing failed', error, { userId: 123 });
    }
  }
}
```

---

## Configuration

### Log Level

Control verbosity in `.env`:

```bash
# Development (default: info)
LOG_LEVEL=debug    # Very verbose
LOG_LEVEL=info     # Normal
LOG_LEVEL=warn     # Only warnings & errors
LOG_LEVEL=error    # Only errors

# Production (recommended)
LOG_LEVEL=warn     # Catches issues without noise
```

### Log Directory

By default: `logs/` in project root

To change, modify `LoggerService`:
```typescript
const logsDir = join(process.cwd(), "logs");  // ← Change this path
```

---

## Monitoring Logs

### Find Errors

```bash
# Count total errors
grep -c '"level":"error"' logs/combined.log

# Find errors in last hour
grep "2026-09-24 1[8-9]" logs/error.log

# Find specific error type
grep "TypeError" logs/error.log

# Find errors from specific endpoint
grep "/api/v1/uploads" logs/error.log
```

### Performance Monitoring

```bash
# Find slow requests (>1000ms)
grep "duration_ms" logs/combined.log | grep -E "[1-9][0-9]{3,}"

# Average response time
grep "duration_ms" logs/combined.log | awk -F'"' '{print $8}' | awk '{sum+=$1; count++} END {print "Average: " sum/count "ms"}'
```

### Error Patterns

```bash
# Count errors by type
grep -o '"message":"[^"]*' logs/error.log | sort | uniq -c | sort -rn

# Most common error endpoints
grep '"url"' logs/error.log | sort | uniq -c | sort -rn | head -10
```

---

## Archiving Old Logs

For production, regularly archive old logs:

```bash
# Compress logs older than 7 days
find logs/ -name "*.log*" -mtime +7 -exec gzip {} \;

# Move to archive directory
mv logs/*.log.*.gz archive/

# Keep archive for 30 days
find archive/ -name "*.gz" -mtime +30 -delete
```

---

## Parsing Logs Programmatically

### Reading JSON Logs

```javascript
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('logs/combined.log'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const log = JSON.parse(line);
    if (log.level === 'error') {
      console.log(`[${log.timestamp}] ${log.message}`);
    }
  } catch (e) {
    // Skip malformed lines
  }
});
```

---

## Cost & Limits

| Aspect | Limit | Cost |
|--------|-------|------|
| Log storage | Unlimited (disk space) | $0 |
| Log retention | Configurable | $0 |
| Log rotation | Auto (5MB files) | $0 |
| API calls | Unlimited | $0 |
| **Total** | **Unlimited** | **$0** |

---

## Troubleshooting

### Logs Not Appearing

**Check 1:** Is logs directory created?
```bash
ls -la logs/
```

**Check 2:** Check file permissions
```bash
chmod 755 logs/
```

**Check 3:** Check LOG_LEVEL
```bash
# In .env
LOG_LEVEL=info
```

### Log Files Growing Too Large

**Solution:** Decrease log rotation size
```typescript
// In LoggerService, change maxsize:
maxsize: 1048576,  // 1MB instead of 5MB
```

### Old Logs Piling Up

**Solution:** Archive or delete
```bash
# Delete logs older than 30 days
find logs/ -name "*.log*" -mtime +30 -delete

# Or compress and archive
gzip logs/*.log.* 
```

---

## Next Steps

1. ✅ Winston logger is configured
2. ✅ Logs auto-created in `logs/` directory
3. ✅ Watch logs while developing: `tail -f logs/combined.log`
4. ✅ Check for errors in production: SSH and `tail logs/error.log`

---

## Files

- `src/common/logger.service.ts` - Winston configuration
- `src/common/logging.interceptor.ts` - HTTP logging
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

---

**Status:** ✅ Production-ready  
**Cost:** $0/month  
**Setup:** Already configured!
