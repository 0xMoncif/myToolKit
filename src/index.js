const factory = require("./factories/index")
const middleware = require("./middleware/index")

const myToolKit = {
    createAuthController : factory.createAuthController,
    createCRUDController : factory.createCRUDController,
    createPasswordController : factory.createPasswordController,
    errorLogger,
    errorResponse
}

module.exports = myToolKit ;