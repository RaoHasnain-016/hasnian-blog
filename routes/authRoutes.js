const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const blogCtrl = require('../controllers/blogController');
const { redirectIfAuth } = require('../middleware/authMiddleware');

const regRules = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((v, { req }) => {
    if (v !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];
const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.get('/',         blogCtrl.getLanding);
router.get('/register', redirectIfAuth, ctrl.getRegister);
router.post('/register',redirectIfAuth, regRules, ctrl.postRegister);
router.get('/login',    redirectIfAuth, ctrl.getLogin);
router.post('/login',   redirectIfAuth, loginRules, ctrl.postLogin);
router.post('/logout',  ctrl.logout);

module.exports = router;
