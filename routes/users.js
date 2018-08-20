const express = require("express");
const router = express.Router();
const { check } = require('express-validator/check');

const userController = require("./../controllers/users")

router.post("/signup", [
  check('user.email')
      .isEmail()
      .withMessage('must be an email'),
  check('user.password')
      .isLength({ min: 6 })
      .withMessage('password be at least 6 chars long'),
  check('user.passwordConfirmation', 'passwordConfirmation field must have the same value as the password field')
      .exists()
      .custom((value, { req }) => value === req.body.user.password)
], userController.user_signup);
router.post("/login", userController.user_login)
router.get("/logout", userController.user_logout)

module.exports = router;
