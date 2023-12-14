"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseNumbers = (line) => {
    return line.split(" ").map(n => parseInt(n));
};
const findNextDiff = (nums) => {
    let diff = nums.map((num, i) => {
        if (i < nums.length - 1) {
            return nums[i + 1] - num;
        }
        return NaN;
    }).filter(n => !Number.isNaN(n));
    // console.log('diff', diff)
    if (!diff.every(val => val === diff[0])) {
        return nums[nums.length - 1] + findNextDiff(diff);
    }
    return nums[nums.length - 1] + diff[0];
};
const readHistory = () => {
    let lines = readInput();
    let history = new Map();
    lines.forEach((line, i) => {
        history.set((i), parseNumbers(line));
    });
    let sum = 0;
    history.forEach(h => {
        let newNum = findNextDiff(h);
        sum += newNum;
    });
    console.log('sum', sum);
};
readHistory();
