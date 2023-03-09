const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.js");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const LocalStrategy = require("passport-local");
// const crypto = require("crypto");
// const User = require("./models/User");
require("dotenv").config({ path: "config.env" });
// const dbo = require("./db/conn.js");
const productRoute = require("./routes/products.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cartRoute = require("./routes/cart.js");

// const { auth, requiresAuth } = require("express-openid-connect");
// const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const corsWhitelist = [
  "http://localhost:3000",
  "https://e-store-client.vercel.app",
  "https://savoir-care-admin.vercel.app",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (corsWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // console.log(origin);
      callback(new Error("Not allowed by CORS."));
    }
  },
};
app.use(cors(corsOptions));

app.use(cookieParser());
// Auth0

// const checkJwt = auth({
//   audience: "https://haleemah-test-api",
//   issuerBaseURL: `https://dev-qdwlfq2p.us.auth0.com/`,
// });

// app.get("/success", checkJwt, (req, res) => {
//   res.send("Login has been successful");
// });
// app.get("/profile", checkJwt, (req, res) => {
//   res.send(req.oidc.user);
// });

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

// SESSION
// app.use(
//   session({
//     secret: "secret kaewored",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.ATLAS_URI }),
//   })
// );

//PASSPORT Authentication
require("./config/passportConfig")(passport);
app.use(passport.initialize());

//ROUTES
app.use("/auth", authRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);

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

module.exports = app;
