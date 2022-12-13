const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const passportController = (req, res, next) => {
  passport.use(new LocalStrategy(verify));
};

const verify = (username, password, done) => {
  User.findOne({ email: username }).then((user) => {
    if (!user) {
      return done(null, false);
    }
    if (!bcrypt.compare(password, user.password)) {
      return done(null, false);
    }
    return done(null, user);
  });
};

module.exports = passportController;
