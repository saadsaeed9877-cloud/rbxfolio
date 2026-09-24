# 🚀 RbxFolio Quick Start Testing

Get testing in 5 minutes!

---

## Step 1: Start Dev Servers (1 minute)

```bash
cd /home/saad/Documents/Personal/Projects/RbxFolio
pnpm dev
```

**Wait for:**
```
@rbxfolio/web:dev: ✓ Ready in X.Xs
@rbxfolio/api:dev: [Nest] ... listening on port 3001
```

---

## Step 2: Open App (30 seconds)

```bash
# Frontend: http://localhost:3000
# Backend: http://localhost:3001/api/v1

# Open in browser:
http://localhost:3000
```

---

## Step 3: Quick 5-Minute Test Flow

### 1. Register (1 min)
- Click "Sign up"
- Email: `test@example.com`
- Password: `Test123!`
- Confirm: `Test123!`
- Click "Sign up"
- ✅ Should see dashboard

### 2. Create Project (1.5 min)
- Click "Create Project" or `/dashboard/projects/new`
- Title: `Test Project`
- Slug: `test-project`
- Description: `My test project`
- Click "Create"
- ✅ See project page

### 3. Upload Image (1 min)
- On project page, click "Add Image"
- Select any image file
- Upload
- ✅ Image displays

### 4. View Dashboard (0.5 min)
- Click "Dashboard" or go to `/dashboard`
- ✅ Project appears in list

### 5. Test Mobile (1 min)
- Press F12 (DevTools)
- Click device toggle icon
- Select iPhone
- ✅ Layout adapts

---

## 🎯 Expected Results

All should work without errors:
- ✅ Registration and login
- ✅ Project creation
- ✅ Image upload
- ✅ Dashboard display
- ✅ Mobile responsive
- ✅ No console errors

---

## 📖 Want More?

Full testing guide: `docs/setup/TESTING_GUIDE.md`
Detailed checklist: `TESTING_CHECKLIST.md`

---

## 🐛 Troubleshooting

**Backend not starting?**
```bash
# Check if port 3001 is in use
lsof -i :3001
# If used, kill the process
kill -9 <PID>
# Try again
pnpm dev
```

**Images not uploading?**
- Check `./uploads` directory exists
- Or configure Vercel Blob in `.env`

**Styles not loading?**
- Restart dev server: `Ctrl+C` then `pnpm dev`

---

## ✨ Ready?

```bash
pnpm dev
# Then open http://localhost:3000
```

Enjoy testing! 🎉
