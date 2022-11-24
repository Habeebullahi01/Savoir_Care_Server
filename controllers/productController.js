// const dbo = require("../db/conn.js");

const Product = require("../models/Product");

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
    if (req.body.tags) {
      query = { ...query, tags: req.body.tags };
    }

    // Response Limit (itemsPerPage)
    if (typeof req.body.limit) {
      itemsPerpage = req.body.limit;
    }
    // page = req.body.page - 1;
    // serialization/pagification comes after/during the `find` method

    // Filter by date
    const totalItemCount = await Product.countDocuments(query);
    const totalPageCount = Math.ceil(totalItemCount / itemsPerpage);
    req.body.page > 1
      ? req.body.page > totalPageCount
        ? (page = totalPageCount)
        : (page = req.body.page)
      : (page = 1);

    if (req.body.sortByDate) {
      // query = { ...query, dateAdded: { $gt: "2022" } };
      // sort in ascending order
      products = await Product.find(query)
        .limit(itemsPerpage)
        .sort({ dateAdded: -1 })
        .skip(itemsPerpage * (page - 1));
    } else {
      products = await Product.find(query)
        .limit(itemsPerpage)
        .skip(itemsPerpage * (page - 1));
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
  addProduct: async (req, res) => {
    const product = {
      name: req.body.name,
      description: req.body.desc,
      price: req.body.price,
      quantity: req.body.quantity,
      tags: [...req.body.tags],
      imageURL: req.body.imageURL,
      // dateAdded: req.body.date,
    };
    const newProduct = new Product(product);
    await newProduct.save().then((prod) => {
      res.json(prod);
    });
  },
  getSingleProduct: async (req, res) => {
    const result = await Product.findById(req.params.productID);
    res.json(result);
  },
};
