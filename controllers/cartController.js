const Cart = require("../models/Product").Cart;

module.exports = {
  getCart: async (req, res) => {
    // Check for user's cart document in the DB
    await Cart.findOne({ user_id: req.user._id })
      .then((cart) => {
        if (cart) {
          // Return the cart document
          res.status(200).json(cart);
        } else {
          // Create cart and return the created document
          new Cart({ user_id: req.user._id, products: [] })
            .save()
            .then((cart) => {
              res.status(200).json(cart);
            })
            .catch((e) => {
              res.status(500).json({
                message: "An error occured while trying to create the cart.",
              });
            });
          // res.status(404).json({ message: "No cart available" });
        }
      })
      .catch((e) => {
        res.status(500).json({
          message: "An error occured.",
        });
      });
  },

  addToCart: async (req, res) => {
    const currentCart = await Cart.findOne({ user_id: req.user._id }).then(
      (doc) => {
        return doc.products;
      }
    );
    const currentProduct = currentCart.filter((p) => {
      if (
        p.product_id === req.body.product_id &&
        p.variation === req.body.variation
      ) {
        return true;
      }
    });
    // console.log(currentProduct);
    if (currentProduct.length > 0) {
      // console.log("Product exixts");
      res.status(200).json({
        message: "The item is already in the cart.",
        // doc: doc,
      });
    } else {
      await Cart.updateOne(
        { user_id: req.user._id },
        {
          $push: {
            products: {
              product_id: req.body.product_id,
              quantity: req.body.quantity,
              variation: req.body.variation,
            },
          },
        },
        {
          returnDocument: "after",
        }
      )
        .then((doc) => {
          res.status(201).json({
            success: true,
            // message: `Added ${doc.modifiedCount} item to cart.`,
            // ...doc,
          });
        })
        .catch((e) => {
          res.status(500).json({
            success: false,
            message: "An error occured here",
            error: e,
          });
        });
    }
  },
  updateCart: async (req, res) => {
    let query = {};
    let updateObject = {};

    if (req.body.variation) {
      query = {
        ...query,
        "product.variation": req.body.variation.old,
      };
      updateObject = {
        ...updateObject,
        "products.$[product].variation": req.body.variation.new,
      };
    }
    if (req.body.quantity) {
      query = {
        ...query,
        "product.quantity": req.body.quantity.old,
      };
      updateObject = {
        ...updateObject,
        "products.$[product].quantity": req.body.quantity.new,
      };
    }

    // Check user's cart
    await Cart.updateOne(
      { user_id: req.user._id },
      {
        $set: updateObject,
      },
      {
        arrayFilters: [
          {
            "product.product_id": req.body.product_id,
            ...query,
          },
        ],
      }
    )
      .then((doc) => {
        res.status(201).json({
          success: true,
          // message: `Modified ${doc.modifiedCount} item.`,
          // ...doc,
        });
      })
      .catch((e) => {
        res.status(500).json({
          success: false,
          message: "An error occured",
        });
      });
    // Fix new cart document
  },
  deleteFromCart: async (req, res) => {
    await Cart.updateOne(
      { user_id: req.user._id },
      {
        $pull: {
          products: {
            product_id: req.body.product_id,
            variation: req.body.variation,
          },
        },
      }
    ).then((doc) => {
      res.status(201).json({
        success: true,
        message: `Removed ${doc.modifiedCount} items from cart.`,
      });
    });
  },
};
