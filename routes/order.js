const express = require("express");
const orderRoute = express.Router();
const passport = require("passport");
const _ = require("lodash");
const {
  retrieveOrders,
  createOrder,
} = require("../controllers/orderController");
orderRoute.all(
  "/",
  (req, res, next) => {
    if (req.headers.authorization) {
      next();
    } else {
      res.status(400).json({
        authentication: false,
        message: "You need to have a token. Follow the link to get one.",
        link: {
          href: "/auth/login",
        },
      });
    }
  },
  passport.authenticate("jwt", { session: false })
);
orderRoute
  .route("/")
  .get(
    // Retrieves the orders made by client.
    async (req, res, next) => {
      let orders;
      await retrieveOrders(req.user._id).then((order) => {
        orders = order;
        res.json(orders);
      });
    }
  )
  .post(
    (req, res, next) => {
      if (req.body.location) {
        req.body.location = _.trim(req.body.location);
      } else {
        res.status(400).json({ message: "Location cannot be empty." });
      }
      if (req.body.extra_info) {
        req.body.extra_info = _.trim(req.body.extra_info);
      }
      next();
    },
    // Creates an order for the client.
    async (req, res, next) => {
      let params = {
        user_id: req.user._id,
        location: req.body.location,
      };
      if (req.body.extra_info) {
        params = {
          ...params,
          extra_info: req.body.extra_info,
        };
      }
      if (req.body.products) {
        params = {
          ...params,
          products,
        };
      }
      await createOrder(params.user_id, params.location, params.extra_info)
        .then((orderDoc) => {
          res.status(201).json({ message: "Order Created", ...orderDoc });
        })
        .catch((e) => {
          if (e) {
            console.log(e);
            res
              .status(400)
              .json({ message: "Cart is empty. No products found." });
          }
        });
    }
  );

module.exports = orderRoute;
