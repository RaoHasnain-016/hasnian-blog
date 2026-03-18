const path = require('path');
const fs   = require('fs');
const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');

const CATS = ['LLMs','Computer Vision','AI Agents','Reinforcement Learning','NLP','Generative AI','MLOps','Node.js','Python','Other'];
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

exports.getDashboard = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.session.user._id }).sort({ createdAt: -1 });
    res.render('dashboard/index', { title: 'Dashboard', posts, stats: {
      total: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      drafts:    posts.filter(p => p.status === 'draft').length,
      views:     posts.reduce((s, p) => s + p.views, 0),
    }});
  } catch (e) { res.status(500).render('error', { title: 'Error', message: e.message }); }
};

exports.getNewPost = (req, res) =>
  res.render('dashboard/create', { title: 'New Post', errors: [], old: {}, cats: CATS });

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.render('dashboard/create', { title: 'New Post', errors: errors.array(), old: req.body, cats: CATS });
  try {
    const { title, content, category, tags, status } = req.body;
    let image = '';
    if (req.files?.image) {
      const img  = req.files.image;
      const name = `${Date.now()}-${img.name.replace(/\s+/g, '-')}`;
      await img.mv(path.join(UPLOAD_DIR, name));
      image = name;
    }
    await Post.create({
      title, content, category, image,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status: status || 'published',
      author: req.session.user._id,
    });
    req.session.flash = { type: 'success', msg: '✅ Post published!' };
    res.redirect('/dashboard');
  } catch (e) {
    res.render('dashboard/create', { title: 'New Post', errors: [{ msg: e.message }], old: req.body, cats: CATS });
  }
};

exports.getEditPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.session.user._id });
    if (!post) return res.status(404).render('404', { title: '404' });
    res.render('dashboard/edit', { title: 'Edit Post', post, errors: [], cats: CATS });
  } catch (e) { res.status(500).render('error', { title: 'Error', message: e.message }); }
};

exports.updatePost = async (req, res) => {
  const errors = validationResult(req);
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.session.user._id });
    if (!post) return res.status(404).render('404', { title: '404' });
    if (!errors.isEmpty())
      return res.render('dashboard/edit', { title: 'Edit Post', post, errors: errors.array(), cats: CATS });
    if (req.files?.image) {
      if (post.image) { const op = path.join(UPLOAD_DIR, post.image); if (fs.existsSync(op)) fs.unlinkSync(op); }
      const img  = req.files.image;
      const name = `${Date.now()}-${img.name.replace(/\s+/g, '-')}`;
      await img.mv(path.join(UPLOAD_DIR, name));
      post.image = name;
    }
    post.title    = req.body.title;
    post.content  = req.body.content;
    post.category = req.body.category;
    post.tags     = req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    post.status   = req.body.status || 'published';
    post.excerpt  = '';
    await post.save();
    req.session.flash = { type: 'success', msg: '✅ Post updated!' };
    res.redirect('/dashboard');
  } catch (e) { res.status(500).render('error', { title: 'Error', message: e.message }); }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.session.user._id });
    if (post?.image) { const p = path.join(UPLOAD_DIR, post.image); if (fs.existsSync(p)) fs.unlinkSync(p); }
    req.session.flash = { type: 'success', msg: '🗑 Post deleted.' };
    res.redirect('/dashboard');
  } catch (e) { res.status(500).render('error', { title: 'Error', message: e.message }); }
};

exports.getProfile = async (req, res) => {
  try {
    const user  = await User.findById(req.session.user._id);
    const posts = await Post.find({ author: req.session.user._id });
    res.render('dashboard/profile', { title: 'Profile', user, posts });
  } catch (e) { res.status(500).render('error', { title: 'Error', message: e.message }); }
};
