const AppError = require("./AppError");

class ValidationError extends AppError {
    constructor(message , details = []){
        super(message,400,"VALIDATION_ERROR");
        this.details = details;
    }
}

module.exports = ValidationError;