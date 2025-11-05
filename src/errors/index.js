const AppError = require("./AppError")
const DatabaseError = require("./DatabaseError")
const ValidationError = require("./ValidationError")
const AuthenticationError = require("./AuthenticationError")
const ConflictError =require("./ConflictError")
const Errors = {
    AppError,
    DatabaseError,
    ValidationError,
    AuthenticationError,
    ConflictError
}

module.exports = Errors