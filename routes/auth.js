const express = require("express");
const User = require("../models/User");
const Admin = require("../models/Admin");
const passport = require("passport");
// const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { signup, adminSignup } = require("../controllers/authController");
const passportController = require("../controllers/passportController");
const issueJWT = require("../utils/issueJwt");
const { verifyPassword } = require("../utils/password");
const _ = require("lodash");

// Passport Configuration

const authRoute = express.Router();

// authRoute.route("/signup").post((req, res) => {
//   const user = {
//     f_name: req.body.f_name,
//     l_name: req.body.l_name,
//     email: req.body.email,
//     password: req.body.password,
//   };
//   const newUser = new User(user);
//   newUser.save().then((obj) => {
//     res.json(obj);
//   });
// });

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "YOU SHALL NOT PASS!" });
  }
};

/**
 * @openapi
 * /auth/signup:
 *  post:
 *    tags:
 *    - Authentication
 *    summary: Creates a new customer account
 *    description: Authenticates users
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SignupRequest'
 *    responses:
 *      201:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SignupResponse'
 *            example:
 *              auth: true
 *              msg: Success
 *              token: Bearer 65dss651vsv5sv5dvs54vs11vs
 *      401:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                auth:
 *                  type: boolean
 *                invalidCred:
 *                  type: string
 *            example:
 *              auth: false
 *              msg: User already exists
 *              invalidCred: email
 */
authRoute.route("/signup").post(signup);
/**
 * @openapi
 * /auth/admin/signup:
 *  post:
 *    tags:
 *    - Authentication
 *    summary: Creates a new Administrator account.
 *    description: Authenticates administrators
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SignupRequest'
 *    responses:
 *      201:
 *        description: Signup successful
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SignupResponse'
 *            example:
 *              auth: true
 *              msg: Success
 *              token: Bearer 65dss651vsv5sv5dvs54vs11vs
 *      401:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msg:
 *                  type: string
 *                auth:
 *                  type: boolean
 *                invalidCred:
 *                  type: string
 *            example:
 *              auth: false
 *              msg: User already exists
 *              invalidCred: email
 */
authRoute.route("/admin/signup").post(adminSignup);
/**
 * @openapi
 * /auth/logout:
 *  post:
 *    tags:
 *    - Authentication
 *    summary: Logs a client out.
 *    requestBody:
 */
authRoute.route("/logout").post((req, res, next) => {
  req.logout(() => {
    res.json({ msg: "Logged Out." });
  });
});
authRoute.route("/success").get(isAuth, (req, res, next) => {
  console.log(req.user);
  res.json({ msg: "Login success" });
});
authRoute.route("/failure").get((req, res, next) => {
  res.send("Login Falied. Check credentials. ");
});

/**
 * @openapi
 * /auth/login:
 *  post:
 *    tags:
 *    - Authentication
 *    summary: Logs a user in.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginRequest'
 *    responses:
 *      200:
 *        description: Login successful.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SignupResponse'
 *      400:
 *        description: Empty request body
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/BadLoginResponse1'
 *                - $ref: '#/components/schemas/BadLoginResponse2'
 *                - $ref: '#/components/schemas/BadLoginResponse3'
 *      401:
 *        description: Invalid credential
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - type: object
 *                  properties:
 *                    message:
 *                     type: string
 *                     example: "Invalid password"
 *                    auth:
 *                     type: bool
 *                     example: false
 *                    invalidCred:
 *                     type: string
 *                     example: "password"
 *                - type: object
 *                  properties:
 *                    message:
 *                     type: string
 *                     example: "Invalid User"
 *                    auth:
 *                     type: bool
 *                     example: false
 *                    invalidCred:
 *                     type: string
 *                     example: "email"
 * components:
 *  schemas:
 *    BadLoginResponse1:
 *      type: object
 *      properties:
 *        absent_field:
 *         type: array
 *         example: ["email","password"]
 *        message:
 *         type: string
 *         example: "Request body should not be empty."
 *    BadLoginResponse2:
 *      type: object
 *      properties:
 *        absent_field:
 *         type: string
 *         example: "email"
 *        message:
 *         type: string
 *         example: "Email field should not be empty."
 *    BadLoginResponse3:
 *      type: object
 *      properties:
 *        absent_field:
 *         type: string
 *         example: "password"
 *        message:
 *         type: string
 *         example: "Password field should not be empty."
 *
 */
authRoute.route("/login").post(async (req, res, next) => {
  if (req.body == null || Object.keys(req.body).length === 0) {
    res.status(400).json({
      absent_field: ["email", "password"],
      message: "Request body should not be empty.",
    });
    // return;
  } else if (!req.body.email) {
    res.status(400).json({
      absent_field: "email",
      message: "Email field should not be empty.",
    });
    return;
  } else if (!req.body.password) {
    res.status(400).json({
      absent_field: "password",
      message: "Password field should not be empty.",
    });
    return;
  }
  // console.log(req.body);
  await User.findOne({ email: _.trim(req.body.email) })
    .then((user) => {
      if (user) {
        if (
          verifyPassword(_.trim(req.body.password), user.password, user.salt)
        ) {
          const tokenObject = issueJWT(user);
          res
            .status(200)
            .cookie("auth", tokenObject.token, {
              // expires: tokenObject.expiresIn,
              maxAge: tokenObject.maxAge,
              // httpOnly: true,
            })
            .json({
              auth: true,
              msg: "Success",
              token: tokenObject.token,
            });
          // res.status(200).json({
          //   auth: true,
          //   msg: "Success",
          // });
        } else {
          res.status(401).json({
            message: "Invalid Password",
            auth: false,
            invalidCred: "password",
          });
        }
      } else {
        res.status(401).json({
          message: "Invalid User",
          auth: false,
          invalidCred: "email",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err !== null) {
        res.json({ Error: err });
      }
      next();
    });
});
authRoute.route("/admin/login").post(async (req, res, next) => {
  await Admin.findOne({ email: _.trim(req.body.email) })
    .then((admin) => {
      if (admin && admin.isAdmin == true) {
        if (
          verifyPassword(_.trim(req.body.password), admin.password, admin.salt)
        ) {
          const tokenObject = issueJWT(admin);
          res.cookie("admin_auth", tokenObject.token, {
            maxAge: tokenObject.maxAge,
            httpOnly: true,
          });
          res.status(200).json({
            auth: true,
            msg: "Success",
            token: tokenObject.token,
          });
        } else {
          res.status(401).json({
            msg: "Invalid Password",
            auth: false,
            invalidCred: "password",
          });
        }
      } else {
        res.status(401).json({
          msg: "Invalid Admin",
          auth: false,
          invalidCred: "email",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err !== null) {
        res.json({ Error: err });
      }
      next();
    });
});

authRoute.get(
  "/status",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send("You've been Authenticated with Passport's JWT Strategy.");
  }
);

module.exports = authRoute;
