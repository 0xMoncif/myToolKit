const factory = require("./factories/index")
const middleware = require("./middleware/index")
const Errors = require("./errors/index");
const myToolKit = {
    createAuthController : factory.createAuthController,
    createCRUDController : factory.createCRUDController,
    createPasswordController : factory.createPasswordController,
    errorLogger : middleware.errorLogger,
    errorResponse : middleware.errorResponse,
    AppError : Errors.AppError,
    DatabaseError : Errors.DatabaseError,
    ValidationError : Errors.ValidationError,
    AuthenticationError : Errors.AuthenticationError         
}

module.exports = myToolKit ;
