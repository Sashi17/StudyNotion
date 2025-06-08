const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course")
const mongoose = require("mongoose");

//create rating
exports.createRating = async (req, res) => {
    try{
        //get userid, course id from req
        const userId = req.user.id ;
        // console.log('USER ID>>>>>>>>>>', userId)
        const { rating, review, courseId } = req.body ;

        //check if user enrolled or not
        const details = await Course.findOne({ _id: courseId, studentsEnrolled: {$elemMatch: {$eq: userId }} });

        //validate
        if(!details){
            return res.status(400).json({
                success: false,
                message: "student not enrolled in course"
            });
        }

        //only 1 review possible
        const alreadyreview = await RatingAndReview.findOne({
            user:userId,
            course: courseId,
        });
        if(alreadyreview){
            return res.status(400).json({
                success: false,
                message: "student has already reviewed the course"
            });
        }

        //create a rating review
        const newrating = await RatingAndReview.create({
            rating, review, user:userId, course: courseId
        });

        //update course
        await Course.findByIdAndUpdate( courseId, {
            $push:{
                ratingAndReview: newrating._id,
            }
        }, {new: true} );

        return res.status(200).json({
            success: true,
            message: "Rating and reviewed successfully",
            newrating
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "cant create rating"
        });
    }
};

//getAverage rating
exports.getAverageRating = async (req, res) => {
    try{
        //get courseid
        const courseId = req.body.courseId  
        
        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                // courseid is in string form
                $match: {course: new mongoose.Schema.Types.ObjectId(courseId)}
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"},
                }
            },
        ]);

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                avgRating: result[0].averageRating,
            });
        };

        //if no ratings
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no one rated"
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "cant get avg rating"
        });
    }
};

//getAll ratings and reviews
exports.getAllRatings = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
            .sort({rating: "desc"})
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName"
            })
            .exec();
        return res.status(200).json({
            success: true,
            message: "All rating fetched",
            allReviews
        });     
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Can't fetch all ratings",
        });
    }
};
