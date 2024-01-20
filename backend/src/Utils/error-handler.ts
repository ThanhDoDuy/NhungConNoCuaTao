import { StatusCodes } from 'http-status-codes';

interface IError {
    message: string;
    statusCode: number;
    status: string;
}

abstract class CustomError extends Error {
    abstract statusCode: number;
    status = "error";

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializeErrors(): IError {
        return {
            message: this.message,
            statusCode: this.statusCode,
            status: this.status
        }
    }
}

class BadRequestError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;

    constructor(message: string) {
        super(message);
    }
}

class NotFoundError extends CustomError {
    statusCode = StatusCodes.NOT_FOUND;

    constructor(message: string) {
        super(message);
    }
}

class NotAuthorizedError extends CustomError {
    statusCode = StatusCodes.UNAUTHORIZED;

    constructor(message: string) {
        super(message);
    }
}

class FileTooLargeError extends CustomError {
    statusCode = StatusCodes.REQUEST_TOO_LONG;

    constructor(message: string) {
        super(message);
    }
}

class ServerError extends CustomError {
    statusCode = StatusCodes.SERVICE_UNAVAILABLE;

    constructor(message: string) {
        super(message);
    }
}

interface ErrnoException extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
    stack?: string;
}

export {
    CustomError,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    FileTooLargeError,
    ServerError,
    ErrnoException
};