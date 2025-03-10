const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
    try{
        let transporter = nodemailer.createTransport({
            //where the server is hosted.. generally smtp protocol is used
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER, //mail id of sender
                pass: process.env.MAIL_PASS // pw defined by Google
            }
        })

        let info = await transporter.sendMail({
            from: 'StudyNotion || CodeHelp', // sender address
            to: `${email}`, // list of receivers
            subject: `${title}`, 
            html:`${body}` // html body
        });

        console.log(info);
        return info;
    }
    catch(err){
        console.log(err.message)
    }
};

module.exports = mailSender; 