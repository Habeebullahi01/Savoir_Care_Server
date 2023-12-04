const jwt = require("jsonwebtoken");
// const path = require("path");
// const fs = require("fs");
// const config = require("./keys");
require("dotenv").config({ path: "config.env" });

// const PRIV_KEY_PATH = process.env.PRIV_KEY_PATH;
// const PRIV_KEY = fs.readFileSync("./priv_key.pem", "utf-8");
let PRIV_KEY;
// if (fs.existsSync(PRIV_KEY_PATH)) {
//   PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf-8");
// } else {
//   config.then(() => {
//     PRIV_KEY = fs.readFileSync(PRIV_KEY_PATH, "utf-8");
//   });
// }

PRIV_KEY = process.env.PRIV_KEY;
// PRIV_KEY = fs.writeFile("./priv_key.pem", process.env.PRIV_KEY, (err) => {
//   if (err) {
//     console.log("Error creating priv pem file.");
//     console.log(err);
//   }
// });

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
