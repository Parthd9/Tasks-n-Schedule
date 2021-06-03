const { body } = require('express-validator');
const User = require('../models/user');

exports.signupValidation = () => {
    console.log('Sign-up validation');
    return [
        body('fName').trim().not().isEmpty().isAlpha().isLength({min: 2}),
        body('lName').trim().not().isEmpty().isAlpha().isLength({min: 2}),
        body('password').trim().isLength({ min: 6 }),
        body('orgName').trim().isLength({ min: 3 }).isString(),
        body('email')
          .isEmail()
          .withMessage('Please enter a valid email.')
          .custom((value, { req }) => {
            return User.findUser({email: value}).then(userDoc => {
              if (userDoc) {
                return Promise.reject('E-Mail address already exists!');
              }
            });
          })
          .normalizeEmail(),
    ]
}