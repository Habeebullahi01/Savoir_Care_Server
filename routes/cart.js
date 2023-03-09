const express = require("express");
const cartController = require("../controllers/cartController");
const passport = require("passport");

const cartRoute = express.Router();
cartRoute
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    cartController.getCart
  );
cartRoute
  .route("/add")
  .post(
    passport.authenticate("jwt", { session: false }),
    cartController.addToCart
  );
cartRoute
  .route("/update")
  .post(
    passport.authenticate("jwt", { session: false }),
    cartController.updateCart
  );
cartRoute
  .route("/delete")
  .delete(
    passport.authenticate("jwt", { session: false }),
    cartController.deleteFromCart
  );
module.exports = cartRoute;
