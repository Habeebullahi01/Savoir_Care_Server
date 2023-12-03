const mongoose = require("mongoose");

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
 *
 */
const AdminSchema = new mongoose.Schema({
  f_name: String,
  l_name: String,
  email: String,
  password: String,
  salt: String,
  date_joined: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: true },
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
