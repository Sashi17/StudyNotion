const mongoose = require("mongoose");
const mailSender = require("../utils/MailSender");
const emailTemplate = require("../mails/templates/emailVerificationTemplate")

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires: 5*60, // The document will be automatically deleted after 5 minutes of its creation time
    }
});

//function to send emails
async function sendVerificationMail(email, otp) {
    try{
        //mailSender(`receiver email` , `title` , `sending otp`)
        const response = await mailSender(
            email,
            "Verification email for login", 
            emailTemplate(otp)
        );
        console.log("Email sent successfully:", response.response);
    }
    catch(err){
        console.log("Error while sending mail: ", err);
        throw err;
    }
};
//pre --> Runs before an operation, allowing modifications or validations.
//save--> document middleware --> Runs before the document is saved.

//In your code, the otpSchema.pre("save", ...) hook means the function to send the verification email will execute before the OTP document is saved. This ensures the email with the OTP is sent as soon as the OTP is created, right before persisting to the database. After email sending, next() continues to save the document.
otpSchema.pre("save", async function(next){
    await sendVerificationMail(this.email, this.otp);
    next();
});
const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;