const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const adminValidator = require('../validators/admin-validator');

const router = express.Router();

router.post('/add-user', isAuth, adminValidator.addUserValidation(),adminController.addUser);

module.exports = router;