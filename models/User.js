const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  f_name: String,
  l_name: String,
  email: String,
  password: String, // or Number?
  salt: String, // or Number?
  // I think it depends on what
  date_joined: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

/**
 * @openapi
 * components:
 *  schemas:
 *    SignupRequest:
 *      type: object
 *      properties:
 *        f_name:
 *          type: string
 *          example: Jane
 *        l_name:
 *          type: string
 *          example: Doe
 *        email:
 *          type: string
 *          example: janedoe@example.com
 *        password:
 *          type: string
 *          example: 12345678
 *    SignupResponse:
 *      type: object
 *      properties:
 *        auth:
 *          type: string
 *          example: true
 *        msg:
 *          type: string
 *          example: Success
 *        token:
 *          type: string
 *          example: Bearer pwijepwjfpewjfwe6w54fwef6we4ef64wf6e4w6f46w4ef6wf6w4f4wf64w6f4w6f4w6ef6w4f64ws
 *    LoginRequest:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          example: janedoe@example.com
 *        password:
 *          type: string
 *          example: 12345678
 */
