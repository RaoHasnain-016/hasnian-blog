const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/blogController');
router.get('/',    ctrl.getAllPosts);
router.get('/:id', ctrl.getPost);
module.exports = router;
