"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerError extends Error {
    constructor(message, code, body) {
        super(message);
        this.code = 0;
        this.body = '';
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, ServerError);
        this.code = code;
        this.body = body;
    }
}
exports.default = ServerError;
