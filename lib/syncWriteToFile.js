"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (file, data) => {
    const fs = require('fs'); // non-global require because fs functions are mostly only used in development, so no need to require them for most uses
    fs.writeFileSync(file, data);
};
