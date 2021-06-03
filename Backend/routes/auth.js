const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const authController = require('../controllers/auth');
const authValidator = require('../validators/auth-validator');

router.post('/signup', authValidator.signupValidation(),authController.signup);
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
    body('password', 'Password has to be valid.').trim().isLength({min: 6})
],authController.login);
router.post('/register-users', authController.registerUsersData);

module.exports = router;