const Category = require("../models/Category")
const Course = require("../models/Course")

exports.createCategory = async (req, res) => {
    try{
        //fetch data
        const {name, description} = req.body;

        //validation
        if( !name || !description ){
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."})
        }

        //create entry in db
        const details = await Category.create({
            name: name,
            description: description,
        });
        console.log(details);

        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        });

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//get all Categorys
exports.getAllCategory = async(req, res) => {
    try{
        const allCategories = await Category.find({}, {name:true, description: true});
        return res.status(200).json({
            success: true,
            message: "All Categorys fetched Successfully",
            data: allCategories,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//category page details
exports.categoryPageDetails = async (req, res) => { 
    try{
        //get categoryid
        const {categoryId} = req.body

        //get all courses for id
        const selectedCategory = await Course.findById(categoryId).populate("courses").exec()

        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        //get courses of diff category
        const diffCategory = await Course.find({ _id: {$ne: categoryId}, }).populate("courses").exec();

        // HW TODO: get top 10 selling courses
        const top10 = Course.find({}).sort({studentEnrolled: -1}).limit(10);


        return res.status(200).json({
            success: true,
            message: "fetched category page details",
            data:{
                diffCategory, 
                selectedCategory,
                top10
            },
        });

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "cant fetch category page details"
        });
    }
};

