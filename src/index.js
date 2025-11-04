const factory = require("./factories/index")
const middleware = require("./middleware/index")

const myToolKit = {
    createAuthController : factory.createAuthController,
    createCRUDController : factory.createCRUDController,
    createPasswordController : factory.createPasswordController,
    errorLogger : middleware.errorLogger,
    errorResponse : middleware.errorResponse
}

module.exports = myToolKit ;