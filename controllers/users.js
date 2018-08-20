const express = require("express");
const bcrypt = require("bcrypt");
const validationResult = require('express-validator/check').validationResult;

const User = require("./../models/user")

exports.user_signup = (req, res, next) => {
  var errors = validationResult(req);
  console.log('errors:', errors);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.mapped() });
  }
  bcrypt.hash(req.body.user.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const user = new User({
        email: req.body.user.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "User created"
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    }
  });
}

exports.user_login = (req, res, next) => {
  User.findOne({ email: req.body.user.email })
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.user.password, user.password, (err, result) => {
          console.log("result:", result)
          if (err) {
            res.status(401).json({
              message: "Auth failed"
            })
          }
          if (result) {
            req.session.user = user
            console.log("session user:", req.session.user)
            res.status(200).json({
              message: "Auth successful",
              userEmail: user.email
            })
          } else {
            res.status(401).json({
              message: "Password is wrong"
            })
          }
        })
      } else {
        res.status(401).json({
          message: "User doesn't exist"
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    })
}

exports.user_logout = (req, res) => {
  req.session.destroy(function () {
    delete req.session;
    res.clearCookie('connect.sid', { path: '/' });
    res.status(200).json({
      message: "User log out successfully!"
    })
  })
}
