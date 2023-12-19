"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputLinesArray = void 0;
const { readFileSync } = require('fs');
const inputLinesArray = (filePath, filterEmpty = true) => {
    let lines = readFileSync(filePath).toString().split("\n");
    if (filterEmpty) {
        lines = lines.filter((n) => n);
    }
    return lines;
};
exports.inputLinesArray = inputLinesArray;
