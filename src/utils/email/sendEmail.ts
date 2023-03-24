import token from "../../models/token/token.inteface"
const nodemailer =require("nodemailer")

//send email
export function sendEmailResetPassword(email:String,title:String,userName:String,link:String) {
 
    var email = email;
 
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '', // Your email id
            pass: '' // Your password
        }
    });
 
    var mailOptions = {
        from: 'BeeKeeping@gmail.com',
        to: email,
        subject: title,
        html: `<p>${userName} You requested for reset password, kindly use this <a href="${link}">link</a> to reset your password</p>`
 
    };
 
    mail.sendMail(mailOptions, function(error:Error, info:any) {
        if (error) {
            console.log('error : '+email+' could not send Email Reset Password request')
        } else {
            console.log(email+' send Email Reset Password request')
        }
    });
}

export function sendEmailSuccessResetPassword(email:String,title:String,userName:String)
{

    var email = email;
 
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '', // Your email id
            pass: '' // Your password
        }
    });
 
    var mailOptions = {
        from: 'BeeKeeping@gmail.com',
        to: email,
        subject: title,
        html: `<p>${userName} You successfully reset your password</p>`
 
    };
 
    mail.sendMail(mailOptions, function(error:Error, info:any) {
        if (error) {
            console.log('error : '+email+' could not send Email Reset Password request')
        } else {
            console.log(email+' send Email Reset Password request')
        }
    });
}