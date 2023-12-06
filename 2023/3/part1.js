"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const twoDimensionalCharacterMap = (lines) => {
    const Map = [];
    lines.forEach((line, i) => {
        const characters = line.split("");
        Map.push(characters);
    });
    return Map;
};
const findNumber = (line, row, col) => {
    let start = -1;
    let end = -1;
    console.log("row = ", row);
    let stop = false;
    for (let i = row; i < line.length && !stop; i++) {
        let num = parseInt(line[i]);
        if (!isNaN(num)) {
            if (start === -1) {
                start = i;
                end = i;
            }
            else {
                end = i;
            }
        }
        else if (start != -1 && end != -1) {
            stop = true;
        }
    }
    const result = { start, end };
    return result;
};
const joinStrings = (line, start, end) => {
    let result = [];
    for (let i = start; i <= end; i++) {
        result.push(line[i]);
    }
    const numString = result.join("");
    console.log(`numString: ${numString}`);
    return parseInt(numString);
};
const boundIndex = (index, min, max) => {
    if (index < min) {
        return min;
    }
    if (index > max) {
        return max;
    }
    return index;
};
const isSymbol = (test) => {
    // console.log("test: ", test);
    const symbolRegex = /[^.\d]/;
    const result = test.match(symbolRegex);
    // console.log("result ", !(result === null));
    return !(result === null);
};
const hasSymbols = (line, start, stop) => {
    console.log("hasSymbol start/stop", start, stop);
    console.log("hasSymbol test string", line.slice(start, stop));
    for (let i = start; i <= stop; i++) {
        if (isSymbol(line[i])) {
            return true;
        }
    }
    return false;
};
const isPartsNumber = (test, lines, lineIndex, start, end) => {
    let hasSymbolsAbove = false;
    let hasSymbolsBelow = false;
    let hasSymbolBefore = false;
    let hasSymbolAfter = false;
    if (lineIndex - 1 >= 0) {
        console.log('Testing above: ', lines[lineIndex - 1]);
        hasSymbolsAbove = hasSymbols(lines[lineIndex - 1], boundIndex(start - 1, 0, lines[lineIndex - 1].length - 1), boundIndex(end + 1, 0, lines[lineIndex - 1].length - 1));
        if (hasSymbolsAbove) {
            return test;
        }
    }
    if (lineIndex + 1 < lines.length) {
        console.log('Testing below: ', lines[lineIndex + 1]);
        hasSymbolsBelow = hasSymbols(lines[lineIndex + 1], boundIndex(start - 1, 0, lines[lineIndex + 1].length - 1), boundIndex(end + 1, 0, lines[lineIndex + 1].length - 1));
        if (hasSymbolsBelow) {
            return test;
        }
    }
    if (start - 1 >= 0) {
        console.log('Testing before: ', lines[lineIndex][start - 1]);
        hasSymbolBefore = isSymbol(lines[lineIndex][start - 1]);
    }
    if (end + 1 < lines[lineIndex].length) {
        console.log('Testing after: ', lines[lineIndex][end + 1]);
        hasSymbolAfter = isSymbol(lines[lineIndex][end + 1]);
    }
    console.log("hasSymbolsAbove", hasSymbolsAbove);
    console.log("hasSymbolsBelow", hasSymbolsBelow);
    console.log("hasSymbolBefore", hasSymbolBefore);
    console.log("hasSymbolAfter", hasSymbolAfter);
    if (hasSymbolsAbove || hasSymbolsBelow || hasSymbolBefore || hasSymbolAfter) {
        console.log(`has Symbols: return ${test}\n`);
        return test;
    }
    console.log("return", 0, "\n");
    return 0;
};
const inputStringArray = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    const twoDMap = twoDimensionalCharacterMap(lines);
    let sumOfPartsNumber = 0;
    twoDMap.forEach((line, lineIndex) => {
        console.log(`${line}`);
        console.log(`Current lineIndex: ${lineIndex}`);
        let start = 0;
        let end = 0;
        while ((start > -1 && start < line.length) ||
            (end > -1 && end < line.length)) {
            console.log("START/END", start, end);
            const indexes = findNumber(line, start, end);
            start = indexes.end + 1 == 0 ? -1 : indexes.end + 1;
            end = indexes.end + 1 == 0 ? -1 : indexes.end + 1;
            console.log("indexes ", indexes.start, indexes.end);
            const result = joinStrings(line, indexes.start, indexes.end);
            console.log("Parsed number:", result, "\n");
            if (!isNaN(result)) {
                sumOfPartsNumber += isPartsNumber(result, lines, lineIndex, indexes.start, indexes.end);
            }
            console.log("running sum", sumOfPartsNumber, "\n\n");
        }
    });
    console.log("sumOfPartsNumber", sumOfPartsNumber);
};
inputStringArray();
