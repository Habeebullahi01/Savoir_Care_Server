const mongoose = require("mongoose");
/**
 * @openapi
 * Components:
 *  Schema:
 *    Order:
 */

const orderSchema = new mongoose.Schema({
  user_id: String,
  paymentStatus: {
    type: String,
    value: "Paid" || "Pending",
    default: "Pending",
  },
  location: String,
  order_date: { type: Date, default: Date.now },
  delivery_date: { type: Date || null, default: null },
  order_status: {
    type: String,
    value: "Delivered" || "In-transit" || "Processing",
    default: "Processing",
  },
  extra_info: String || null,
  products: [
    {
      productID: String,
      quantity: Number,
      variation: String,
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
