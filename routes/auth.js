const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { signup } = require("../controllers/authController");

// Passport Configuration
passport.use(
  new LocalStrategy(function verify(email, password, done) {
    User.findOne({ email: email }).then(
      (user) => {
        if (user != null) {
          // user exists
          crypto.pbkdf2(
            password,
            user.salt,
            310000,
            32,
            "sha256",
            (err, genPassword) => {
              if (err) {
                return done(err);
              }
              if (!crypto.timingSafeEqual(user.password, genPassword)) {
                return done(null, false, { message: "Incorrect password" });
              }
              res.json({ message: "Password is correct!" });
            }
          );
        }
      },
      (err) => {
        console.error("Error while trying to find user: " + err);
      }
    );
  })
);

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

authRoute.route("/plogin").post(passport.authenticate("local"));

module.exports = authRoute;
