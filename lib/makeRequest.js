"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const syncWriteToFile_1 = __importDefault(require("./syncWriteToFile"));
const ServerError_1 = __importDefault(require("./ServerError"));
const processRequest_1 = __importDefault(require("./processRequest"));
/* eslint-disable prefer-arrow-callback, consistent-return, max-len, no-console */
exports.default = (options, debug = {}, cb) => {
    request_1.default.post(options, function postRequest(error, response, body) {
        function logDataDoCallback(err, result, file, data) {
            if (file) {
                syncWriteToFile_1.default(file, data);
            }
            cb(err, { result, headers: response.headers });
        }
        if (debug.rawFile) {
            syncWriteToFile_1.default(debug.rawFile, `\nerror= ${error}\nresponse= ${JSON.stringify(response)}\nbody= ${body}\n`);
        }
        if (error) {
            return cb(error instanceof Error ? error : new Error(error), { result: null, headers: response && response.headers });
        }
        if (response.statusCode < 200 || response.statusCode > 299) {
            return cb(new ServerError_1.default(response.statusMessage, response.statusCode, response.body), { result: null, headers: response && response.headers });
        }
        const contentType = Object.prototype.hasOwnProperty.call(response.headers, 'content-type') && response.headers['content-type'];
        processRequest_1.default({ contentType, body }, (err, result) => (logDataDoCallback(err, result, debug.parsedFile, `\nerror=${err}\nresult=${JSON.stringify(result)}\n`)));
    });
};
