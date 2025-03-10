const mongoose = require('mongoose')

const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating:{
        type:Number,
        required: true,
    },
    review:{
        type: String,
        required: true,
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required: true,
        //creates an index for that field in the DB, which improves query performance for that field
        index: true,
    }
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);