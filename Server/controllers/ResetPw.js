const User = require("../models/User")
const mailSender = require("../utils/MailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

//reset pw token
exports.resetpwtoken = async(req, res) => {
    try{
        //get email from req body
        const email = req.body.email;

        //email validation
        const exists = await User.findOne({email: email}).populate();
        if(!exists){
            res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }

        //generate token --> crypto is inbuilt
        //A UUID (Universally Unique Identifier) is a 128-bit identifier that is globally unique.
        // const token = crypto.randomUUID();

        const token = crypto.randomBytes(20).toString("hex");

        //update user by adding token and expiration time
        const updated = await User.findOneAndUpdate( {email: email}, {
                token: token,
                resetPwExpires: Date.now() + 3600000,
            }, { new: true } );
        console.log("DETAILS", updated);

        //create url
        const url = `http://localhost:3000/update-password/${token}` 

        //send mail
        await mailSender(email, 
            "Password reset mail", 
            `Your Link for email verification is ${url}. Please click this url to reset your password.` );

        //return response
        res.json({
            success: true,
            message: "Mail sent successfully"
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later"
        });
    }
};

//reset pw
exports.resetpw = async (req, res) => {
    try{
        //fetch data
        const { pw, confirmPw, token } = req.body;

        //validation
        if(pw !== confirmPw){
            res.json({
                success: false,
                message: "Password not matching"
            });
        }
        
        //get userdetails from db using token
        const user = User.findOne({token: token});

        //if no entry -invalid token
        if( !user ){
            res.json({
                success: false,
                message: "Token is invalid"
            });
        }

        //token time expiry
        if(user.resetPwExpires < Date.now() ){
            res.json({
                success: false,
                message: "Token expired, please regerate"
            });
        }

        //hash pwd
        const hashpw = await bcrypt.hash(pw, 10);

        //pw update
        await User.findOneAndUpdate(
            {token: token},
            {pw: hashpw},
            {new:true}
        )

        //return response
        res.json({
            success: true,
            message: "Password successfully changed"
        }); 


    }catch(err){
        res.status(401).json({
            success: false,
            message: "Something went wrong, please try again later"
        });
    }
};
