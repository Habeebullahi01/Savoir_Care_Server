const User = require("../models/User");
const Admin = require("../models/Admin");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
const JWT_Strategy = require("passport-jwt");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: "config.env" });

// PEM FILE IN PROJECT FOLDER
// const PUB_KEY = fs.readFileSync("./pub_key.pem", "utf-8");

// PEM FILE PATH IN ENV, FILE IN UNPUBLISHED LOCATION
// const pubKeyPath = process.env.PUB_KEY_PATH;
// const PUB_KEY = fs.readFileSync(pubKeyPath, "utf-8");

// RSA KEY STORED IN ENV AS A STRING
const PUB_KEY = process.env.PUB_KEY;

// JWT Config
const [JwtStrategy, ExtractJwt] = [
  JWT_Strategy.Strategy,
  JWT_Strategy.ExtractJwt,
];
// Custom Extractor Function
const cookieExtractor = (req) => {
  var token;
  if (req && req.cookies) {
    token = req.cookies["auth"];
  }
  return token;
};
const jwt_strategy_options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

//custom fields
const customFields = {
  usernameField: "email",
  passwordField: "password",
};

// verify callback for Local Strategy
function verifyLocal(email, password, done) {
  // console.log("Fnding user");
  User.findOne({ email: email })
    .then(
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
              genPassword = genPassword.toString("hex");
              if (err) {
                return done(err);
              }
              if (user.password === genPassword) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            }
          );
        }
      },
      (err) => {
        console.error("Error while trying to find user: " + err);
      }
    )
    .catch((err) => {
      return done(err);
    });
}

// Verify Callback for JWT Strategy
function verifyJwt(jwt_payload, done) {
  // if (!jwt_payload.sub) {
  //   return done(null, false, { message: "You have to be logged in." });
  // }
  // console.log(typeof jwt_payload);
  if (jwt_payload.isAdmin == true) {
    Admin.findOne({ _id: jwt_payload.sub })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((err) => {
        return done(err, false);
      });
  } else {
    User.findOne({ _id: jwt_payload.sub })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((err) => {
        return done(err, false);
      });
  }
}

// Local strategy
// const localStrategy = new LocalStrategy(customFields, verifyLocal);
// passport.use(localStrategy);

// JWT strategy

// passport.use(new JwtStrategy(jwt_strategy_options, verifyJwt));

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

module.exports = (x) => {
  x.use(new JwtStrategy(jwt_strategy_options, verifyJwt));
};
