"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt", false);
    return lines;
};
const parseLine = (line) => {
    return line.split("");
};
const transposePlatform = (lines) => {
    const rows = lines.length, cols = lines[0].length;
    let tPlatform = [];
    for (let j = 0; j < cols; j++) {
        tPlatform[j] = [];
    }
    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
            // console.log('tPlatform[j][i]', tPlatform[j][i])
            // console.log('lines[i][j]', lines[i][j])
            tPlatform[j][rows - i - 1] = lines[i][j];
        }
    }
    return tPlatform;
};
const tiltPlatform = (lines) => {
    let state = [];
    for (let row = 0; row < lines.length; row++) {
        for (let col = lines[0].length - 1; col >= 0; col--) {
            let curr = lines[row][col];
            let stopSlide = false;
            if (curr === 'O') {
                let currCol = col;
                let nextCol = col + 1;
                while (nextCol < lines[0].length && !stopSlide) {
                    if (lines[row][nextCol] === '#' || lines[row][nextCol] === 'O') {
                        stopSlide = true;
                    }
                    else {
                        lines[row][currCol] = '.';
                        lines[row][nextCol] = 'O';
                    }
                    currCol = nextCol;
                    nextCol++;
                }
                stopSlide = false;
            }
        }
    }
    return state;
};
const calculateLoad = (lines) => {
    let sum = 0;
    lines.forEach((r, i) => {
        r.forEach((c, j) => {
            if (c === 'O') {
                sum += j + 1;
            }
        });
        // console.log(`row ${i+1}:`, sum)
    });
    return sum;
};
const printPlatform = (map) => {
    map.forEach(r => {
        console.log(r.reduce((s, c) => s + c, ""));
    });
};
const spinPlatform = (map, count, tilt = true) => {
    let tPlatform = map;
    let sums = [];
    let spinIndex = 0;
    let sumMap = new Map();
    let foundCycle = false;
    for (let i = 0; i < 4 * count && !foundCycle; i++) {
        tPlatform = transposePlatform(tPlatform);
        if (tilt) {
            tiltPlatform(tPlatform);
        }
        // 0 North
        // 1 West
        // 2 South
        // 3 East
        if (i % 4 === 3) {
            // printPlatform(tPlatform)
            let temp = transposePlatform(tPlatform);
            let sum = calculateLoad(temp);
            if (!sumMap.has(sum)) {
                sumMap.set(sum, spinIndex);
                spinIndex++;
            }
            else {
                console.log('found cycle');
                console.log('sum:', sum);
                console.log('spinIndex:', sumMap.get(sum));
                foundCycle = true;
            }
            // console.log('sum', sum)
            // console.log('\n\n')
            sums.push(sum);
        }
    }
    return { sums, sumMap };
};
const readPlatform = () => {
    const lines = readInput();
    let map = new Array();
    lines.forEach((l) => {
        map.push(parseLine(l));
    });
    // printPlatform(map)
    // console.log('\n\n')
    // let tPlatform = transposePlatform(map)
    // printPlatform(tPlatform)
    // console.log('\n\n')
    // tPlatform = transposePlatform(tPlatform)
    // printPlatform(tPlatform)
    // console.log('\n\n')
    // tiltPlatform(tPlatform)
    let { sums, sumMap } = spinPlatform(map, 300);
    console.log('sums', sums);
    let lastSum = sums[sums.length - 1];
    let lastSumIndex = sumMap.get(sums[sums.length - 1]);
    console.log('lastSum:', lastSum);
    console.log('lastSum index:', lastSumIndex);
    console.log('sums.findIndex(s => s ===lastSum)', sums.findIndex(s => s === lastSum));
    console.log('sums.findLastIndex(s => s ===lastSum)', sums.findLastIndex(s => s === lastSum));
    let splicedSum = [];
    for (let i = lastSumIndex; i < sums.length - 1; i++) {
        splicedSum.push(sums[i]);
    }
    console.log('splicedSum', splicedSum);
    console.log('splicedSum.length', splicedSum.length);
    let splicedSumIndex = (1000000000 % lastSumIndex) % splicedSum.length;
    console.log('Item # to splicedSum: (1000000000 - lastSumIndex!) % splicedSum.length =', splicedSumIndex);
    console.log(`Item #${splicedSumIndex} in splicedSum[splicedSumIndex - 1] = `, splicedSum[splicedSumIndex - 1]);
};
readPlatform();
