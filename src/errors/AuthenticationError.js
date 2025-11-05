const AppError = require("./AppError");

class AuthenticationError extends AppError {
    constructor(message = "Authentication required"){
        super(message ,401 ,"AUTHENTICATION_ERROR")
    }
}

module.expots = AuthenticationError;