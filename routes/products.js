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
      message: "Unauthorised",
      isAdmin: false,
    });
  }
}

/**
 * @openapi
 * /products:
 *  get:
 *    tags:
 *    - Products
 *    summary: Get collection of products
 *    description: This returns a collection of products. The result is paginated.
 */
productRoute.route("/").get(productController.getProducts);
productRoute.route("/addProduct").post(
  passport.authenticate("jwt", { session: false }),
  checkAdmin,
  (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
      res.status(400).json({
        message: "The request body shouldn't be empty",
      });
    } else if (
      !req.body.productName ||
      !req.body.description ||
      !req.body.quantity ||
      !req.body.price ||
      !req.body.imageURL ||
      !req.body.tags
    ) {
      res.status(400).json({
        message:
          "Check the request body for possible absence of required fields.",
      });
    } else {
      next();
    }
  },
  productController.addProduct
);
productRoute.route("/updateProduct/:id").post(
  passport.authenticate("jwt", { session: false }),
  checkAdmin,
  (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
      res.status(400).json({
        message: "The request body shouldn't be empty",
      });
    } else if (
      !req.body.productName &&
      !req.body.description &&
      !req.body.quantity &&
      !req.body.price &&
      !req.body.imageURL &&
      !req.body.tags
    ) {
      res.status(400).json({
        message:
          "Check the request body for possible absence of required fields.",
      });
    } else {
      next();
    }
  },
  productController.updateProduct
);
productRoute.route("/:productID").get(
  passport.authenticate("jwt", {
    session: false,
  }),
  productController.getSingleProduct
);
productRoute.route("/deleteProduct/:id").delete(
  passport.authenticate("jwt", {
    session: false,
  }),
  checkAdmin,
  productController.deleteProduct
);
module.exports = productRoute;
