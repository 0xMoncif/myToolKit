const {errorLogger ,errorResponse}= require("./errorHandlers")

const middleware = {
    errorLogger,
    errorResponse
}



module.exports = middleware