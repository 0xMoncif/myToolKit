const factory = require("./factories/index")

const myToolKit = {
    createAuthController : factory.createAuthController,
    createCRUDController : factory.createCRUDController
}

module.exports = myToolKit ;