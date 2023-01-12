const express = require("express");
const passport = require("passport");
// const dbo = require("../db/conn.js");
const productController = require("../controllers/productController.js");

const productRoute = express.Router();
function checkAdmin(req, res, next) {
  // console.log(req.user);
  if (req.user.isAdmin) {
    next();
  } else {
    // next(null);
    return res.status(401).json({
      msg: "Unauthorised",
      isAdmin: false,
    });
  }
}

productRoute.route("/").get(productController.getProducts);
productRoute
  .route("/addProduct")
  .post(
    passport.authenticate("jwt", { session: false }),
    checkAdmin,
    productController.addProduct
  );
productRoute
  .route("/updateProduct/:id")
  .post(
    passport.authenticate("jwt", { session: false }),
    checkAdmin,
    productController.updateProduct
  );
productRoute.route("/:productID").get(
  passport.authenticate("jwt", {
    session: false,
  }),
  productController.getSingleProduct
);

module.exports = productRoute;
