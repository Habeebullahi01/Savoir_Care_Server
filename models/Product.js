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

const orderSchema = new mongoose.Schema({
  user_id: String,
  paymentStatus: { type: String, value: "Paid" || "Pending" },
  location: String,
  order_date: { type: Date, default: Date.now },
  delivery_date: Date,
  delivery_status: {
    type: String,
    value: "Delivered" || "In-transit" || "Processing",
  },
  extra_info: String,
  products: [
    {
      productID: String,
      quantity: Number,
      variation: String,
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Product, Cart, Order };
