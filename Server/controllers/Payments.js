const {instance} = require("../config/razorpay")
const mongoose = require("mongoose")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/MailSender")
const {courseEnrollmentEmail} = require("../mails/templates/courseEnrollmentEmail");


//capture the payment and initiate the razorpay
exports.capturePayment = async (req, res) => {
    //get course and user id
    const {course_id} = req.body;
    const userId  = req.user.id;

    //validation --> courseid and coursedetails
    if(!course_id){
        return res.json({
            success: false,
            message: "Provide a valid course id"
        });
    }
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success: false,
                message: "Could not find the course"
            });
        }

        //user already paid for the same course
        const uid = new mongoose.Schema.Types.ObjectId(userId)
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "User already enrolled in the course "
            });
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.messagge
        });
    }

    //order create
    const amount = course.price
    const currency = "INR"

    const options ={
        amount: amount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try{
        //initiate the payment using razorpay
        //instance.orders.create(options) -> create a new order before proceeding with a payment.
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //send res
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
            message: "Payment Successful"
        });
    }catch(err){
        console.log(err)
        return res.json({
            success: false,
            message: "Could not initiate order"
        });
    }
};

//verify signatures
exports.verifySignatures = async (req, res) => {
    //to verify that an incoming webhook request is authentic and comes from a trusted source (e.g., Razorpay, Stripe, PayPal, GitHub).
    const webHookSecret = "12345678" //not hashed

    const signature = req.headers["x-razorpay-signature"] // Razorpay signature  // hashed

    //what is checksum
    //A checksum is a small fixed-size value (hash) used to verify data integrity. It is generated using a mathematical algorithm applied to a piece of data (e.g., a file, message, or transaction).

    //1st hash the webhook then check
    const shasum = crypto.createHmac("sha256", webHookSecret);
    shasum.update(JSON.stringify(req.body)); // to string
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("payment fulfilled")

        const { courseId, userId } = req.body.payload.entity.notes;

        try{
            //find the course and enroll student in it
            const enrolledCourse = await Course.findByIdAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled: userId}},
                {new:true},
            );
            if(!enrolledCourse){
                //send res
                return res.status(500).json({
                    success: false,
                    message: "Course not found"
                });
            }
            console.log(enrolledCourse)

            //find the student and enroll course in courses enrolled
            const enrolledStudent = await User.findByIdAndUpdate(
                {_id: userId},
                {$push: {courses: courseId}},
                {new:true},
            );
            console.log(enrolledStudent)

            //confirmation mail send
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulation and celebrations",
                "You enrolled in a course"
            );
            return res.status(200).json({
                success: true,
                message: "Signature verified and course added"
            });
        }catch(err){
            //send res
            console.log(err)
            return res.json({
                success: false,
                message: "Something went wrong"
            });
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid request"
        });
    }
};
