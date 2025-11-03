const createAuthController = require("./authFactory");
const createCRUDController = require("./crudFactory");
const createPasswordController = require("./passwordResetFactory")
const factory = {
    createAuthController,
    createCRUDController,
    createPasswordController
}

module.exports = factory;