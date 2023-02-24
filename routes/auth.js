const express = require("express");
const User = require("../models/User");
const Admin = require("../models/Admin");
const passport = require("passport");
// const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { signup, adminSignup } = require("../controllers/authController");
const passportController = require("../controllers/passportController");
const issueJWT = require("../utils/issueJwt");
const { verifyPassword } = require("../utils/password");
const _ = require("lodash");

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

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "YOU SHALL NOT PASS!" });
  }
};

authRoute.route("/signup").post(signup);
authRoute.route("/admin/signup").post(adminSignup);
authRoute.route("/logout").post((req, res, next) => {
  req.logout(() => {
    res.json({ msg: "Logged Out." });
  });
});
authRoute.route("/success").get(isAuth, (req, res, next) => {
  console.log(req.user);
  res.json({ msg: "Login success" });
});
authRoute.route("/failure").get((req, res, next) => {
  res.send("Login Falied. Check credentials. ");
});

authRoute.route("/login").post(async (req, res, next) => {
  if (req.body == null || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Request body should not be empty." });
    // return;
  } else if (!req.body.email) {
    res.status(400).json({ message: "Email field should not be empty." });
  } else if (!req.body.password) {
    res.status(400).json({ message: "Password field should not be empty." });
  }
  // console.log(req.body);
  await User.findOne({ email: _.trim(req.body.email) })
    .then((user) => {
      if (user) {
        if (
          verifyPassword(_.trim(req.body.password), user.password, user.salt)
        ) {
          const tokenObject = issueJWT(user);
          res
            .status(200)
            .cookie("auth", tokenObject.token, {
              // expires: tokenObject.expiresIn,
              maxAge: tokenObject.maxAge,
              // httpOnly: true,
            })
            .json({
              auth: true,
              msg: "Success",
              token: tokenObject.token,
            });
          // res.status(200).json({
          //   auth: true,
          //   msg: "Success",
          // });
        } else {
          res.status(401).json({
            message: "Invalid Password",
            auth: false,
            invalidCred: "password",
          });
        }
      } else {
        res.status(401).json({
          message: "Invalid User",
          auth: false,
          invalidCred: "email",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err !== null) {
        res.json({ Error: err });
      }
      next();
    });
});
authRoute.route("/admin/login").post(async (req, res, next) => {
  await Admin.findOne({ email: _.trim(req.body.email) })
    .then((admin) => {
      if (admin && admin.isAdmin == true) {
        if (
          verifyPassword(_.trim(req.body.password), admin.password, admin.salt)
        ) {
          const tokenObject = issueJWT(admin);
          res.cookie("admin_auth", tokenObject.token, {
            maxAge: tokenObject.maxAge,
            httpOnly: true,
          });
          res.status(200).json({
            auth: true,
            msg: "Success",
            token: tokenObject.token,
          });
        } else {
          res.status(401).json({
            msg: "Invalid Password",
            auth: false,
            invalidCred: "password",
          });
        }
      } else {
        res.status(401).json({
          msg: "Invalid Admin",
          auth: false,
          invalidCred: "email",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err !== null) {
        res.json({ Error: err });
      }
      next();
    });
});

authRoute.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send("You've been Authenticated with Passport's JWT Strategy.");
  }
);

module.exports = authRoute;
