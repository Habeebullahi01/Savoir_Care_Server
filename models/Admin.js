const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  f_name: String,
  l_name: String,
  email: String,
  password: String,
  salt: String,
  date_joined: { type: Date, default: Date.now },
  admin: { type: Boolean, default: true },
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
