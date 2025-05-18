const {instance} = require("../config/razorpay")
const mongoose = require("mongoose")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/MailSender")
const {courseEnrollmentEmail} = require("../mails/templates/courseEnrollmentEmail");
const crypto = require("crypto");
const { paymentSuccessEmail } = require("../mails/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")


// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    const { courses } = req.body
    const userId = req.user.id
    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" })
    }

    let total_amount = 0

    for (const course_id of courses) {
        let course
        try {
            // Find the course by its ID
            course = await Course.findById(course_id)

            // If the course is not found, return an error
            if (!course) {
                return res.status(200).json({ success: false, message: "Could not find the Course" })
            }

            // Check if the user is already enrolled in the course
            const uid = new mongoose.Types.ObjectId(userId)
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({ success: false, message: "Student is already Enrolled" })
            }

            // Add the price of the course to the total amount
            total_amount += course.price
        } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
        }
    }

    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }
    try {
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        res.json({
        success: true,
        data: paymentResponse,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Could not initiate order." })
    }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses

    const userId = req.user.id

    if ( !razorpay_order_id || !razorpay_payment_id || !razorpay_signature ||
        !courses || !userId ) {
        return res.status(200).json({ success: false, message: "Payment Failed" })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res)
        return res.status(200).json({ success: true, message: "Payment Verified" })
    }

    return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body

    const userId = req.user.id

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the details" })
    }

    try {
        const enrolledStudent = await User.findById(userId)

        await mailSender( enrolledStudent.email, `Payment Received`,
            paymentSuccessEmail( `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100, orderId, paymentId )
        )
    } catch (error) {
        console.log("error in sending mail", error)
        return res.status(400).json({ success: false, message: "Could not send email" })
    }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }

    for (const courseId of courses) {
        try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
            { _id: courseId },
            { $push: { studentsEnroled: userId } },
            { new: true }
        )

        if (!enrolledCourse) {
            return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)

        const courseProgress = await CourseProgress.create({
            courseID: courseId,
            userId: userId,
            completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
            userId,
            {
            $push: {
                courses: courseId,
                courseProgress: courseProgress._id,
            },
            },
            { new: true }
        )

        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
            )
        )
        console.log("Email sent successfully: ", emailResponse.response)
        } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
        }
    }
}

// //capture the payment and initiate the razorpay
// exports.capturePayment = async (req, res) => {
//     //get course and user id
//     const {course_id} = req.body;
//     const userId  = req.user.id;

//     //validation --> courseid and coursedetails
//     if(!course_id){
//         return res.json({
//             success: false,
//             message: "Provide a valid course id"
//         });
//     }
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success: false,
//                 message: "Could not find the course"
//             });
//         }

//         //user already paid for the same course
//         const uid = new mongoose.Schema.Types.ObjectId(userId)
//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success: false,
//                 message: "User already enrolled in the course "
//             });
//         }
//     }catch(err){
//         console.log(err)
//         return res.status(500).json({
//             success: false,
//             message: err.messagge
//         });
//     }

//     //order create
//     const amount = course.price
//     const currency = "INR"

//     const options ={
//         amount: amount*100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         //instance.orders.create(options) -> create a new order before proceeding with a payment.
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         //send res
//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//             message: "Payment Successful"
//         });
//     }catch(err){
//         console.log(err)
//         return res.json({
//             success: false,
//             message: "Could not initiate order"
//         });
//     }
// };

// //verify signatures
// exports.verifySignatures = async (req, res) => {
//     //to verify that an incoming webhook request is authentic and comes from a trusted source (e.g., Razorpay, Stripe, PayPal, GitHub).
//     const webHookSecret = "12345678" //not hashed

//     const signature = req.headers["x-razorpay-signature"] // Razorpay signature  // hashed

//     //what is checksum
//     //A checksum is a small fixed-size value (hash) used to verify data integrity. It is generated using a mathematical algorithm applied to a piece of data (e.g., a file, message, or transaction).

//     //1st hash the webhook then check
//     const shasum = crypto.createHmac("sha256", webHookSecret);
//     shasum.update(JSON.stringify(req.body)); // to string
//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("payment fulfilled")

//         const { courseId, userId } = req.body.payload.entity.notes;

//         try{
//             //find the course and enroll student in it
//             const enrolledCourse = await Course.findByIdAndUpdate(
//                 {_id: courseId},
//                 {$push: {studentsEnrolled: userId}},
//                 {new:true},
//             );
//             if(!enrolledCourse){
//                 //send res
//                 return res.status(500).json({
//                     success: false,
//                     message: "Course not found"
//                 });
//             }
//             console.log(enrolledCourse)

//             //find the student and enroll course in courses enrolled
//             const enrolledStudent = await User.findByIdAndUpdate(
//                 {_id: userId},
//                 {$push: {courses: courseId}},
//                 {new:true},
//             );
//             console.log(enrolledStudent)

//             //confirmation mail send
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulation and celebrations",
//                 "You enrolled in a course"
//             );
//             return res.status(200).json({
//                 success: true,
//                 message: "Signature verified and course added"
//             });
//         }catch(err){
//             //send res
//             console.log(err)
//             return res.json({
//                 success: false,
//                 message: "Something went wrong"
//             });
//         }
//     }
//     else{
//         return res.status(400).json({
//             success: false,
//             message: "Invalid request"
//         });
//     }
// };
