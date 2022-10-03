const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  f_name: String,
  l_name: String,
  email: String,
  password: String, // or Number?
  salt: String, // or Number?
  // I think it depends on what
  date_joined: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
