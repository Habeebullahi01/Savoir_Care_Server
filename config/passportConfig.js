const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWT_Strategy = require("passport-jwt");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "/utils", "pub_key.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf-8");

// JWT Config
const [JwtStrategy, ExtractJwt] = [
  JWT_Strategy.Strategy,
  JWT_Strategy.ExtractJwt,
];
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

// Local strategy
// const localStrategy = new LocalStrategy(customFields, verifyLocal);
// passport.use(localStrategy);

// JWT strategy

// passport.use(new JwtStrategy(jwt_strategy_options, verifyJwt));

passport.serializeUser((user, done) => {
  console.log("serializing");
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  // User.findById(id)
  //   .then((user) => {
  //     console.log("Finding by Id");
  //     done(null, user);
  //   })
  //   .catch((err) => {
  //     return done(err);
  //   });
  User.findById(id, (err, user) => {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

module.exports = (x) => {
  x.use(new JwtStrategy(jwt_strategy_options, verifyJwt));
};
