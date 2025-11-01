const nodemailer = require("nodemailer");

const sendMail = async (emailSentTo,options)=>{
    const {
        subject = '',
        text = '',
        html = '',
        attachments = [],
        service = 'gmail',
    } = options

    const transporter = nodemailer.createTransport({
        service : service,
        auth : {
            user : process.env.USER_EMAIL,
            pass : process.env.USER_PASSWORD 
        }
    })

    const mailOptions = {
        from : process.env.USER_EMAIL,
        to : emailSentTo ,
        subject : subject,
        text : text,
        html : html,
        attachments : attachments
    }

    try{
        await transporter.sendMail(mailOptions);
        console.log("mail sent noice");
    }catch(err){
        console.error('Error sending email:', err);
        throw err;
    }
}

module.exports = sendMail ;