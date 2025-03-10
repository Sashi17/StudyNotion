const mongoose = require("mongoose")

//it is the additional details of the user
const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:String,
        trim: true,
    }
})

module.exports = mongoose.model("Profile", profileSchema)