"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = __importDefault(require("query-string"));
const crypto_1 = __importDefault(require("crypto"));
// Create the Canonicalized Query String
// qs.stringify will sort the keys and url encode
exports.default = ({ host, path, query, secretAccessKey, }) => {
    const stringToSign = ['POST', host, path, query_string_1.default.stringify(query)].join('\n');
    return crypto_1.default.createHmac('sha256', secretAccessKey).update(stringToSign).digest('base64');
};
