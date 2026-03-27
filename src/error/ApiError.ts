export class ApiError extends Error{
    code: number

    constructor(code: number) {
        super(`Error ${code}`);
        this.code = code;
        Object.setPrototypeOf(this, ApiError.prototype);
    } 
}