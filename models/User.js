const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  f_name: String,
  l_name: String,
  email: String,
  password: Buffer,
  salt: Buffer,
  date_joined: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
