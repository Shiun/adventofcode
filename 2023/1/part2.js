"use strict";
const { readFileSync } = require("fs");
const numberString = (string) => {
    const reverse = string.split("").reverse().join("");
    const firstNumRegex = /[^\d|^(one|two|three|four|five|six|seven|eight|nine)]*(\d|one|two|three|four|five|six|seven|eight|nine)/;
    const lastNumRegex = /[^\d|^(eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)]*(\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)/;
    const firstNumber = string.match(firstNumRegex);
    const lastNumber = reverse.match(lastNumRegex);
    let firstInt = parseInt(firstNumber === null || firstNumber === void 0 ? void 0 : firstNumber[1]);
    firstInt = isNaN(firstInt) ? convertToNumber(firstNumber === null || firstNumber === void 0 ? void 0 : firstNumber[1]) : firstInt;
    let lastInt = parseInt(lastNumber === null || lastNumber === void 0 ? void 0 : lastNumber[1]);
    lastInt = isNaN(lastInt) ? convertToNumber(lastNumber === null || lastNumber === void 0 ? void 0 : lastNumber[1]) : lastInt;
    console.log(`firstNumber: ${firstInt}`);
    console.log(`lastNumber: ${lastInt}`);
    console.log(`Number: ${firstInt}${lastInt}`);
    return parseInt(`${firstInt}${lastInt}`);
};
const convertToNumber = (string) => {
    switch (string) {
        case "one":
        case "eno":
            return 1;
        case "two":
        case "owt":
            return 2;
        case "three":
        case "eerht":
            return 3;
        case "four":
        case "ruof":
            return 4;
        case "five":
        case "evif":
            return 5;
        case "six":
        case "xis":
            return 6;
        case "seven":
        case "neves":
            return 7;
        case "eight":
        case "thgie":
            return 8;
        case "nine":
        case "enin":
            return 9;
        default:
    }
};
const generatePart2Result = () => {
    const lines = readFileSync("input.txt").toString().split("\n");
    let sum = 0;
    lines
        .filter((n) => n)
        .forEach((i) => {
        console.log(`String: ${i}`);
        sum += numberString(i);
        console.log("\n");
    });
    console.log(`Sum: ${sum}`);
};
generatePart2Result();
