const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true, minlength: 5, maxlength: 150 },
  content:  { type: String, required: true, minlength: 20 },
  excerpt:  { type: String, maxlength: 300 },
  image:    { type: String, default: '' },
  category: {
    type: String,
    enum: ['LLMs','Computer Vision','AI Agents','Reinforcement Learning','NLP','Generative AI','MLOps','Node.js','Python','Other'],
    default: 'Other',
  },
  tags:   [{ type: String, trim: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  views:  { type: Number, default: 0 },
}, { timestamps: true });

postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]+>/g, '').substring(0, 200) + '…';
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
