# RbxFolio Testing Checklist - Quick Reference

## ⚡ Before You Start

- [ ] Run `pnpm dev` in project root
- [ ] Wait for frontend: "Ready in X.Xs"
- [ ] Wait for backend: "[Nest]" logs appear
- [ ] Open `http://localhost:3000` in browser
- [ ] Open DevTools (F12) - Console tab

---

## 🔐 Auth Tests

- [ ] Register new account (`/register`)
- [ ] Login works with saved account
- [ ] Session persists on page refresh
- [ ] Can access `/dashboard` when logged in
- [ ] Logout redirects to login page
- [ ] Cannot access `/dashboard` after logout

---

## 👤 Profile Tests

- [ ] Can edit profile (`/dashboard/profile`)
- [ ] Profile changes save
- [ ] Profile changes persist on refresh
- [ ] Can upload profile picture (optional)
- [ ] Profile picture shows after upload

---

## 📁 Project Tests

- [ ] Can create project (`/dashboard/projects/new`)
- [ ] New project appears in projects list (`/dashboard/projects`)
- [ ] Can view project details
- [ ] Can edit project
- [ ] Project edits save and persist
- [ ] Can delete project
- [ ] Deleted project removed from list

---

## 📸 Media Tests

- [ ] Can upload image to project
- [ ] Uploaded image displays
- [ ] Image still displays after page refresh
- [ ] Image still displays after logging out and back in
- [ ] Multiple images can be uploaded

---

## 🔍 Search Tests

- [ ] Can search projects (`/search`)
- [ ] Search results show matching projects
- [ ] Can click on search result
- [ ] Can browse public projects (`/browse`)
- [ ] Browse page loads without errors

---

## 💬 Contact Tests

- [ ] Can view own profile page (`/u/[username]`)
- [ ] "Contact" button visible on profile
- [ ] Can fill and submit contact form
- [ ] Can view contact requests (`/dashboard/contact-requests`)
- [ ] Received contact shows correct info
- [ ] Can respond to contact requests

---

## 📱 UI/Responsiveness Tests

- [ ] Desktop view (1920px) works correctly
- [ ] Tablet view (768px) responsive
- [ ] Mobile view (375px) responsive
- [ ] All buttons clickable on mobile
- [ ] Forms usable on mobile
- [ ] No horizontal scroll on mobile

---

## 🛠️ Technical Tests

- [ ] No red errors in browser console
- [ ] Network tab: API calls return 200/201
- [ ] Network tab: No 404 or 500 errors
- [ ] Backend logs show request activity
- [ ] No unhandled exceptions in terminal

---

## ✅ All Pass? You're Done!

If all checkboxes above are checked, your app is working! 🎉

Next: Commit changes and deploy to production.

---

## ⚠️ Found Issues?

Check `docs/setup/TESTING_GUIDE.md` for troubleshooting section.
