export interface ErrorDetails {
    platform?: string;
    code?: number;
    message?: string;
    fields?: string[];
}

export enum ErrorCode {
    ServerError = 500,
    AlreadyExistsError = 422,
    PermissionDeniedError = 403,
    NotFoundError = 404,
    UnauthorizedError = 401,
    ValidationError = 400
}
export enum ErrorMessage {
    ServerError = "Server Error",
    AlreadyExistsError = "Already Exists Error",
    PermissionDeniedError = "Permission Denied Error",
    NotFoundError = "Not Found Error",
    UnauthorizedError = "Unauthorized Error",
    ValidationError = "Validation Error"
}
export class AppError extends Error {
    code: number;
    details?: ErrorDetails;

    constructor(code: number | undefined, message: string, details?: ErrorDetails) {
        super(message);
        this.code = code || 500;
        this.details = details;
    }
}

export class ServerError extends AppError {
    constructor(message?: string, details?: ErrorDetails) {
        super(ErrorCode.AlreadyExistsError, message || ErrorMessage.AlreadyExistsError, details);
    }
}

export class NotFoundError extends AppError {
    constructor(message?: string, details?: ErrorDetails) {
        super(ErrorCode.AlreadyExistsError, message || ErrorMessage.AlreadyExistsError, details);
    }
}

export class AlreadyExistsError extends AppError {
    constructor(message?: string, details?: ErrorDetails) {
        super(ErrorCode.AlreadyExistsError, message || ErrorMessage.AlreadyExistsError, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message?: string, details?: ErrorDetails) {
        super(ErrorCode.AlreadyExistsError, message || ErrorMessage.AlreadyExistsError, details);
    }
}

export class PermissionDeniedError extends AppError {
    constructor(message?: string, details?: ErrorDetails) {
        super(ErrorCode.AlreadyExistsError, message || ErrorMessage.AlreadyExistsError, details);
    }
}

export class ValidationError extends AppError {
    constructor(message?: string, details?: ErrorDetails) {
        super(ErrorCode.AlreadyExistsError, message || ErrorMessage.AlreadyExistsError, details);
    }
}