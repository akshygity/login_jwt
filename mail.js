const nodemailer = require('nodemailer');
require("dotenv").config();
 



const emailsender= async (email,link)=>{
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD

    }
});
 
let mailDetails = {
    from:process.env.EMAIL, 
    to: email,
    subject: 'reset-password',
    html:` <p> ${link} This email is valid for 15 minutes   </p>`
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs',err);
    } else {
        console.log('Email sent successfully');
        
    }
});
}


module.exports =emailsender;