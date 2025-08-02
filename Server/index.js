const express = require('express');
const app = express();

const cors = require("cors")
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

require("dotenv").config();

const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");
const userRoutes = require("./routes/User");

const PORT = process.env.PORT || 4000;

//mongodb connection
require("./config/database").connect();

//cloudinary connection
require("./config/cloudinary").cloudinaryConnect();

//MIDDLEWARES~
app.use(express.json());

//what is cookie-parser and why we need that
//a middleware for Express.js that helps in parsing cookies from the request headers.
app.use(cookieParser());

//cors is used for connecting backend and frontend hosting servers
app.use(
	cors({
		origin:"http://localhost:3000",
        //if we want to use the parameters from the url in the front end...
		credentials:true,
	})
)

//stores in the server base
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : "/tmp"
}));

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

//def route
app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
    console.log(`App started at ${PORT}`);
})
