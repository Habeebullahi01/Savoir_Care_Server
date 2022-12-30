const express = require("express");
const passport = require("passport");
// const dbo = require("../db/conn.js");
const productController = require("../controllers/productController.js");

const productRoute = express.Router();

productRoute.route("/").get(productController.getProducts);
productRoute.route("/addProduct").post(productController.addProduct);
productRoute.route("/updateProduct/:id").post(productController.updateProduct);
productRoute.route("/:productID").get(
  passport.authenticate("jwt", {
    session: false,
  }),
  productController.getSingleProduct
);

module.exports = productRoute;
