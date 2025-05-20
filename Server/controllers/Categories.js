const Category = require("../models/Category")
const Course = require("../models/Course")
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

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
        const { categoryId } = req.body

        //get all courses for id
        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
          }).exec()

        // console.log("selectedCategory>>>>>>",selectedCategory)

        //validation
        if(!selectedCategory){
            console.log("Category not found.")
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
            })
        }

        //get courses of diff category
        const categoriesExceptSelected = await Course.find({ _id: {$ne: categoryId}, });
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id )
            .populate({
              path: "courses",
              match: { status: "Published" },
            })
            .exec()

        // HW TODO: get top 10 selling courses
        // const top10 = Course.find({}).sort({studentEnrolled: -1}).limit(10);

        const allCategories = await Category.find()
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
                path: "instructor",
            },
        }).exec()
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)

        return res.status(200).json({
            success: true,
            message: "fetched category page details",
            data:{
                differentCategory, 
                selectedCategory,
                mostSellingCourses
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

