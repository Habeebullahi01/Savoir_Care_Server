const express = require("express");
const User = require("../models/User");
const passport = require("passport");
// const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { signup, newSignup } = require("../controllers/authController");
const passportController = require("../controllers/passportController");
const issueJWT = require("../utils/issueJwt");
const { verifyPassword } = require("../utils/password");

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
  await User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        if (verifyPassword(req.body.password, user.password, user.salt)) {
          const tokenObject = issueJWT(user);
          res.status(200).json({
            msg: "Success",
            token: tokenObject.token,
            expiresIn: tokenObject.expiresIn,
          });
        } else {
          res.status(200).json({ msg: "Invalid Password" });
        }
      } else {
        res
          .status(200)
          .json({ msg: "No User found with the provided credentials." });
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
