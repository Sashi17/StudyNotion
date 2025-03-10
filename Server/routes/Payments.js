const express = require("express")
const router = express.Router()

const { capturePayment, verifySignatures } = require("../controllers/Payments")
const { auth, isStudent } = require("../middlewares/auth"); 

router.post("/capturePayments", auth, isStudent, capturePayment)
router.post("/verifySignatures", verifySignatures)

module.exports = router;