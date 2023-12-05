"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputLinesArray = void 0;
const { readFileSync } = require('fs');
const inputLinesArray = (filePath) => {
    const lines = readFileSync(filePath).toString().split("\n").filter(n => n);
    return lines;
};
exports.inputLinesArray = inputLinesArray;
