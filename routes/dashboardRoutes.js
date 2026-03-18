const express  = require('express');
const { body } = require('express-validator');
const router   = express.Router();
const ctrl     = require('../controllers/dashboardController');
const imgVal   = require('../middleware/imageValidator');

const postRules = [
  body('title').trim().isLength({ min: 5, max: 150 }).withMessage('Title must be 5–150 characters'),
  body('content').isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  body('category').isIn(['LLMs','Computer Vision','AI Agents','Reinforcement Learning','NLP','Generative AI','MLOps','Node.js','Python','Other']).withMessage('Invalid category'),
];

router.get('/',               ctrl.getDashboard);
router.get('/profile',        ctrl.getProfile);
router.get('/posts/new',      ctrl.getNewPost);
router.post('/posts',         imgVal, postRules, ctrl.createPost);
router.get('/posts/:id/edit', ctrl.getEditPost);
router.put('/posts/:id',      imgVal, postRules, ctrl.updatePost);
router.delete('/posts/:id',   ctrl.deletePost);

module.exports = router;
