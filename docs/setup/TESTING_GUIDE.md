# RbxFolio MVP Phase 2 - Complete Testing Guide

## 🚀 Quick Start Testing

### 1. Start Dev Servers

```bash
# Terminal 1: Start all dev servers (frontend + backend + design system)
cd /home/saad/Documents/Personal/Projects/RbxFolio
pnpm dev
```

Wait for both to be ready:
- ✅ Frontend: "Ready in X.Xs" on `http://localhost:3000`
- ✅ Backend: "[Nest] ... Application listening" on `http://localhost:3001/api/v1`

---

## 📋 Core Functionality Tests

### Test 1: Authentication

**Email/Password Registration & Login**

1. Go to `http://localhost:3000/register`
2. Fill in:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
   - Confirm: `TestPassword123!`
3. Click "Sign up"
4. ✅ Expected: Redirected to dashboard
5. ✅ Check browser console for no errors

**Session Persistence**

1. Refresh page (Cmd+R or F5)
2. ✅ Expected: Still logged in (session preserved)
3. Go to `http://localhost:3000/dashboard`
4. ✅ Expected: Can access protected route

**Logout**

1. Click profile/settings menu (top right)
2. Click "Logout" or "Sign out"
3. ✅ Expected: Redirected to login page
4. Try accessing `/dashboard`
5. ✅ Expected: Redirected to login (session cleared)

---

### Test 2: User Profile Management

**Edit Profile**

1. Log in with test account
2. Go to `http://localhost:3000/dashboard/profile`
3. Fill in fields:
   - Display Name: `John Developer`
   - Bio: `Building awesome projects`
   - Primary Role: `Builder`
   - Availability: `Open`
   - Experience Level: `Intermediate`
4. Click "Save Profile"
5. ✅ Expected: Success message, data saved
6. Refresh page
7. ✅ Expected: Data persists

**Profile Picture Upload** (Optional - if configured)

1. Click "Upload Picture" on profile page
2. Select an image from your computer
3. ✅ Expected: Upload succeeds, shows preview
4. ✅ Expected: Image persists after refresh

---

### Test 3: Project Management

**Create Project**

1. Go to `http://localhost:3000/dashboard/projects/new`
2. Fill in:
   - Title: `My First Project`
   - Slug: `my-first-project`
   - Short Description: `A test project`
   - Detailed Description: `This is a longer description...`
   - Status: `In Progress`
   - Visibility: `Public`
3. Click "Create Project"
4. ✅ Expected: Redirected to project details page
5. ✅ Expected: Project appears in dashboard/projects list

**View Projects List**

1. Go to `http://localhost:3000/dashboard/projects`
2. ✅ Expected: See the project you created
3. ✅ Expected: Shows title, short description

**View Single Project**

1. Click on project from list
2. ✅ Expected: Shows full project details
3. ✅ Expected: Shows creation date, slug, status

**Edit Project**

1. On project page, click "Edit"
2. Change title to `My Updated Project`
3. Click "Save"
4. ✅ Expected: Title updates
5. ✅ Expected: Change persists on refresh

**Delete Project**

1. On project page, click "Delete" (or trash icon)
2. Confirm deletion
3. ✅ Expected: Redirected to projects list
4. ✅ Expected: Project no longer in list

---

### Test 4: Media/File Upload

**Upload Project Image**

1. Create or edit a project
2. Look for "Add Image" or "Upload Media" button
3. Select an image file
4. ✅ Expected: Uploads successfully (see progress or confirmation)
5. ✅ Expected: Image displays in project
6. ✅ Expected: Image URL works (can download)

**Image Persistence**

1. Refresh the page
2. ✅ Expected: Image still there
3. Go back to project and return
4. ✅ Expected: Image still loads

---

### Test 5: Contact Requests

**Send Contact Request** (from another user perspective)

1. Log out
2. Go to `http://localhost:3000/u/testuser` (your profile)
3. Look for "Contact" or "Send Message" button
4. Fill in:
   - Your Name: `Visitor Name`
   - Email: `visitor@example.com`
   - Message: `Hi, I'd like to collaborate!`
5. Click "Send"
6. ✅ Expected: Confirmation message
7. ✅ Expected: No errors in console

**Receive Contact Requests**

1. Log in as original user
2. Go to `http://localhost:3000/dashboard/contact-requests`
3. ✅ Expected: See the contact request you sent
4. ✅ Expected: Shows visitor name, email, message
5. ✅ Expected: Shows creation date

**Respond to Contact Request**

1. Click on the contact request
2. Fill in response (if applicable)
3. Mark as "Responded" or click reply
4. ✅ Expected: Status changes
5. ✅ Expected: Timestamp updates

---

### Test 6: Search Functionality

**Search Users**

1. Go to `http://localhost:3000/search`
2. Type in search box: `test`
3. Click search or press Enter
4. ✅ Expected: Results appear (if any users match)
5. ✅ Expected: Shows user avatars, names, descriptions

**Search Projects**

1. Still on search page (or search tab)
2. Try searching project title: `My First Project`
3. ✅ Expected: Project appears in results
4. ✅ Expected: Shows project title and description

**Browse Public Projects**

1. Go to `http://localhost:3000/browse`
2. ✅ Expected: See list/grid of public projects
3. ✅ Expected: Can filter or sort if available
4. Click on a project
5. ✅ Expected: Shows project details

---

### Test 7: Email Functionality (Optional)

**Test Email Sending** (if RESEND_API_KEY configured)

Add your actual Resend API key to `.env`:

```bash
RESEND_API_KEY=re_your_actual_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

Then test:

1. Register a new account
2. ✅ Expected: Verification email sent (check spam folder)
3. Send contact request
4. ✅ Expected: Developer receives notification email
5. Respond to contact
6. ✅ Expected: Visitor receives response notification

---

### Test 8: UI/UX Responsiveness

**Desktop View**

1. Open DevTools (F12 or Cmd+Option+I)
2. View on standard desktop size
3. ✅ Expected: Layout looks good
4. ✅ Expected: Buttons clickable
5. ✅ Expected: Text readable

**Mobile View**

1. In DevTools, click device toggle (⌨️ icon)
2. Select iPhone or Android
3. ✅ Expected: Layout adapts
4. ✅ Expected: Navigation works on mobile
5. ✅ Expected: Forms readable and usable
6. ✅ Expected: Images responsive

**Tablet View**

1. Select iPad or Tablet in device menu
2. ✅ Expected: Layout adapts appropriately
3. ✅ Expected: Navigation still usable

---

### Test 9: Error Handling

**Invalid Form Submission**

1. Go to `/register`
2. Leave email empty, click sign up
3. ✅ Expected: Validation error message
4. Enter invalid email format
5. ✅ Expected: Error shown
6. Enter weak password
7. ✅ Expected: Password strength error

**Broken/Missing Data**

1. Try accessing non-existent project: `/u/testuser/projects/nonexistent`
2. ✅ Expected: 404 or "Not Found" message (not blank page)

**Network Error Simulation** (Advanced)

1. Open DevTools > Network tab
2. In throttling, select "Offline"
3. Try loading a page
4. ✅ Expected: Graceful error message (not blank)
5. Go back online
6. Refresh
7. ✅ Expected: Page loads normally

---

### Test 10: Performance & Logging

**Check Browser Console**

1. Open DevTools (F12)
2. Go to Console tab
3. ✅ Expected: No red error messages
4. ⚠️ Warnings are ok, but note them

**Check Network Requests**

1. DevTools > Network tab
2. Reload page
3. ✅ Expected: All API calls return 200/201 (success)
4. ✅ Expected: No 404, 500 errors
5. ✅ Expected: Images load (200 status)

**Check Backend Logs**

1. Look at terminal where `pnpm dev` is running
2. ✅ Expected: See request logs (GET, POST, etc.)
3. ✅ Expected: No red ERROR messages
4. ⚠️ Yellow WARN messages are informational

---

## 🔧 Specific Feature Tests

### API Health Check

```bash
# Test backend is responding
curl -i http://localhost:3001/api/v1/health

# Expected: 200 OK
```

### Database Connection

1. Create a project
2. Go to dashboard/projects
3. ✅ Expected: Project appears instantly (DB working)
4. Refresh page
5. ✅ Expected: Project still there (DB persisted)

### File Storage (Vercel Blob)

1. Upload an image to a project
2. Inspect the image URL
3. ✅ Expected: URL works and image displays
4. ✅ Expected: Image persists across sessions

### Winston Logging

1. Check terminal logs during activity
2. ✅ Expected: Requests logged with method, path, status code
3. ✅ Expected: No TypeErrors or unhandled exceptions
4. Optional: Check `logs/combined.log` file for persistent logs

---

## 📊 Test Coverage Checklist

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ⬜ | Test above |
| User Login | ⬜ | Test above |
| User Logout | ⬜ | Test above |
| Profile Edit | ⬜ | Test above |
| Create Project | ⬜ | Test above |
| Edit Project | ⬜ | Test above |
| Delete Project | ⬜ | Test above |
| Upload Images | ⬜ | Test above |
| Search Users | ⬜ | Test above |
| Search Projects | ⬜ | Test above |
| Browse Projects | ⬜ | Test above |
| Send Contact Request | ⬜ | Test above |
| Receive Contact Request | ⬜ | Test above |
| Respond to Contact | ⬜ | Test above |
| Mobile Responsive | ⬜ | Test above |
| Error Handling | ⬜ | Test above |

---

## 🐛 If You Find Issues

### Issue: "Cannot POST /api/v1/..."

**Cause:** Backend not running or URL incorrect  
**Fix:** 
- Check terminal: Is "listening" message visible?
- Verify port: Should be 3001
- Restart: `pnpm dev`

### Issue: "Connection refused"

**Cause:** Dev server not started  
**Fix:**
```bash
cd /home/saad/Documents/Personal/Projects/RbxFolio
pnpm dev
# Wait for "Ready in X.Xs" for frontend
# Wait for "[Nest]" logs for backend
```

### Issue: Images not loading

**Cause:** File storage not configured  
**Fix:** 
- Check `.env` for BLOB_STORE_ID and BLOB_READ_WRITE_TOKEN
- If empty, images will upload to `./uploads` locally
- Make sure `./uploads` directory exists

### Issue: Email not sending

**Cause:** RESEND_API_KEY not configured  
**Fix:**
```bash
# In .env, add:
RESEND_API_KEY=re_your_actual_key_here
RESEND_FROM_EMAIL=your-verified-email@example.com

# Restart dev server
```

### Issue: TypeScript errors in IDE

**Cause:** Need to rebuild packages  
**Fix:**
```bash
pnpm build
```

---

## 🚀 Ready for Testing!

You now have everything set up to test the entire RbxFolio MVP Phase 2. Start with Test 1-6 for core functionality, then go through the rest systematically.

**Total estimated testing time:** 30-60 minutes for full coverage

**Next steps after testing:**
1. Fix any bugs you find
2. When satisfied, push to GitHub
3. Deploy to production (Vercel + Render/Railway)
4. Test production URLs
5. Share with users for beta testing

Good luck! 🎉
