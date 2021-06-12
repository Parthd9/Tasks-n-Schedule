const { body } = require("express-validator");

exports.backlogValidation = () => {
  console.log("add backlog validation");
  return [
    body("description").trim().not().isEmpty().isLength({ min: 10, max: 128 }),
    body("backlogType").trim().not().isEmpty(),
    body("estimatedTime").isInt({ min: 1 }),
  ];
};
