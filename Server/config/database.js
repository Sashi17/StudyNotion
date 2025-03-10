const mongoose = require("mongoose")

require('dotenv').config()

exports.connect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
    })
    .then(console.log("DB Connection successful"))
    .catch((err) => {
        console.log("Connection error")
        console.error(err);
        process.exit(1);  
    })
};
