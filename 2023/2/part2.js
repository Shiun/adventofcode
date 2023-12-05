"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const processSet = (set, color) => {
    const ballRegex = new RegExp(`([0-9]*) ${color}`);
    const matches = set.match(ballRegex);
    if (matches) {
        console.log(`${color}: ${parseInt(matches[1])}`);
        return parseInt(matches[1]);
    }
    return 0;
};
const processLine = (line, color) => {
    const sets = line.split('; ');
    let max = 0;
    sets.forEach(set => {
        const count = processSet(set, color);
        max = count > max ? count : max;
    });
    console.log(`Max ${color}: ${max}`);
    return max;
};
const inputStringArray = () => {
    const lines = (0, utils_1.inputLinesArray)('input.txt');
    let maxRed = 0;
    let maxGreen = 0;
    let maxBlue = 0;
    let powerSum = 0;
    lines.forEach((i) => {
        console.log(`${i}`);
        maxRed = processLine(i, 'red');
        maxGreen = processLine(i, 'green');
        maxBlue = processLine(i, 'blue');
        const power = (maxRed * maxGreen * maxBlue);
        powerSum += power;
        console.log(`power : ${power}`);
        console.log(`powerSum : ${powerSum}`);
    });
};
inputStringArray();
