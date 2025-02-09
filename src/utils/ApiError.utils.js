class ApiError extends Error{
    constructor(
        message="Something went wrong",
        stack="",
        error=[],
        statusCode
    ){
        super(message),
        message=this.message,
        this.data=null,
        this.stack=stack,
        this.statusCode=statusCode,
        this.success=false,
        this.error=error
        
        if (stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export  {ApiError}