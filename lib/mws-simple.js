"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const ServerError_1 = __importDefault(require("./ServerError"));
const makeRequest_1 = __importDefault(require("./makeRequest"));
const makeSignature_1 = __importDefault(require("./makeSignature"));
const getContentType_1 = __importDefault(require("./getContentType"));
const { name: pkgAppId, version: pkgAppVersionId } = require('../package.json');
class MWSSimple {
    constructor({ appId = pkgAppId, appVersionId = pkgAppVersionId, host = 'mws.amazonservices.com', port = 443, accessKeyId, secretAccessKey, merchantId, authToken, } = {}) {
        this.accessKeyId = '';
        this.appId = '';
        this.appVersionId = '';
        this.merchantId = '';
        this.authToken = '';
        this.host = '';
        this.secretAccessKey = '';
        Object.assign(this, {
            appId,
            appVersionId,
            host,
            port,
            accessKeyId,
            secretAccessKey,
            merchantId,
            authToken,
            ServerError: ServerError_1.default,
        });
        // allows to use this inside the request method
        this.request = this.request.bind(this);
    }
    // http://docs.developer.amazonservices.com/en_US/dev_guide/DG_ClientLibraries.html
    request(requestData, // TODO: this should NOT be any.
    // TODO: how can i put this messy callback line into a .d.ts and import it, so both this
    // and makeRequest can use it?
    callback, debugOptions) {
        const self = this.request;
        // if no callback specified return a Promise
        if (callback === undefined) {
            return new Promise((resolve, reject) => self(requestData, (err, result) => (err ? reject(err) : resolve(result))));
        }
        const requestDefaults = {
            path: '/',
            query: {
                Timestamp: (new Date()).toISOString(),
                AWSAccessKeyId: this.accessKeyId,
                SellerId: this.merchantId,
                responseFormat: 'xml',
                MWSAuthToken: this.authToken,
            },
        };
        const newRequestData = {
            headers: {},
            ...requestDefaults,
            ...requestData,
            query: {
                ...requestDefaults.query,
                ...requestData.query,
                SignatureMethod: 'HmacSHA256',
                SignatureVersion: '2',
            },
        };
        newRequestData.query.Signature = makeSignature_1.default({
            host: this.host,
            path: newRequestData.path,
            query: newRequestData.query,
            secretAccessKey: this.secretAccessKey,
        });
        // Use specified Content-Type or assume one
        let { 'Content-Type': contentType } = newRequestData.headers;
        if (!contentType) {
            contentType = getContentType_1.default(newRequestData.feedContent);
        }
        // queryFieldName === qs for querystring, or form for form. mws errors if you post
        // feedContent with form.
        const queryFieldName = newRequestData.feedContent ? 'qs' : 'form';
        const options = {
            url: `https://${this.host}:${this.port}${newRequestData.path}`,
            headers: {
                Host: this.host,
                // http://docs.developer.amazonservices.com/en_US/dev_guide/DG_ClientLibraries.html (Creating the User-Agent header)
                'User-Agent': `${(newRequestData.headers && newRequestData.headers['User-Agent']) || this.appId}/${this.appVersionId} (Language=Javascript)`,
                'Content-Type': contentType,
                'Content-MD5': newRequestData.feedContent ? crypto_1.default.createHash('md5').update(newRequestData.feedContent).digest('base64') : undefined,
            },
            [queryFieldName]: newRequestData.query,
            body: newRequestData.feedContent,
        };
        return makeRequest_1.default(options, debugOptions, callback);
    }
}
exports.MWSSimple = MWSSimple;
exports.default = MWSSimple;
