const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true,
    },
    description:{
        type:String,
    },
    //actually it should be courses... but needed many changes.. so run ho rha he toh hone do
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]
});

module.exports = mongoose.model("Category", categorySchema);