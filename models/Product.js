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

const cartSchema = new mongoose.Schema({
  user_id: String,
  products: [
    {
      product_id: String,
      quantity: Number,
      variation: String,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Product, Cart };
