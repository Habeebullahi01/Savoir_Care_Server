// const dbo = require("../db/conn.js");

const Product = require("../models/Product");

module.exports = {
  getProducts: async (req, res) => {
    // let db_connect = dbo.getDB();
    // db_connect
    //   .collection("products")
    //   .find({})
    //   .toArray((err, result) => {
    //     if (err) throw err;
    //     res.json(result);
    //   });
    const result = await Product.find();
    res.json(result);
  },
  addProduct: async (req, res) => {
    const product = {
      name: req.body.name,
      description: req.body.desc,
      // dateAdded: req.body.date,
    };
    const newProduct = new Product(product);
    await newProduct.save().then((prod) => {
      res.json(prod);
    });
  },
};
