const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req, res) => {
    try{
        //data fetch
        const {sectionName, courseId} = req.body;

        //data validation
        if( !sectionName || !courseId ){
            return res.status(400).json({
                success: false,
                message: "All the fields are required"
            });
        }
        
        //create section
        const newSection = await Section.create({sectionName});
        
        //how to populate section and subsection simultaneously 
        /* Course.find().populate({
                    path: "sections",
                    populate: { path: "subsections" } // Nested populate for subsections
        }) */

        //update course with section
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { 
                $push:{
                        courseContent: newSection._id,
                    }
                }, {new: true} )
                .populate({
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                })
                .exec();

        //send response
        return res.status(200).json({
            success: true,
            message: "Section Created Successfully",
            updatedCourse
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Unable to create section"
        });
    }
};

exports.updateSection = async (req, res) => {
    try{
        //data imput
        const {sectionName, sectionId} = req.body;

        //data validate
        if( !sectionName || !sectionId){
            return res.json({
                success: false,
                message: "Missing details"
            });
        }

        //update data
        const updatedCourse = await Section.findByIdAndUpdate(sectionId, {sectionName: sectionName}, {new: true});
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            updatedCourse
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Unable to update section"
        });
    }
};

exports.deleteSection = async (req, res) => {
    try{
        //find id --> assume that sending id in params
        //HW --> also do by req.params
        const{ sectionId, courseId } = req.body;

        // delete by id
        const updatedsec = await Section.findByIdAndDelete(sectionId);
        console.log(updatedsec)
        
        //TODO(while testing) --> do we need to delete the entry of id from the course schema also ??
        //if a Section is referenced in the Course model, you need to manually remove the reference (ObjectId) from the Course schema after deleting the Section.
        const updated = await Course.updateMany(
            { course: courseId },                // Find courses containing this section ID
            { $pull: { section: sectionId } }      // Remove the section ID from array
            ); 
        
        console.log(updated)

        //send response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
            // data: updated,
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Unable to delete section"
        });
    }
};