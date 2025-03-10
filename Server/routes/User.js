const express = require("express")
const router = express.Router()

const { sendotp, signup, login, changepw } = require("../controllers/Auth");
const { resetpwtoken, resetpw } = require("../controllers/ResetPw");
const { auth, isAdmin } = require("../middlewares/auth");

// Routes for Login, Signup, and Authentication
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
router.post("/signup", signup)
router.post("/login", login)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

// Route for Changing the password
router.post("/changepw", auth, changepw)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************
// Route for generating a reset password token

router.post("/resetpasswordtoken", resetpwtoken)

// Route for resetting user's password after verification
router.post("/resetpassword", resetpw)

module.exports = router;