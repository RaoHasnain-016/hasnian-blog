const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login?error=Please+login+to+continue');
  }
  next();
};

const redirectIfAuth = (req, res, next) => {
  if (req.session.user) return res.redirect('/dashboard');
  next();
};

module.exports = { requireAuth, redirectIfAuth };
