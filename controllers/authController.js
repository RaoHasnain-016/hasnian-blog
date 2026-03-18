const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.getRegister = (req, res) =>
  res.render('auth/register', { title: 'Register', errors: [], old: {} });

exports.postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.render('auth/register', { title: 'Register', errors: errors.array(), old: req.body });
  try {
    const { username, email, password, bio } = req.body;
    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res.render('auth/register', { title: 'Register', errors: [{ msg: 'Username or email already exists.' }], old: req.body });
    const user = await User.create({ username, email, password, bio });
    req.session.user  = { _id: user._id, username: user.username, email: user.email };
    req.session.flash = { type: 'success', msg: `Welcome, ${user.username}! 🎉` };
    res.redirect('/dashboard');
  } catch (e) {
    res.render('auth/register', { title: 'Register', errors: [{ msg: e.message }], old: req.body });
  }
};

exports.getLogin = (req, res) => {
  const err = req.query.error || null;
  res.render('auth/login', { title: 'Login', errors: err ? [{ msg: err }] : [], old: {} });
};

exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.render('auth/login', { title: 'Login', errors: errors.array(), old: req.body });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.render('auth/login', { title: 'Login', errors: [{ msg: 'Invalid email or password.' }], old: req.body });
    req.session.user = { _id: user._id, username: user.username, email: user.email };
    const to = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(to);
  } catch (e) {
    res.render('auth/login', { title: 'Login', errors: [{ msg: e.message }], old: req.body });
  }
};

exports.logout = (req, res) =>
  req.session.destroy(() => res.redirect('/login'));
