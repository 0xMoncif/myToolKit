const jwt  = require("jsonwebtoken");
const {v4 : uuidv4} = require("uuid");
const crypto = require("crypto");
const VerificationEmailToken = require("../models/EmailVerificationToken");
const RefreshToken = require("../models/RefreshToken");

const generateAccessToken = (userId,userRoles, expirationDuration)=>{
    const payload = {userId,userRoles};
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn : expirationDuration
    });
    return token;
}
const generateRefreshToken = async (userId,expirationDuration)=>{

    const jti = uuidv4();
    const payload = {userId,jti};
    const token = jwt.sign(payload,process.env.REFRESH_SECRET_KEY, {
        expiresIn : expirationDuration
    });
    const refreshToken = new RefreshToken({
        jti: jti,
        token: token,
        user_id:userId ,
        expiresAt: new Date(Date.now() + expirationDuration),
      });
    await refreshToken.save();
    return {token,jti};
}

const generateVerificationToken = async (userId ,expirationDuration, maxRetries = 5)=>{
    let retries = 0; 

    while (retries < maxRetries){
        try{
            const token =   crypto.randomBytes(20).toString("hex");
            await VerificationEmailToken.create({
                user_id : userId,
                token : token,
                expiresAt : new Date(Date.now() + expirationDuration)
            });
            return token

        }catch(error){
            if (error.code === 1100 && error.keyPattern && error.keyPattern.token){
                retries++;
                console.warn(`Duplicate token generated, retry ${retries}/${maxRetries}`);
            }
            if (retries >= maxRetries){
                throw new Error (`Failed to generate unique token after ${maxRetries} retries`);
            }
            else {
                throw error;
            }


        }
    }
}



module.exports = {generateAccessToken,generateRefreshToken,generateVerificationToken};