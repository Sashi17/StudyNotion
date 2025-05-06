const express = require("express")
const router = express.Router()

const { createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
 } = require("../controllers/Course");
const { createCategory, getAllCategory, categoryPageDetails } = require("../controllers/Categories");
const { createRating, getAverageRating, getAllRatings } = require("../controllers/RatingAndReview")
const { createSection, updateSection, deleteSection } = require("../controllers/Section") 
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection")

//importing authentication
const { auth, isStudent, isAdmin, isInstructor} = require("../middlewares/auth"); 

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);

//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);

//Instrcutor updates the section
router.post("/updateSection", auth, isInstructor, updateSection);

//Instrcutor deletes the section
router.post("/deleteSection", auth, isInstructor, deleteSection);

//Instrcutor creates the subsection
router.post("/addSubSection", auth, isInstructor, createSubSection);

//Instrcutor updates the section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

//Instrcutor deletes the section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

//Get all Registered Courses
router.get("/getAllCourses", getAllCourses);

//Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);

// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)

// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)

// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

// Delete a Course
router.delete("/deleteCourse", deleteCourse)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", getAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatings)

module.exports = router;