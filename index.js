const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.js");
require("dotenv").config({ path: "config.env" });
// const dbo = require("./db/conn.js");
const productRoute = require("./routes/products.js");

const app = express();
app.use(express.json());

app.use("/products", productRoute);
app.use("/auth", authRoute);

const connection = new Promise((resolve, reject) => {
  try {
    mongoose.connect(process.env.ATLAS_URI, {}, (err) => {
      if (err) {
        //  console.error("Unable to connect " + err);
        reject("Unable to connect to Database: " + err);
      } else {
        console.log("Successfully Connected to DB");
        resolve();
      }
    });
  } catch (error) {
    console.log("Connection error:" + err);
  }
});
app.listen(3000, () => {
  // connect to database
  // dbo.connectToServer((err) => {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
  connection
    .then(() => {
      console.log("Server is running on port 3000");
    })
    .catch((err) => {
      console.log(
        "The server was unable to start for the following reason: " + err
      );
    });

  // console.log("server is running");
});
