const { body } = require('express-validator');
const User = require('../models/user');

exports.addUserValidation = () => {
    console.log('add-user validation');
    return [
        body('fname').trim().not().isEmpty().isString(),
        body('lname').trim().not().isEmpty().isString(),
        body('role').trim().not().isEmpty().isString(),
        body('email')
          .isEmail()
          .withMessage('Please enter a valid email.')
          .normalizeEmail()
    ]
}