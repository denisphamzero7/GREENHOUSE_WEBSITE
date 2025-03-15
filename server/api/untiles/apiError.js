class ApiError extends Error {
    constructor(status,field,message){
        super(message);
        this.status = status;
        this.field = field;
    }
}

module.exports = ApiError;