const errorLogger = (err,req,res,next)=>{
    console.error(err.statusCode , err.code , err.message);
    next(err);
}

const errorResponse = (err,req,res,next)=>{
    const status = err.statusCode || 500;
    res.status(status).json({
        success : false ,
        message : err.message,
        code : err.code || "INTERNAL_ERROR",
        details : err.details,
        timeStamps : new Date().toString(),
    })
}

module.exports = {errorLogger ,errorResponse}