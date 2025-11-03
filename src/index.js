const factory = require("./factories/index")

const myToolKit = {
    createAuthController : factory.createAuthController,
    createCRUDController : factory.createCRUDController,
    createPasswordController : factory.createPasswordController
}

module.exports = myToolKit ;