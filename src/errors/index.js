const AppError = require("./AppError")
const DatabaseError = require("./DatabaseError")
const ValidationError = require("./ValidationError")
const AuthenticationError = require("./AuthenticationError")

const Errors = {
    AppError,
    DatabaseError,
    ValidationError,
    AuthenticationError
}

module.exports = Errors