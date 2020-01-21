"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = require("xml2js");
const csv_parse_1 = __importDefault(require("csv-parse"));
const processXmlRequest = (body, callback) => xml2js_1.parseString(body, (err, result) => callback(err, result));
exports.processXmlRequest = processXmlRequest;
const processTextRequest = (body, callback) => {
    if (typeof body === 'string' && (body.indexOf('\t') === -1 || body.startsWith('Feed Processing Summary'))) {
        callback(undefined, body);
    }
    else {
        csv_parse_1.default(body, { delimiter: '\t', columns: true, relax: true }, (err, result) => callback(err, result));
    }
};
exports.processTextRequest = processTextRequest;
const processRequest = ({ contentType, body }, callback) => {
    if (contentType.includes('/xml'))
        processXmlRequest(body, callback);
    else if (contentType.includes('text/plain')) {
        processTextRequest(body, callback);
    }
    else {
        console.warn('**** mws-simple: unknown content-type', contentType);
        callback(undefined, body);
    }
};
exports.processRequest = processRequest;
exports.default = processRequest;
