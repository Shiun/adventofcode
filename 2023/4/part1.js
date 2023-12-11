"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const numberArray = (numStrings) => {
    const numArray = [];
    numStrings.forEach((numString) => {
        const int = parseInt(numString);
        !isNaN(int) ? numArray.push(int) : null;
    });
    return numArray;
};
const winningNumbers = (game) => {
    const winningRegex = /^Card *\d*: ([\d* ]*) \|/;
    const match = game.match(winningRegex);
    if (match) {
        return numberArray(match[1].split(" "));
    }
};
const gameNumbers = (game) => {
    const gameRegex = /\|[ ]*([\d* ]*)/;
    const match = game.match(gameRegex);
    if (match) {
        return numberArray(match[1].split(" "));
    }
};
const readInputLines = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    let sum = 0;
    lines.forEach((line, lineIndex) => {
        const winNums = winningNumbers(line);
        console.log("winNums", winNums);
        const gameNums = gameNumbers(line);
        console.log("gameNums", gameNums);
        let intersection = winNums === null || winNums === void 0 ? void 0 : winNums.filter((x) => gameNums === null || gameNums === void 0 ? void 0 : gameNums.includes(x));
        console.log("intersection", intersection);
        if (intersection && intersection.length > 0) {
            sum += Math.pow(2, intersection.length - 1);
            console.log('\nCURRENT sum', sum, '\n');
        }
    });
    console.log('FINAL sum:', sum);
};
readInputLines();
