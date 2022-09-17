const express = require("express");
// const dbo = require("../db/conn.js");
const productController = require("../controllers/productController.js");

const productRoute = express.Router();

productRoute.route("/").get(productController.getProducts);
productRoute.route("/addProduct").post(productController.addProduct);

module.exports = productRoute;
