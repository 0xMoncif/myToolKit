const AppError = require("./AppError");

class ConflictError extends AppError {
    constructor(message ,details = "Unknown"){
        super(message,409,'CONFLICT_ERROR')
        this.details = details
    }
}

module.exports = ConflictError;