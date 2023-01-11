const User = require("../models/User");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const { generatePassword } = require("../utils/password");
const _ = require("lodash");
const issueJWT = require("../utils/issueJwt");

const signup = (req, res, next) => {
  let salt = crypto.randomBytes(16).toString("hex"); // Generate Salt
  // generate password (key) based on user input password, salt, numberof times to hash the encrypt the password, desired length of the key, hashing algorith to use,and a callback function, with error and key generated as first ans second arguments respectively, to execute
  crypto.pbkdf2(
    _.trim(req.body.password),
    salt,
    310000,
    32,
    "sha256",
    async (err, hashedpassword) => {
      if (err) {
        return next(err);
      }
      // check if user already exists
      await User.findOne({ email: _.trim(req.body.email) }).then(
        async (user) => {
          //   console.log("search completed");
          if (user != null) {
            // when user exists
            res.status(401).json({
              msg: "User already exists",
              auth: false,
              invalidCred: "email",
            });
          } else {
            //when user doesn't exist
            const newUser = new User({
              f_name: _.trim(req.body.f_name),
              l_name: _.trim(req.body.l_name),
              email: _.trim(req.body.email),
              password: hashedpassword.toString("hex"),
              salt: salt,
            });
            await newUser.save().then((user) => {
              // res.status(200).json({
              //   msg: "User has successfully signed up.",
              //   auth: true,
              // });
              //   return next();
              const tokenObject = issueJWT(user);
              res.status(200).json({
                auth: true,
                msg: "User has successfully signed up.",
                token: tokenObject.token,
                expiresIn: tokenObject.expiresIn,
              });
            });
          }
          return next();
        }
        // async () => {
        // }
      );
    }
  );
};

const adminSignup = async (req, res, next) => {
  await Admin.findOne({ email: _.trim(req.body.email) }).then(async (user) => {
    if (user) {
      res.status(401).json({
        msg: "Admin email already exists",
        auth: false,
        invalidCred: "email",
      });
    } else {
      const hashedPassword = generatePassword(_.trim(req.body.password));
      const newUser = new Admin({
        f_name: _.trim(req.body.f_name),
        l_name: _.trim(req.body.l_name),
        email: _.trim(req.body.email),
        password: hashedPassword.hash,
        salt: hashedPassword.salt,
      });
      await newUser.save().then((user) => {
        res.status(200).json(user);
      });
    }
    return next();
  });
};

module.exports = {
  signup,
  adminSignup,
};
