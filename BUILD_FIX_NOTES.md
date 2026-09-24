# Build Error Fix - Next.js Route Conflict

## Problem
```
[Error: Requested and resolved page mismatch: /dashboard/projects//[id/]/edit/page]
```

## Root Cause
There are **TWO** directories with similar names in `/apps/web/src/app/dashboard/projects/`:

1. `[id]` - Correct Next.js dynamic route segment
2. `\[id\]` - Wrong! Literal folder name with escaped brackets

Next.js interprets the escaped brackets as a literal folder name, creating a conflict.

## Solution
The `\[id\]` directory must be completely removed. It's a duplicate/incorrect directory.

### What to Delete
Delete this entire directory structure:
```
/home/saad/Documents/Personal/Projects/RbxFolio/apps/web/src/app/dashboard/projects/\[id\]/
```

This directory contains:
```
\[id\]/
└── edit/
    └── page.tsx
```

**Keep** this correct structure:
```
/home/saad/Documents/Personal/Projects/RbxFolio/apps/web/src/app/dashboard/projects/[id]/
```

### How It Should Look (After Fix)
```
/home/saad/Documents/Personal/Projects/RbxFolio/apps/web/src/app/dashboard/projects/
├── [id]/                    ← Dynamic route segment (KEEP)
│   ├── edit/
│   │   └── page.tsx
│   └── page.tsx
├── new/
│   └── page.tsx
└── page.tsx
```

NOT this (current):
```
/home/saad/Documents/Personal/Projects/RbxFolio/apps/web/src/app/dashboard/projects/
├── [id]/                    ← Correct dynamic route
│   └── page.tsx
├── \[id\]/                  ← WRONG! Delete this
│   └── edit/
│       └── page.tsx
├── new/
│   └── page.tsx
└── page.tsx
```

## Terminal Commands to Fix

Run this command to delete the problematic directory:

```bash
cd /home/saad/Documents/Personal/Projects/RbxFolio/apps/web/src/app/dashboard/projects

# Delete the incorrectly escaped directory
rm -rf '\[id\]'

# Verify it's gone
ls -d */

# Should now show:
# [id]   new
```

## Verification
After deleting `\[id\]`, the build should succeed:

```bash
cd /home/saad/Documents/Personal/Projects/RbxFolio
pnpm build
```

## Why This Happened
The `\[id\]` directory was likely created with escaped brackets in the shell, which created it as a literal folder name instead of a dynamic route segment. This is a common issue when using certain tools or shells that auto-escape special characters.

## Prevention
- Always use unescaped brackets for Next.js dynamic routes: `[id]` NOT `\[id\]`
- File explorers usually show both, but they're different and cause conflicts
- Verify directory names in Next.js match the expected format exactly
