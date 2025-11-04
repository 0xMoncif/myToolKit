const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validateBody = require("../utils/requestValidator");
const {sendEmailVerification} = require("../services/emailServices");
const { generateVerificationToken ,generateAccessToken , generateRefreshToken} = require("../utils/tokenGenerators");

const createAuthController = (options) => {
  const {
    // Core requirment
    UserModel,
    RefreshTokenModel,
    VerificationEmailTokenModel,
    // fields config
    registerFields = ["email", "password", "username"],
    loginFields = ["email", "password"],
    //password handeling
    hashRounds = 10,

    // secuirity options
    requireEmailVerification = true,
    limitLoginAttempts = true ,
    maxLoginAttempts = 5,
    accessTokenExpiration = (1000*60*5),
    refreshTokenExpiration = (1000*60*60*24),
    emailTokenExpiration = (1000*60*5),

    messages = {
      // registration messages
      userExists: "U'ser Already exists",
      registrationSuccess: "Registration Successful",
      registrationFailed: "Registration Failed",
      verificationEmailSent: "Verification email sent",
      // Loging messages
      loginSuccessful: "Login Successful",
      invalidCredentials: "invalid email or password",
      emailVerification: "email verification required to access your account",
      // logout messages 
      userLoggedOut : "user logged out successfuly",
      // email Verifications
      invalidVerificationToken:"Invalid or expired token",
      verificationSuccessful : 'Email verified successfully!'
    },

    // verification email config
    subject = "",
    text = "",
    html = "",
    attachments = [],
    service = "gmail",
  } = options;

  return {
    register: async (req, res,next) => {
      try {
        // validating the correct fields sent
        const validation = validateBody(req.body, registerFields);
        if (!validation.valid) {
          const error = {
            message : "Missing required fields",
            code : "MISSING_FIELDS",
            status : 400
          }
          throw error
        }
        // extracting the fields from the body
        const userData = {};
        registerFields.forEach((field) => {
          userData[field] = req.body[field];
        });

        // runing the before hook if exists

        const existingUser = await UserModel.findOne({ email: userData.email });
        if (existingUser) {
          return res.status(400).json({ error: messages.userExists });
        }

        // hashing the password and setting isVerified flag
        const hashedPassword = await bcrypt.hash(userData.password, hashRounds);

        userData.password = hashedPassword;
        userData.isVerified = !requireEmailVerification;

        const user = await UserModel.create(userData);

        // generating the verification mail
        if (requireEmailVerification) {
          //verification token
          const token = await generateVerificationToken(user._id,emailTokenExpiration,VerificationEmailTokenModel);
          await sendEmailVerification(user, token, {expiryTime : "5 min"});
        }
        return res.status(201).json({
          message: requireEmailVerification
            ? messages.verificationEmailSent
            : messages.registrationSuccess,
        });
      } catch (error) {
        next(error)
      }
    },
    reSendVerificationEmail: async (req, res) => {
      try{
        const {userId,email,username} = req.body;
        
        const user = {
          username : username,
          email : email
        }
        await VerificationEmailTokenModel.findOneAndDelete({user_id : new mongoose.Types.ObjectId(userId)});

        const token = await generateVerificationToken(userId ,emailTokenExpiration,VerificationEmailTokenModel) ;
        await sendEmailVerification(user , token, {expiryTime :"5 min"});
        return res.status(200).json({message : messages.verificationEmailSent});
      }catch(error){
        return res.status(500).json({
          message : "something went wrong",
          details : error.message
        })
      }
    },
    verifyEmail: async (req, res) => {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Verification token is required",
        });
      }
      try {
        const verificationToken = await VerificationEmailTokenModel.findOne({
          token: token,
          expiresAt: { $gt: new Date() },
        });

        if (!verificationToken) {
          return res
            .status(400)
            .json({ message: messages.invalidVerificationToken });
        }

        const user = await UserModel.findByIdAndUpdate(verificationToken.user_id,{
          isVerified : true
        });

        await VerificationEmailTokenModel.findOneAndDelete({ token: token });
        const accessToken = generateAccessToken(user.user_id ,user.roles,accessTokenExpiration);
        res.status(200).json({message : messages.verificationSuccessful, sucess : true,accessToken :accessToken});
      } catch (error) {
        res.status(500).json({
          sucess : false,
          message : error.message
        });
      }
    },
    login: async (req, res) => {
      try{
        const validation = validateBody(req.body , loginFields);
        if (!validation.valid) {
          return res.status(400).json({
            message: `Missing required fields ${validation.missing.join(", ")}`,
          });
        }
        const formData = {};
        loginFields.forEach((field) =>{
          formData[field] = req.body[field];
        });
        
        const user = await UserModel.findOne({email : formData.email}).select("+password");

        if (!user) {
          return res.status(401).json({ error: messages.invalidCredentials });
        }

        if (!user.isVerified){
          return res.status(403).json({error :messages.emailVerification});
        }
        const isValidPassword = await bcrypt.compare(formData.password , user.password);
        if (!isValidPassword){
          req.loginSecurity.recordFailed();
          return res.status(401).json({error : messages.invalidCredentials});
        }

        const accessToken = generateAccessToken(user._id, user.roles,accessTokenExpiration);
        const refreshToken = await generateRefreshToken(user._id,refreshTokenExpiration,RefreshTokenModel);
        
        req.loginSecurity.resetAttempts();
        res.status(200).json({accessToken : accessToken , refreshToken : refreshToken.token});
      }catch(error){
        res.status(500).json({
          messages : "something went wrong",
          error : error.message
        });
      }
    },
    logout : async (req,res)=>{
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) return res.status(400).json({error : "bad request refreshToken required"});

      try{
        const decoded = jwt.verify(refreshToken , process.env.REFRESH_SECRET_KEY);
        await RefreshTokenModel.findOneAndDelete({jti : decoded.jti});
        res.status(200).json({message : messages.userLoggedOut})
      }catch(error){
        res.status(401).json({ message: messages.invalidVerificationToken});
      }
    } 
  };
};

module.exports = createAuthController;

