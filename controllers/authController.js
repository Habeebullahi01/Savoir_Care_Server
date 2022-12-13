const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { generatePassword } = require("../utils/password");

const session = require("express-session");
const MongoStore = require("connect-mongo");

//Passport config (login)
// passport.use(
//   new LocalStrategy(function verify(username, password, done) {
//     // console.log("Fnding user");
//     User.findOne({ email: username })
//       .then(
//         (user) => {
//           if (user != null) {
//             // user exists
//             crypto.pbkdf2(
//               password,
//               user.salt,
//               310000,
//               32,
//               "sha256",
//               (err, genPassword) => {
//                 genPassword = genPassword.toString("hex");
//                 if (err) {
//                   return done(err);
//                 }
//                 if (user.password != genPassword) {
//                   // console.log("incorrect password");
//                   return done(null, false, { message: "Incorrect password" });
//                 }
//                 // console.log(user.email);
//                 return done(null, user);
//               }
//             );
//           }
//         },
//         (err) => {
//           console.error("Error while trying to find user: " + err);
//         }
//       )
//       .catch((err) => {
//         return done(err);
//       });
//   })
// );

// passport.serializeUser((user, done) => {
//   console.log("serializing");
//   done(null, user._id);
// });
// passport.deserializeUser((id, done) => {
//   // User.findById(id)
//   //   .then((user) => {
//   //     console.log("Finding by Id");
//   //     done(null, user);
//   //   })
//   //   .catch((err) => {
//   //     return done(err);
//   //   });
//   User.findById(id, (err, user) => {
//     if (err) {
//       return done(err);
//     }
//     done(null, user);
//   });
// });

const signup = (req, res, next) => {
  let salt = crypto.randomBytes(16).toString("hex"); // Generate Salt
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
              password: hashedpassword.toString("hex"),
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

const newSignup = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      res.json({ msg: "User already exists" });
    } else {
      const hashedPassword = generatePassword(req.body.password);
      const newUser = new User({
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        email: req.body.email,
        password: hashedPassword.hash,
        salt: hashedPassword.salt,
      });
      await newUser.save().then((user) => {
        res.json(user);
        //   return next();
      });
    }
  });
};

module.exports = {
  signup,
  newSignup,
};
