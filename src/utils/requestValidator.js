const validateBody = (body,requiredFields)=>{
    let missingFields = [];
    for (const field of requiredFields){
        if (!body.hasOwnProperty(field) || body[field] === null || body[field] === "" || body[field] === undefined){
            missingFields.push(field);
        }
    }
    if (missingFields.length > 0){
        return {valid: false, missing : missingFields};
    }
    else{
        return {valid : true};
    }
};

module.exports = validateBody;