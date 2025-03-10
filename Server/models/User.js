const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        trim: true,
    },
    lastName:{
        type:String,
        required: true,
        trim: true,
    },
    email:{
        required:true,
        type: String,
        trim:true,
    },
    pw:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Student", "Instructor", "Admin"],
        required: true,
    },
    //Cant understand use of active and approve
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required:true,
    },
    token:{
        type:String,
    },
    resetPwExpires:{
        type: Date,
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    image:{
        type:String,
        required:true,
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ]
},
// Add timestamps for when the document is created and last modified
{ timestamps: true },
)

module.exports = mongoose.model("User", userSchema);