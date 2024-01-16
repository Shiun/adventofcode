"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const { inspect } = require("util");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseMove = (move) => {
    let regEx = /^([RDLU]) ([\d]+) \(#[a-z0-9]+\)$/;
    let match = move.match(regEx);
    return { dir: match[1], steps: parseInt(match[2]) };
};
const digArea = (moves) => {
    let x = 0;
    let y = 0;
    let maxWidth = Number.MIN_VALUE;
    let maxHeight = Number.MIN_VALUE;
    let minWidth = Number.MAX_VALUE;
    let minHeight = Number.MAX_VALUE;
    moves.forEach((m) => {
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
        maxWidth = maxWidth < x ? x : maxWidth;
        minWidth = minWidth > x ? x : minWidth;
        maxHeight = maxHeight < y ? y : maxHeight;
        minHeight = minHeight > y ? y : minHeight;
    });
    return { minHeight, maxHeight, minWidth, maxWidth };
};
const drawMoves = (moves, area) => {
    let { minHeight, maxHeight, minWidth, maxWidth } = area;
    let width = Math.abs(maxWidth - minWidth);
    let height = Math.abs(maxHeight - minHeight);
    let map = [];
    for (let col = 0; col < height + 1; col++) {
        map[col] = [];
        for (let row = 0; row < width + 1; row++) {
            map[col].push('.');
        }
    }
    let x = Math.abs(minWidth);
    let y = Math.abs(minHeight);
    map[y][x] = '#';
    moves.forEach(m => {
        switch (m.dir) {
            case "R":
                for (let i = x + 1; i < x + 1 + m.steps; i++) {
                    map[y][i] = '#';
                }
                x += m.steps;
                break;
            case "L":
                for (let i = x - 1; i > x - 1 - m.steps; i--) {
                    map[y][i] = '#';
                }
                x -= m.steps;
                break;
            case "U":
                for (let j = y - 1; j > y - 1 - m.steps; j--) {
                    map[j][x] = '#';
                }
                y -= m.steps;
                break;
            case "D":
                for (let j = y + 1; j < y + 1 + m.steps; j++) {
                    map[j][x] = '#';
                }
                y += m.steps;
                break;
        }
    });
    return map;
};
const directions = [
    { dir: 'L', coor: [0, -1] }, // North
    { dir: 'R', coor: [0, 1] }, // South
    { dir: 'D', coor: [1, 0] }, // East
    { dir: 'U', coor: [-1, 0] }, // West
];
const getNeighborDirections = (map, x, y) => {
    let width = map[0].length;
    let height = map.length;
    let dirs = [];
    for (let { dir, coor } of directions) {
        let [dCol, dRow] = coor;
        let nRow = x + dRow;
        let nCol = y + dCol;
        if (0 <= nRow && nRow < width && 0 <= nCol && nCol < height) {
            if (map[nCol][nRow] === '#') {
                dirs.push(dir);
            }
        }
    }
    return dirs;
};
const countDigArea = (map) => {
    let width = map[0].length;
    let height = map.length;
    console.log('width', width);
    console.log('height', height);
    let newMap = [];
    for (let y = 0; y < height; y++) {
        newMap[y] = [];
        for (let x = 0; x < width; x++) {
            if (map[y][x] === '#') {
                newMap[y][x] = { x, y, symbol: '#', dir: getNeighborDirections(map, x, y) };
            }
            else {
                newMap[y][x] = { x, y, symbol: '.', dir: [] };
            }
        }
    }
    let count = 0;
    let seenUp = false;
    let seenDown = false;
    let isInside = false;
    newMap.forEach((row, i) => {
        row.forEach((_col, j) => {
            let tile = newMap[i][j];
            if (tile.symbol === "#") {
                count++;
                if (tile.dir.includes("U")) {
                    seenUp = !seenUp;
                }
                if (tile.dir.includes("D")) {
                    seenDown = !seenDown;
                }
            }
            if (tile.symbol === '.') {
                if (seenUp && seenDown) {
                    seenUp = false;
                    seenDown = false;
                    isInside = !isInside;
                }
                if (isInside) {
                    tile.symbol = "I";
                    count++;
                }
            }
        });
    });
    // console.log('newMap', inspect(newMap, false, null, true))
    return count;
};
const readMap = () => {
    const input = readInput();
    // console.log("input", input);
    let moves = input.map((l) => parseMove(l));
    let area = digArea(moves);
    let drawing = drawMoves(moves, area);
    // drawing.forEach(l => {
    //   console.log(l.join(''))
    // })
    let count = countDigArea(drawing);
    console.log('cubic meter: ', count);
};
readMap();
//# sourceMappingURL=part1.js.map