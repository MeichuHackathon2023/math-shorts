export class CustomError extends Error {
    public code: string;
    public statusCode: number;

    constructor(code: string, statusCode: number, message: string) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

export class InternalServerError extends CustomError {
    constructor() {
        super("0001", 500, "Internal server error");
    }
}

export class NotImplementedError extends CustomError {
    constructor() {
        super("0002", 501, "Not implemented");
    }
}

export class ServiceUnavailableError extends CustomError {
    constructor() {
        super("0003", 503, "Service Unavailable");
    }
}

export class BadRequestError extends CustomError {
    constructor(message?: string) {
        super("0004", 400, message ?? "Bad Request");
    }
}

export class UnauthorizedError extends CustomError {
    constructor() {
        super("0005", 401, "Unauthorized");
    }
}

export class ForbiddenError extends CustomError {
    constructor(message?: string) {
        super("0006", 403, message ?? "Forbidden");
    }
}
export class NotFoundError extends CustomError {
    constructor(message?: string) {
        super("0007", 404, message ?? "Not Found");
    }
}

export class ConflictError extends CustomError {
    constructor() {
        super("0007", 409, "Conflict");
    }
}

export class RequestEntityTooLargeError extends CustomError {
    constructor() {
        super("0008", 413, "Request Entity Too Large");
    }
}
