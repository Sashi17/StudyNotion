const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")

//auth
exports.auth = async (req, res, next) => {
    try{
        //extract jwt
        const token = req.cookies.token
                        || req.body.token
                        || req.header("Authorization").replace("Bearer ", ""); 
        //if token missing
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }
        
        //verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode);
            req.user = decode;
        }catch(err){
            //verification issue
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            });
        }
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Error occurred, please try again later"
        })
    }
};

//is student
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            res.status(401).json({
                success: false,
                message: "This is a protected route for students only",
            });
        }
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            success: false,
            message: "User role cant be verified , please try again later"
        })
    }
};

//is Admin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only",
            });
        }
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            success: false,
            message: "User role cant be verified , please try again later"
        })
    }
};  

//is instructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only",
            });
        }
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            success: false,
            message: "User role cant be verified , please try again later"
        })
    }
};
