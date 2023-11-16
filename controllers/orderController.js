const { Cart } = require("../models/Product");
const { Order } = require("../models/Order");
module.exports = {
  retrieveOrders: async (user_id) => {
    return await Order.find({ user_id: user_id }).then((orderDoc) => {
      return orderDoc;
    });
  },
  createOrder: async (user_id, location, extra_info = null) => {
    // Get user's cart first. This block of code should eventually be moved to the 'cart controller'.
    async function getCart() {
      return await Cart.findOne({ user_id: user_id })
        .then((cart) => {
          if (cart && cart.products.length > 0) {
            return cart.products;
          } else {
            // Return empty cart
            return null;
          }
        })
        .catch((e) => {
          console.log(e);
          // throw e;
        });
    }

    async function purgeCart() {
      return await Cart.updateOne(
        { user_id: user_id },
        {
          $set: { products: [] },
        }
      )
        .then(() => {
          return true;
        })
        .catch((err) => {
          return false;
        });
    }

    const products = await getCart();
    let newOrderDoc = {};
    // Check for product presence
    // console.log(products);
    if (products) {
      newOrderDoc = {
        ...newOrderDoc,
        user_id: user_id,
        products: products,
        location: "The location",
        extra_info,
      };
      const newOrder = new Order(newOrderDoc);
      return await newOrder.save().then(async (orderDoc) => {
        await purgeCart();
        return orderDoc;
      });
    } else {
      throw null;
    }
  },
};
