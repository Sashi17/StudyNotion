const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const Cloudinary = require("cloudinary").v2
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.createSubSection = async (req, res) => {
    try{
        //data fetch
        const { sectionId, title, description} = req.body;

        //extract file/video
        const video = req.files.videoFile;

        //data validation
        if ( !sectionId || !title || !description || !video ){
            return res.status(400).json({
                success: false,
                message: "All the fields are required"
            });
        }

        //upload to cloudinary --> function already made inside utils
        const uploadVideo = await uploadImageToCloudinary (video, process.env.FOLDER_NAME);

        //create subsection
        const subSectionDetails = await SubSection.create({
            title: title,
            description: description,
            timeDuration: `${uploadVideo.duration}`,
            videoURL: uploadVideo.secure_url,
        });

        //push into section
        const updatedSection = await Section.findByIdAndUpdate(sectionId, { 
                    $push:{ subSection: subSectionDetails._id, } 
                }, {new: true} )
                    .populate("subSection");
        //send res
        return res.status(200).json({
            success: true,
            message: "Sub-Section created Successfully",
            updatedSection
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Error while creating Sub - section"
        });
    }
};

//update subsection -- HW
exports.updateSubSection = async (req, res) => {
    try{
        //data imput
        //HUME KAISE PATA CHALEGA KONSA DATA AAYA HE ? --> AGAR SABKO FETCH KAR DENGE TOH BAAKI EMPTY HO JAYEGA
        //make default empty --> doesnt solve the problem
        //SOL --> 1) sub section id     2) subsection correspondoing to id
        //3) set default as prev i.e. title = pre.title ???

        const {title, description, sectionId} = req.body;
        
        const subSection = await subSection.findbyId(sectionId)

        //data validate --> dont need to validate other attributes
        if( !subSection ){
            return res.json({
                success: false,
                message: "Subsection not found"
            });
        }

        //update data
        if (title !== undefined) {
            subSection.title = title
        }
        if (description !== undefined) {
            subSection.description = description
        }
        
        //ek hi line me fecthing and validating
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
              video,
              process.env.FOLDER_NAME
            );
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }
        await subSection.save()

        //return response
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            updatedSection
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Unable to update section"
        });
    }
};

//HOW TO SCHEDULE A DELETE OPERATION ? like delete after 5 days.. etc ---> using cronjob

//delete subsection
exports.deleteSubSection = async (req, res) => {
    try{
        //find id 
        const{ subSectionId, sectionId } = req.params;

        // delete by id
        const subSection = await SubSection.findByIdAndDelete({subSectionId});
        if (!subSection) {
            return res.status(404).json({
                success: false, 
                message: "SubSection not found" })
        }
        //TODO(while testing) --> do we need to delete the entry of id from the course schema also ?? --> same as section
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subSectionId,
              },
            })

        //send response
        return res.status(200).json({
            success: true,
            message: "Sub-Section Deleted Successfully",
            updatedCourse
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Unable to delete Sub section"
        });
    }
};
