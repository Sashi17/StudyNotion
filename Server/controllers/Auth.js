const User = require("../models/User");
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const Profile = require("../models/Profile")
const mailSender = require('../utils/MailSender')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {passwordUpdated} = require("../mails/templates/passwordUpdate")
require("dotenv").config()

//send otp For Email Verification
exports.sendotp = async (req, res) => {
    try{
        //fetch email
        const {email} = req.body;

        //check is user exists
        const userExists = await User.findOne({email});

        //if already exists ... give a response
        if(userExists){
            return res.status(401).json({
                success: false,
                message: "User already registered",
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6 , {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated: ", otp);

        //otp unique or not
        let result = await OTP.findOne({otp: otp});

        //if otp exists previously in the db --> geenerate a new one
        while(result){
            otp = otpGenerator.generate(6 , {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp}

        //create an entry in db
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent Successfully",
            otp
        });
    }catch(err){
        console.log("Error while sending OTP: ", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//signup
exports.signup = async (req, res) => {
    try{
        //data fetch from req
        const { firstName, lastName,
            email, pw, confirmPw, 
            accountType, contactNumber, otp
        } = req.body;

        //validate the data
        if( !firstName || !lastName || !email || !pw || !confirmPw || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required to fill"
            })
        }

        // check 2 pws
        if( pw !== confirmPw ){
            return res.status(403).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again."
            });
        }

        //check user exists or not
        const exists = await User.findOne({email});
        if(exists){
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue."
            });
        }

        // find most recent otp in db for thr email
        // sort documents in descending order based on the createdAt field.
		// limit(1) --> retrieve only one document from the database.
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);

        //validate otp
        if(recentOtp.length == 0){
            return res.status(400).json({
                success: false,
                message: "No otp found",
            })
        }else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        //hash pw
        const hashPw = await bcrypt.hash(pw, 10);

        // Create the user
        //SAMAJH NAHI AAYA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        //create entry in db
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })
        const user = await User.create({
            firstName, lastName,
            email, contactNumber,
            pw: hashPw,
            approved: approved,
            accountType,
            additionalDetails: profileDetails._id,
            //img is stored as starting letter of name.. Sashikanta Pattanaik --> SP
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        })

        return res.status(200).json({
            success: true,
            message: "User is registered Successfully",
            user,
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "user cant be registered, please try again"
        })
    }
};

//login
exports.login = async(req, res) => {
    try{
        //fetch from req
        const {email, pw} = req.body;

        //validation
        if( !email || !pw ){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        //check user exits or not
        //populate fucntion here is not needed(not compulsory)
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered"
            })
        }

        //generate jwt, compare pw
        if(await bcrypt.compare(pw, user.pw)){
            const payload = {
                email:user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,
                { expiresIn: '24h' },
            );

            // Save token to user document in database
            user.token = token;
            user.pw = undefined;

            //cookie generate and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                // prevents client-side scripts from accessing the cookie. This helps protect cookies from being stolen by malicious scripts. 
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message: "Loggged In Successfully"
            })
        }else{
            res.status(401).json({
                success: false,
                message: "Incorrect Password"
            })
        }
    }catch(err){
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Error occurred, please try again later"
        })
    }
};

//change pw
exports.changepw = async (req, res) => {
    try{
        // Get user data from req.user
		const userDetails = await User.findById(req.user.id);

        //fetch data(oldPw, newPw, confirmNewPw) from req
        const { oldPw, newPw, confirmNewPw } = req.body;
        //validation
        if(!oldPw || !newPw || !confirmNewPw){
            return res.status(403).json({
                success: false,
                message: "All fields are required to fill"
            })
        }

        //validate old pw
        const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
        if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({ 
                success: false, 
                message: "The old password is incorrect" 
            });
		}
        if(newPw !== confirmNewPw){
            return res.status(400).json({
                success: false,
                message: "Passwords not matching"
            })
        }

        //update pw in db
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedDb = await User.findByIdAndUpdate( req.user.id, 
            {password: encryptedPassword }, {new: true} )

        //send mail- pw updated
        try {
			const emailResponse = await mailSender(
				updatedDb.email,
				passwordUpdated(
					updatedDb.email,
					`Password updated successfully for ${updatedDb.firstName} ${updatedDb.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

        //send response
        console.log(err);
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
            updatedDb
        })
    }catch(err){
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Error occurred, Password cant be changed"
        })
    }
};
