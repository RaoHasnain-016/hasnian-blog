# Hasnain Blog — CSC337 Lab Assignment 1

> Full-Stack AI Blog | Node.js · Express · MongoDB · MVC  
> COMSATS University Islamabad, Vehari Campus | Spring 2026  
> Instructor: Yasmeen Jana

---

## 🚀 Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# 3. Make sure MongoDB is running locally
mongod

# 4. Start development server
npm run dev

# 5. Open browser
http://localhost:3000
```

---

## ☁️ Deploy to Vercel (Step by Step)

### Step 1 — MongoDB Atlas (Free Cloud Database)
1. Go to **mongodb.com/atlas** → Sign Up (free)
2. Create a **free M0 cluster**
3. **Database Access** → Add user (username + password)
4. **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. **Connect** → Drivers → Copy connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hasnain_blog
   ```

### Step 2 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Hasnain Blog"

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/hasnain-blog.git
git branch -M main
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to **vercel.com** → Sign Up with GitHub
2. Click **"Add New Project"** → Select your repo
3. Framework Preset: **Other**
4. Root Directory: **`./`** (default)
5. Set these **Environment Variables**:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/hasnain_blog` |
   | `SESSION_SECRET` | `any_long_random_string` |
   | `NODE_ENV` | `production` |

6. Click **Deploy** → Done! 🎉

Your live URL: `https://hasnain-blog.vercel.app`

---

## 📁 Project Structure (MVC)

```
hasnain-blog/
├── app.js                     ← Express server + MongoDB + session
├── vercel.json                ← Vercel deployment config
├── package.json
├── .env.example               ← Environment variable template
│
├── models/
│   ├── User.js                ← Mongoose schema + bcrypt
│   └── Post.js                ← Post schema + .populate()
│
├── controllers/
│   ├── authController.js      ← Register / Login / Logout
│   ├── blogController.js      ← Landing page + Blog listing + Post detail
│   └── dashboardController.js ← CRUD (Create/Read/Update/Delete)
│
├── routes/
│   ├── authRoutes.js          ← / /register /login /logout
│   ├── blogRoutes.js          ← /blog /blog/:id
│   └── dashboardRoutes.js     ← /dashboard/* (protected)
│
├── middleware/
│   ├── requestLogger.js       ← Logs every request with timestamp
│   ├── authMiddleware.js      ← requireAuth / redirectIfAuth
│   └── imageValidator.js      ← MIME type + 5MB size validation
│
├── views/                     ← EJS templates
│   ├── partials/  header.ejs  footer.ejs
│   ├── auth/      register.ejs  login.ejs
│   ├── blog/      landing.ejs  index.ejs  show.ejs
│   ├── dashboard/ index.ejs  create.ejs  edit.ejs  profile.ejs  sidebar.ejs
│   ├── 404.ejs  error.ejs
│
├── public/
│   ├── css/style.css          ← Clean professional design
│   └── uploads/               ← Post images (auto-created)
│
└── logs/                      ← requests.log (auto-created)
```

---

## ✅ Assignment Checklist

- [x] Node.js + Express + MongoDB + MVC architecture
- [x] User registration + bcrypt password hashing (10 rounds)
- [x] Login / Logout + Express Sessions (stored in MongoDB)
- [x] CRUD for blog posts (Create, Read, Update, Delete)
- [x] Image upload with express-fileupload
- [x] WYSIWYG editor (TinyMCE 6 via CDN)
- [x] Request Logger middleware (timestamp + route + user)
- [x] Auth Guard middleware (requireAuth)
- [x] Image Validator middleware (MIME + size)
- [x] User schema with timestamps + bcrypt pre-save hook
- [x] Post schema with ObjectId reference → User
- [x] `.populate('author', 'username bio')` throughout
- [x] express-validator on all form inputs
- [x] Validation errors displayed inline
- [x] Landing page with real posts from MongoDB
- [x] Vercel deployment integration (vercel.json)
- [x] MongoDB Atlas support via environment variable
