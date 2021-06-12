const { body } = require("express-validator");
const User = require("../models/user");

exports.addUserValidation = () => {
  console.log("add-user validation");
  return [
    body("fname").trim().not().isEmpty().isString(),
    body("lname").trim().not().isEmpty().isString(),
    body("role").trim().not().isEmpty().isString(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findUser({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      }),
    // .normalizeEmail()
  ];
};

exports.editUserValidation = () => {
  console.log("edit-user validation");
  return [
    body("fname").trim().not().isEmpty().isString(),
    body("lname").trim().not().isEmpty().isString(),
    body("role").trim().not().isEmpty().isString(),
  ];
};
