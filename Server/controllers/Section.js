const Section = require("../models/Section")
const Course = require("../models/Course")
const SubSection = require("../models/SubSection");

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
        //data input
        const {sectionName, sectionId, courseId } = req.body;

        //data validate
        // if( !sectionName || !sectionId){
        //     return res.json({
        //         success: false,
        //         message: "Missing details"
        //     });
        // }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName: sectionName}, {new: true});
        
        const course = await Course.findById(courseId)
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection",
                                                },
                                            })
                                            .exec();

        //return response
        return res.status(200).json({
            success: true,
            message: section,
            data: course
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

        await Course.findByIdAndUpdate(courseId, {
			$pull: {
				section: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		// console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}
		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

        //send response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
            data: course,
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Unable to delete section"
        });
    }
};