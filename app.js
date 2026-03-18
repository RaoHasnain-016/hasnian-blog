const express        = require('express');
const mongoose       = require('mongoose');
const session        = require('express-session');
const MongoStore     = require('connect-mongo');
const fileUpload     = require('express-fileupload');
const methodOverride = require('method-override');
const path           = require('path');

const requestLogger   = require('./middleware/requestLogger');
const { requireAuth } = require('./middleware/authMiddleware');
const authRoutes      = require('./routes/authRoutes');
const blogRoutes      = require('./routes/blogRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hasnain_blog';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB error:', err.message);
    isConnected = false;
  }
}

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: false,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'hasnain_dev_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    touchAfter: 24 * 3600,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

app.use(async (req, res, next) => {
  if (!isConnected) await connectDB();
  next();
});

app.use(requestLogger);

app.use((req, res, next) => {
  res.locals.user  = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  if (req.session.flash) delete req.session.flash;
  next();
});

app.use('/',          authRoutes);
app.use('/blog',      blogRoutes);
app.use('/dashboard', requireAuth, dashboardRoutes);

app.use((req, res) =>
  res.status(404).render('404', { title: '404 — Not Found' })
);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).render('error', { title: 'Error', message: err.message });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
}

module.exports = app;