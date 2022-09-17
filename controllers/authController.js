const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");

//Passport config (login)
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

const signup = (req, res, next) => {
  let salt = crypto.randomBytes(16); // Generate Salt
  // generate password (key) based on user input password, salt, numberof times to hash the encrypt the password, desired length of the key, hashing algorith to use,and a callback function, with error and key generated as first ans second arguments respectively, to execute
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    async (err, hashedpassword) => {
      if (err) {
        return next(err);
      }
      // check if user already exists
      await User.findOne({ email: req.body.email }).then(
        async (user) => {
          //   console.log("search completed");
          if (user != null) {
            // when user exists
            res.json({ message: "User already exists: " + user._id });
          } else {
            //when user doesn't exist
            const newUser = new User({
              f_name: req.body.f_name,
              l_name: req.body.l_name,
              email: req.body.email,
              password: hashedpassword,
              salt: salt,
            });
            await newUser.save().then((user) => {
              res.json(user);
              //   return next();
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

module.exports = {
  signup,
};
