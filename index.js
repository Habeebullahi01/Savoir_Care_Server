const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const User = require("./models/User");
require("dotenv").config({ path: "config.env" });
// const dbo = require("./db/conn.js");
const productRoute = require("./routes/products.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
app.use(express.json());
//DATABASE CONNECTION
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
//SESSION
const sessionStore = new MongoStore({
  // clientPromise: connection,
  mongoUrl: process.env.ATLAS_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cart: {
      prod1: "First product",
    },
    cookie: {
      maxAge: 360000 * 5 * 10,
    },
  })
);
//ROUTES
app.use("/products", productRoute);
app.use("/auth", authRoute);
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

app.listen(4000, () => {
  // connect to database
  // dbo.connectToServer((err) => {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
  connection
    .then(() => {
      console.log("Server is running on port 4000");
    })
    .catch((err) => {
      console.log(
        "The server was unable to start for the following reason: " + err
      );
    });

  // console.log("server is running");
});
