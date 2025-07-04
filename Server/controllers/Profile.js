const Profile = require("../models/Profile")
const User = require("../models/User")
const Course = require("../models/Course")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/convertSecondsToDuration")


exports.updateProfile = async (req, res) => {
    try{
        //fetch data + userid
        //here perviously others are null.. thus updated is used rather than create
        const { dateOfBirth="", about="", contactNumber, gender } = req.body;
        const id = req.user.id;

        //validate
        // if( !contactNumber || !gender || !id){
        //     return res.json({
        //         success: false,
        //         message: "Missing data"
        //     });
        // }

        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId)

        //--OR--
        //const profileDetails = await Profile.findById(additionalDetails)

        //update
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        //send res
        return res.status(200).json({
            success: true,
            message: "Profile updated Successfully",
            profileDetails
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Unable to update Profile"
        });
    }
};

//delete acc
exports.deleteAccount = async(req, res) => {
    try{
        //get id
        // console.log("Printing ID: ", req.user.id);
        const id = req.user.id;

        //validate
        const user = await User.findById({_id: id});
        if(!user){
            return res.json({
                success: false,
                message: "Account not present",
            });
        }

        //delete profile
        await Profile.findByIdAndDelete({_id: user.additionalDetails});

        //what is CRONJOB;
        //A cron job is a scheduled task that runs automatically at specified time intervals on a Unix-based system.

        // TODO: Find More on Job Schedule 
        // Cron-style Scheduling
		// const job = schedule.scheduleJob("10 * * * * *", function () {   //-->runs every 10 sec 
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);

        //HW : TODO: unenroll user from all enrolled courses
        // const enrolled = user.courses
        // await Course.findByIdAndDelete({enrolled});

        //delete acc
        await User.findByIdAndDelete({_id: id});

        //response
        return res.status(200).json({
            success: true,
            message: "Account deleted Successfully",
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Unable to delete Profile"
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try{
        //get id
        const id = req.user.id;

        //validate and get user details
        const details = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "Fetched all users Successfully",
            data: details,
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

//update display picture
exports.updateDisplayPicture = async (req, res) => {
    try{
        const pic = req.files.pic;

        // if(!pic){
        //     return res.status(500).json({
        //         success: false,
        //         message: "enter a valid picture"
        //     });
        // }

        //upload to cloudinary
        const image = await uploadImageToCloudinary(
            pic,
            process.env.FOLDER_NAME,
            1000,
            1000
        );
        console.log(image);

        //updation
        const updatedPic = await User.findByIdAndUpdate({_id: req.user.id}, 
            { image: image.secure_url }, { new: true })
        
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedPic,
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Cant update picture"
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    }).populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

    userDetails = userDetails.toObject()
    // console.log("USER DETAILS>>>>>>>>>>", userDetails)
    var SubsectionLength = 0

    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        
        userDetails.courses[i].totalDuration = convertSecondsToDuration( totalDurationInSeconds )
        
        SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({ courseID: userDetails.courses[i]._id,  userId: userId, })

      courseProgressCount = courseProgressCount?.completedVideos.length

      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round( (courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
