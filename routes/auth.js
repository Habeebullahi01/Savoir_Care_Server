const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { signup } = require("../controllers/authController");

// Passport Configuration

const authRoute = express.Router();

// authRoute.route("/signup").post((req, res) => {
//   const user = {
//     f_name: req.body.f_name,
//     l_name: req.body.l_name,
//     email: req.body.email,
//     password: req.body.password,
//   };
//   const newUser = new User(user);
//   newUser.save().then((obj) => {
//     res.json(obj);
//   });
// });

authRoute.route("/signup").post(signup);

authRoute.route("/login").post((req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  User.findOne({ email: user.email }).then(
    (obj) => {
      res.json(obj);
    },
    (err) => {
      res.json(err);
    }
  );
});

authRoute.route("/plogin").post(
  // (req, res, next) => {
  //   console.log(req.body);
  //   next();
  // },
  passport.authenticate("local", { failureMessage: "Check your credentials" }),
  (req, res) => {
    const data = req.session.cart ? true : false;
    req.session.cart = { prod1: "First Product" };
    req.isAuthenticated
      ? res.json({
          session: req.session,
          // user: req.user,
          sessionID: req.sessionID,
          data: data,
          // requestObject: req,
        })
      : res.json({ message: "unable to login" });
  }
);

module.exports = authRoute;
