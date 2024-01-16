"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseMove = (move) => {
    let regEx = /^[RDLU] [\d]+ \(#([a-z0-9]{5})(\d)\)$/;
    let match = move.match(regEx);
    // console.log("match", match);
    let steps = parseInt(match[1], 16);
    let dirChar = match[2];
    let dir;
    switch (dirChar) {
        case "0":
            dir = 'R';
            break;
        case "1":
            dir = 'D';
            break;
        case "2":
            dir = 'L';
            break;
        case "3":
            dir = 'U';
            break;
    }
    return { dir: dir, steps };
};
const showLaceFormular = (moves) => {
    let area = 0;
    let x = 1;
    let y = 1;
    let perimeter = 0;
    let tiles = moves.map(m => {
        switch (m.dir) {
            case "R":
                x += m.steps;
                break;
            case "L":
                x -= m.steps;
                break;
            case "U":
                y -= m.steps;
                break;
            case "D":
                y += m.steps;
                break;
        }
        perimeter += m.steps;
        return { x, y, symbol: m.dir, steps: m.steps };
    });
    tiles.unshift({ x: 1, y: 1, symbol: 'R', steps: 0 });
    console.log('tiles', tiles);
    x = 0;
    y = 0;
    let sum = 0;
    tiles.forEach(t => {
        sum += (x * t.y - y * t.x);
        x = t.x;
        y = t.y;
    });
    area = Math.abs(sum) / 2;
    // The perimeter are cubic meter blocks vs lines
    // Half of the perimeter blocks already in area
    // The + 1 accounts for the corner blocks of the full 
    // "circle" of the perimeter.
    area += perimeter / 2 + 1;
    return area;
};
const readMap = () => {
    const input = readInput();
    let moves = input.map((l) => parseMove(l));
    console.log("moves", moves);
    let area = showLaceFormular(moves);
    console.log('area', area);
};
readMap();
//# sourceMappingURL=part2.js.map