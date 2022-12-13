const crypto = require("crypto");

const generatePassword = (passwordInput) => {
  const salt = crypto.randomBytes(16).toString("hex");

  const pass = crypto.pbkdf2Sync(passwordInput, salt, 310000, 32, "sha256");
  return {
    hash: pass.toString("hex"),
    salt: salt,
  };
};

const verifyPassword = (password, hash, salt) => {
  const verify = crypto
    .pbkdf2Sync(password, salt, 310000, 32, "sha256")
    .toString("hex");
  return verify === hash;
};

module.exports = {
  generatePassword,
  verifyPassword,
};
