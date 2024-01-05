"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const { inspect } = require("util");
const directions = [
    [0, -1], // North
    [0, 1], // South
    [1, 0], // East
    [-1, 0], // West
];
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt", false);
    return lines;
};
const parseTiles = (lines) => {
    let tiles = [];
    let t = [];
    lines.forEach((l, col) => {
        t = l.split("").map((t, row) => ({
            name: `${col},${row}`,
            y: col,
            x: row,
            heatLoss: parseInt(t),
            path: [],
        }));
        tiles.push(t);
    });
    return tiles;
};
const genKey = (tState) => {
    const { tileCol, tileRow, dirCol, dirRow, straightCount } = tState;
    return `${tileCol},${tileRow}:${dirCol},${dirRow}:${straightCount}`;
};
const sortUnvisitedTiles = (unvisisted) => {
    unvisisted.sort((a, b) => a.heatLoss - b.heatLoss);
};
const findPath = (start, end, tiles) => {
    let width = tiles[0].length;
    let height = tiles.length;
    let startState = {
        tileRow: 0,
        tileCol: 0,
        dirRow: 0,
        dirCol: 0,
        heatLoss: 0,
        straightCount: 0,
        prevTiles: [],
    };
    let unvisited = [startState];
    let visited = new Set();
    while (unvisited.length) {
        const state = unvisited.shift();
        const { tileRow, tileCol, dirCol, dirRow, straightCount, heatLoss } = state;
        const stateName = `${tileCol},${tileRow}`;
        // Check if we reached the end Tile
        if (end.name === stateName && straightCount <= 3) {
            console.log("heatLoss", heatLoss);
            console.log('prevTiles', state.prevTiles);
            return heatLoss;
        }
        // Skip already visited tiles
        if (visited.has(genKey(state))) {
            continue;
        }
        // Try moving straight
        if (straightCount < 3 && start.name !== stateName) {
            let newRow = tileRow + dirRow;
            let newCol = tileCol + dirCol;
            // Boundary check
            if (0 <= newRow && newRow < width && 0 <= newCol && newCol < height) {
                unvisited.push({
                    tileRow: newRow,
                    tileCol: newCol,
                    dirRow,
                    dirCol,
                    heatLoss: heatLoss + tiles[newCol][newRow].heatLoss,
                    straightCount: straightCount + 1,
                    prevTiles: [...state.prevTiles, `${tileCol},${tileRow}`]
                });
            }
        }
        // Try all the directions
        for (let [dRow, dCol] of directions) {
            // Don't move straight or backwards.
            if (!(dRow === dirRow && dCol === dirCol) &&
                !(dRow === -dirRow && dCol === -dirCol)) {
                let newRow = tileRow + dRow;
                let newCol = tileCol + dCol;
                // Boundary check
                if (0 <= newRow && newRow < width && 0 <= newCol && newCol < height) {
                    unvisited.push({
                        tileRow: newRow,
                        tileCol: newCol,
                        dirRow: dRow,
                        dirCol: dCol,
                        heatLoss: heatLoss + tiles[newCol][newRow].heatLoss,
                        straightCount: 1,
                        prevTiles: [...state.prevTiles, `${tileCol},${tileRow}`]
                    });
                }
            }
        }
        // Visited the state
        visited.add(genKey(state));
        // Sort Unvisited.
        unvisited.sort((a, b) => a.heatLoss - b.heatLoss);
    }
};
const readMap = () => {
    const input = readInput().filter((i) => i);
    // console.log("input", input);
    let tiles = parseTiles(input);
    console.log("tiles", tiles);
    findPath(tiles[0][0], tiles[tiles.length - 1][tiles[0].length - 1], tiles);
};
readMap();
//# sourceMappingURL=part1.js.map