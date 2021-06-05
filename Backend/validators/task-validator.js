const { body } = require('express-validator');

exports.backlogValidation = () => {
    console.log('add backlog validation');
    return [
        body('description').trim().not().isEmpty().isLength({min: 10, max: 128}),
        body('type').trim().not().isEmpty(),
        body('estTime').isInt({min: 1})
    ]
  }