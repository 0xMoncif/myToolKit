const errorLogger = (err,req,res,next)=>{
    console.error(err.status , err.code , err.message);
    next(err);
}

const errorResponse = (err,req,res,next)=>{
    const status = err.status || 500;
    res.status(status).json({
        success : false ,
        message : err.message,
        code : err.code || "INTERNAL_ERROR",
        timeStamps : new Date().toString()
    })
}

module.exports = {errorLogger ,errorResponse}