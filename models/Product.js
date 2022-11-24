const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  imageURL: String,
  description: String,
  price: Number,
  quantity: Number,
  tags: Array,
  dateAdded: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
