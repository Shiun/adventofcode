"use strict";
const { readFileSync } = require('fs');
const number = (string) => {
    const reverse = string.split("").reverse().join("");
    const firstNumRegex = /[^\d]*(\d)/;
    const firstNumber = string.match(firstNumRegex);
    const lastNumber = reverse.match(firstNumRegex);
    console.log(`firstNumber: ${firstNumber === null || firstNumber === void 0 ? void 0 : firstNumber[1]}`);
    console.log(`lastNumber: ${lastNumber === null || lastNumber === void 0 ? void 0 : lastNumber[1]}`);
    console.log(`Number: ${firstNumber === null || firstNumber === void 0 ? void 0 : firstNumber[1]}${lastNumber === null || lastNumber === void 0 ? void 0 : lastNumber[1]}`);
    return parseInt(`${firstNumber === null || firstNumber === void 0 ? void 0 : firstNumber[1]}${lastNumber === null || lastNumber === void 0 ? void 0 : lastNumber[1]}`);
};
const generateResult = () => {
    const lines = readFileSync('input.txt').toString().split("\n");
    let sum = 0;
    lines.filter(n => n).forEach((i) => {
        console.log(`String: ${i}`);
        sum += number(i);
        console.log("\n");
    });
    console.log(`Sum: ${sum}`);
};
generateResult();
