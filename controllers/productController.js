// const dbo = require("../db/conn.js");

const Product = require("../models/Product");
const _ = require("lodash");

module.exports = {
  getProducts: async (req, res) => {
    let products;
    let itemsPerpage = 15;
    let page = 1;
    // let db_connect = dbo.getDB();
    // db_connect
    //   .collection("products")
    //   .find({})
    //   .toArray((err, result) => {
    //     if (err) throw err;
    //     res.json(result);
    //   });

    //                QUERY CONSTRUCTION
    let query;
    // Filter by tag(s)
    if (req.query.tags) {
      query = { ...query, tags: req.query.tags };
    }

    // Response Limit (itemsPerPage)
    // if (typeof req.body.limit) {
    //   itemsPerpage = req.body.limit;
    // }
    // page = req.body.page - 1;
    // serialization/pagification comes after/during the `find` method

    // Filter by date
    const totalItemCount = await Product.countDocuments(query);
    const totalPageCount = Math.ceil(totalItemCount / itemsPerpage);
    req.query.page > 1
      ? req.query.page > totalPageCount
        ? (page = totalPageCount)
        : (page = req.query.page)
      : (page = 1);

    if (req.query.sortByDate) {
      // query = { ...query, dateAdded: { $gt: "2022" } };
      // sort in ascending order
      products = await Product.find(
        query,
        { name: 1, imageURL: 1, price: 1 },
        {
          limit: itemsPerpage,
          sort: dateAdded - 1,
          skip: itemsPerpage * (page - 1),
        }
      );
    } else {
      products = await Product.find(
        query,
        { name: 1, imageURL: 1, price: 1 },
        { limit: 15, skip: itemsPerpage * (page - 1) }
      );
      // .limit(itemsPerpage)
    }
    /* 
      DATA TO RETURN
      - statusCode
      - itemsPerPage
      - totalItemCount
      - pageNum
      - totalPageCount
      - pageItems/cursor
    */
    res.status(200).json({
      totalItemCount,
      itemsPerpage: itemsPerpage,
      pageNumber: page,
      totalPageCount,
      products,
    });
  },
  getSingleProduct: async (req, res) => {
    const result = await Product.findById(req.params.productID);
    res.status(200).json(result);
  },
  addProduct: async (req, res) => {
    const reqBody = req.body;
    // console.log(req.body);
    const product = {
      name: _.trim(reqBody.productName),
      description: _.trim(reqBody.description),
      price: reqBody.price,
      quantity: reqBody.quantity,
      tags: req.body.tags,
      imageURL: reqBody.imageURL,
      // dateAdded: req.body.date,
    };
    const newProduct = new Product(product);
    // console.log(req.get("referer"));
    await newProduct.save().then((prod) => {
      // res.redirect(`back`);
      res.redirect(`${req.get("referer")}products/${prod._id}`);
    });
  },
  updateProduct: async (req, res) => {
    // update by id
    const product = {
      name: _.trim(req.body.productName),
      description: _.trim(req.body.description),
      price: req.body.price,
      quantity: req.body.quantity,
      tags: req.body.tags,
      imageURL: req.body.imageURL,
      // dateAdded: req.body.date,
    };
    // console.log(product);
    // const newProduct = new Product(product);
    // await newProduct.save().then((prod) => {
    //   res.redirect(`/products/${prod._id}`);
    // });
    await Product.updateOne({ _id: req.params.id }, { $set: product })
      .then((prod) => {
        res.redirect(`${req.get("referer")}products/${req.params.id}`);
        // res.send("Update successfull");
      })
      .catch((err) => {
        res.json({ "Error while updating: ": err });
      });
  },
};
