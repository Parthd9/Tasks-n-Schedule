const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const adminValidator = require('../validators/admin-validator');

const router = express.Router();

router.post('/add-user', isAuth, adminValidator.addUserValidation(),adminController.addUser);

router.get('/get-users', isAuth,adminController.getUsers);

router.put('/edit-user', isAuth, adminValidator.editUserValidation(),adminController.editUser);

router.post('/remove-user', isAuth, adminController.removeUser);

router.get('/getProjectsData', isAuth,adminController.getProjectsData);

module.exports = router;