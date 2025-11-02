const createAuthController = require("./authFactory");
const createCRUDController = require("./crudFactory");

const factory = {
    createAuthController,
    createCRUDController
}

module.exports = factory;