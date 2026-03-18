const express        = require('express');
const mongoose       = require('mongoose');
const session        = require('express-session');
const MongoStore     = require('connect-mongo');
const fileUpload     = require('express-fileupload');
const methodOverride = require('method-override');
const path           = require('path');

// ── Middleware ────────────────────────────────────────────
const requestLogger   = require('./middleware/requestLogger');
const { requireAuth } = require('./middleware/authMiddleware');

// ── Routes ────────────────────────────────────────────────
const authRoutes      = require('./routes/authRoutes');
const blogRoutes      = require('./routes/blogRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// ── MongoDB (supports env var for Vercel) ─────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hasnain_blog';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => console.error('❌  MongoDB error:', err));

// ── View engine ───────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Body parsers ──────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// ── File upload ───────────────────────────────────────────
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  createParentPath: true,
}));

// ── Session (MongoDB store for Vercel) ────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'hasnain_blog_dev_secret_2026',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// ── Custom middleware ─────────────────────────────────────
app.use(requestLogger);

// ── Global template vars ──────────────────────────────────
app.use((req, res, next) => {
  res.locals.user  = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  if (req.session.flash) delete req.session.flash;
  next();
});

// ── Routes ────────────────────────────────────────────────
app.use('/',          authRoutes);
app.use('/blog',      blogRoutes);
app.use('/dashboard', requireAuth, dashboardRoutes);

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).render('404', { title: '404 — Not Found' })
);

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Error', message: err.message });
});

// ── Listen ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀  Server → http://localhost:${PORT}`)
);

module.exports = app;  // required for Vercel serverless
