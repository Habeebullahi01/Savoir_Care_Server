const express = require("express");
const mongoose = require("mongoose");
// const config = require("./utils/keys.js");
const authRoute = require("./routes/auth.js");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "config.env" });
const productRoute = require("./routes/products.js");
const cartRoute = require("./routes/cart.js");
const orderRoute = require("./routes/order.js");
// const swaggerUI = require("swagger-ui-dist").SwaggerUIBundle;
const swaggerDocs = require("./utils/swagger.js").swaggerDocs;
// const { auth, requiresAuth } = require("express-openid-connect");
// const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

const app = express();
// app.use((req, res, next) => {
//   config
//     .then(() => {
//       console.log("Files downloaded!");
//       next();
//     })
//     .catch((e) => {
//       console.log("Unable to download files!");
//       console.log(e);
//     });
// });
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
      callback(new Error("Not allowed by CORS."));
    }
  },
};
app.use(cors());

app.use(cookieParser());

//DATABASE CONNECTION
// const connection = new Promise((resolve, reject) => {
//   try {
//     mongoose.connect(process.env.ATLAS_URI, {}, (err) => {
//       if (err) {
//         //  console.error("Unable to connect " + err);
//         reject("Unable to connect to Database: " + err);
//       } else {
//         console.log("Successfully Connected to DB");
//         resolve();
//       }
//     });
//   } catch (error) {
//     console.log("Connection error:" + err);
//   }
// });

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
app.use("/order", orderRoute);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // connect to database
  connection
    .then(() => {
      // console.log("Successfully connected to DB");
      console.log("Database Connection Established. Server is running");
    })
    .catch((err) => {
      console.log(
        "The server was unable to start for the following reason: " + err
      );
    });
  swaggerDocs(app, PORT);
});

module.exports = app;
