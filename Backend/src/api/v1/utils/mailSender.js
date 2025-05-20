const nodemailer =require("nodemailer");
require("dotenv").config();

const mailSender = async (email,title,body) =>{
   try{
      let transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
          user:process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        }
        
      })
      let info =await transporter.sendMail({
        from:'xxx || chelp ---by suraj',
        to:`${email}`,
        subject: `${title}`,
        html:`${body}`,
      })
      console.log(info);
      return info;
   }
   catch(error){
    console.log("error in node mailer in mailsender")
   }
}

module.exports= mailSender;