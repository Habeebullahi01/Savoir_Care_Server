const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: "config.env" });
const { Buffer } = require("node:buffer");

// PEM FILE IN PROJECT FOLDER
// const PRIV_KEY = fs.readFileSync("./priv_key.pem", "utf-8");

// PEM FILE PATH IN ENV, FILE IN UNPUBLISHED LOCATION
// const privKeyPath = process.env.PRIV_KEY_PATH;
// const PRIV_KEY = fs.readFileSync(privKeyPath, "utf-8");

// RSA KEY IN ENV AS STRING
const PRIV_KEY = process.env.PRIV_KEY;

const issueJWT = (user) => {
  const _id = user._id;
  const isAdmin = user.isAdmin == true ? true : false;
  const payload = {
    sub: _id,
    isAdmin,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, PRIV_KEY, {
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    maxAge: 7 * 24 * 60 * 60,
  };
};

module.exports = issueJWT;
