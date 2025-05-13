import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter=nodemailer.createTransport({
    secure: true,
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})
export const sendEmail= async(to:string,subject:string,text:string)=>{
    const mailOptions={
        from: process.env.EMAIL,
        to,
        subject,
        text
    }
    try{
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }
    catch(err){
        console.log(err);
    }
}

export const sendVerificationEmail=async(to:string,verification_code:string)=>{
    try{
        const subject='Email Verification';
        const text=`Your verification code is ${verification_code}`;
        await sendEmail(to,subject,text);
    }
    catch(err){
        console.log(err);
    }
}
