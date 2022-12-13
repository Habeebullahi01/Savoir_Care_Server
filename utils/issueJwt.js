const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const PRIV_KEY = fs.readFileSync(__dirname + "/priv_key.pem", "utf-8");

const issueJWT = (user) => {
  const _id = user._id;
  const payload = {
    sub: _id,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, PRIV_KEY, {
    algorithm: "RS256",
    expiresIn: "1d",
  });

  return {
    token: "Bearer " + signedToken,
    expiresIn: "1d",
  };
};

module.exports = issueJWT;
