const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add-user', isAuth,adminController.addUser);

module.exports = router;