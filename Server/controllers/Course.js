const Course = require("../models/Course")
const Tag = require("../models/Category")
const User = require("../models/User")
const Category = require("../models/Category");
const {uploadImageToCloudinary} = require("../utils/imageUploader")

//create course handler function
exports.createCourse = async (req, res) => {
    try{
        //data fetch
        let { courseName, courseDescription, whatYouWillLearn, 
            price, tag, category, status, instructions } = req.body;
        
        //file fetch--the thumbnail
        const thumbnail = req.files.thumbnailImage 

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if (!status || status === undefined) {
			status = "Draft";
		}

        //validation -- instructor
        const userId = req.user.id;

        const instructorDetails = await User.findById(userId, {accountType: "Instructor",});
        // console.log("Instructor : ", instructorDetails)

        if(!instructorDetails){
            res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }

        //validation -- tag
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            res.status(404).json({
                success: false,
                message: "Category details not found",
            });
        }

        // img upload
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        //db entry
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
			instructions: instructions,
        })

        //add course to user schema
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    course: newCourse._id
                }
            },
            {new: true}
        )

        //add course to category schema
        await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push:{
                    course: newCourse._id
                }
            },
            {new: true}
        )

        //return response
        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            newCourse
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the course, please try again later"
        });
    }
};

//get all courses function
exports.getAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({}, { courseName: true,
                                                    price:true,
                                                    thumbnail: true,
                                                    instructor: true,
                                                    ratingAndReview: true,
                                                    studentsEnrolled: true,  })
                                                    .populate('instructor')
                                                    .exec()
        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched",
            allCourses
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching all courses, please try again later"
        });
    }
};

//getCourseDetails;
exports.getCourseDetails = async (req, res) => {
    try{
        //fetch data
        const {courseId} = req.body;

        //validate
        if(!courseId){
            return res.status(500).json({
                success: false,
                message: "Course not found"
            });
        };

        const courseDetails = await Course.findById(courseId).populate({
                path:"instructor",
                populate:{
                    path: "additionalDetails"
                }
            })
            .populate({path: "courseContent",
                populate:{
                    path: "subSection"
                }
            })
            .populate("category")
            // .populate("ratingAndReview")
            // .populate("studentsEnrolled")
            .exec();

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Cant get the course with course id: ${courseId}`
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched succesfully",
            courseDetails
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

