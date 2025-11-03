const sendMail = require("../utils/mailSender");

const emailTemplates = {
  verification: (user, token, data) => ({
    subject: data.subject || "Verify Your Email Address",
    html: `
            <h1>Email Verification</h1>
            <p>Hello ${user.username},</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${process.env.BASE_URL}api/auth/verify-email?token=${token}">
                Verify Email
            </a>
            <p>This link will expire in ${data.expiryTime}.</p>
        `,
    text: `Hello ${user.username}, Please verify your email by visiting: ${process.env.BASE_URL}/verify-email?token=${token}`,
  }),
  passwordReset: (user, token, data) => ({
    subject: data.subject || "Reset Your Password",
    html: `
        <h1>Password Reset</h1>
        <p>Hello ${user.username},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.BASE_URL}password/reset-password?token=${token}">
            Reset Password
        </a>
        <p>This link will expire in ${data.expiryTime}.</p>
    `,
  }),
};

const sendEmailVerification = async (user,token,data)=>{
    const emailConfig = emailTemplates.verification(user,token,data);
    await sendMail(user.email,emailConfig);
}


const sendPasswordReset = async (user,token,data)=>{
    const emailConfig = emailTemplates.passwordReset(user,token,data);
    await sendMail(user.email,emailConfig);
}
module.exports = {sendEmailVerification, sendPasswordReset};