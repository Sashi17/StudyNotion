const express = require("express")
const router = express.Router()

const { updateProfile, deleteAccount, getAllUserDetails,
    updateDisplayPicture, getEnrolledCourses,  instructorDashboard,} = require("../controllers/Profile")

const { auth, isAdmin, isInstructor } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router;