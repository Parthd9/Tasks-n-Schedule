const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const authValidator = require('../validators/auth-validator');

router.post('/signup', authValidator.signupValidation(),authController.signup);
router.post('/login', authController.login);
router.post('/register-users', authController.registerUsersData);

module.exports = router;