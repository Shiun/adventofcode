"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const { inspect } = require("util");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseHail = (line) => {
    const regex = /^(?<x>[-\d]+)[, ]+(?<y>[-\d]+)[, ]+(?<z>[-\d]+)[@ ]+(?<vx>[-\d]+)[, ]+(?<vy>[-\d]+)[, ]+(?<vz>[-\d]+)$/;
    let result = line.match(regex);
    return {
        x: parseInt(result?.groups?.x),
        y: parseInt(result?.groups?.y),
        z: parseInt(result?.groups?.z),
        vx: parseInt(result?.groups?.vx),
        vy: parseInt(result?.groups?.vy),
        vz: parseInt(result?.groups?.z),
    };
};
const hasIntersection = (h1, h2, min, max) => {
    let m1 = h1.vy / h1.vx;
    let m2 = h2.vy / h2.vx;
    // Parallel Lines
    if (m1 === m2) {
        return false;
    }
    // y = m*x + b, where m = slope and b = y intercept
    // b = y - m*x
    let b1 = h1.y - m1 * h1.x;
    let b2 = h2.y - m2 * h2.x;
    // Intersection:
    // y = m1*x + b1
    // y = m2*x + b2
    // m1*x + b1 = m2*x + b2
    // x = (b2 - b1)/(m1 - m2)
    let x0 = (b2 - b1) / (m1 - m2);
    let y0 = m1 * x0 + b1;
    x0 = parseFloat(x0.toFixed(3));
    y0 = parseFloat(y0.toFixed(3));
    let y1 = m1 * h1.x + b1;
    if (x0 <= max && x0 >= min && y0 <= max && y0 >= min) {
        // Check that intersection point is in h1's future
        if (h1.vx < 0 && x0 > h1.x || h1.vx > 0 && x0 < h1.x) {
            return false;
        }
        // Check that intersection point is in h2's future
        if (h2.vx < 0 && x0 > h2.x || h2.vx > 0 && x0 < h2.x) {
            return false;
        }
        return true;
    }
    return false;
};
const countIntersections = (hails, min, max) => {
    console.log('hail count', hails.length);
    let count = 0;
    let pairs = 0;
    for (let i = 0; i < hails.length; i++) {
        for (let j = i + 1; j < hails.length; j++) {
            pairs++;
            // console.log('pair', i, j)
            hasIntersection(hails[i], hails[j], min, max) ? count++ : undefined;
        }
    }
    console.log('pairs', pairs);
    return count;
};
const readHail = () => {
    let lines = readInput();
    console.log("lines", lines);
    let hails = lines.map((l) => parseHail(l));
    console.log('hails', hails);
    let min = 200000000000000;
    let max = 400000000000000;
    let count = countIntersections(hails, min, max);
    console.log('count', count);
};
readHail();
//# sourceMappingURL=part1.js.map