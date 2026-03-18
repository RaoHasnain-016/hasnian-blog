const Post = require('../models/Post');

const CATS = ['LLMs','Computer Vision','AI Agents','Reinforcement Learning','NLP','Generative AI','MLOps','Node.js','Python','Other'];

// ── Landing page ──────────────────────────────────────────
exports.getLanding = async (req, res) => {
  try {
    const featured = await Post.find({ status: 'published' })
      .populate('author', 'username').sort({ views: -1 }).limit(3);
    const recent = await Post.find({ status: 'published' })
      .populate('author', 'username').sort({ createdAt: -1 }).limit(6);
    const total = await Post.countDocuments({ status: 'published' });
    res.render('blog/landing', { title: 'Home', featured, recent, total, cats: CATS });
  } catch (e) {
    res.status(500).render('error', { title: 'Error', message: e.message });
  }
};

// ── All posts ─────────────────────────────────────────────
exports.getAllPosts = async (req, res) => {
  try {
    const page     = parseInt(req.query.page) || 1;
    const limit    = 9;
    const category = req.query.category || '';
    const search   = req.query.search   || '';
    const query    = { status: 'published' };
    if (category) query.category = category;
    if (search)   query.$or = [
      { title:   { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(limit);
    res.render('blog/index', {
      title: 'Blog', posts, currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
      category, search, cats: CATS,
    });
  } catch (e) {
    res.status(500).render('error', { title: 'Error', message: e.message });
  }
};

// ── Single post ───────────────────────────────────────────
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username bio');
    if (!post) return res.status(404).render('404', { title: '404' });
    post.views += 1;
    await post.save();
    const related = await Post.find({ category: post.category, _id: { $ne: post._id }, status: 'published' })
      .limit(3).populate('author', 'username');
    res.render('blog/show', { title: post.title, post, related });
  } catch (e) {
    res.status(500).render('error', { title: 'Error', message: e.message });
  }
};
