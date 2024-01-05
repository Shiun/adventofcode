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
const addAndSortUnvisited = (state, unvisisted) => {
    // Initial empty list
    if (unvisisted.length === 0) {
        unvisisted.push(state);
        return;
    }
    // O(n) insert
    for (let i = unvisisted.length - 1; 0 <= i; i--) {
        if (unvisisted[i].heatLoss <= state.heatLoss) {
            unvisisted.splice(i + 1, 0, state);
            return;
        }
    }
    // Insert at front of list for lowest heatLoss
    unvisisted.unshift(state);
};
const findPath = (start, end, tiles, minSteps, maxSteps) => {
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
        // Also we can only stop AFTER minSteps
        if (end.name === stateName && straightCount >= minSteps) {
            console.log("heatLoss", heatLoss);
            console.log("prevTiles", state.prevTiles);
            return heatLoss;
        }
        // Skip already visited tiles
        if (visited.has(genKey(state))) {
            continue;
        }
        // Try moving straight
        if (straightCount < maxSteps && start.name !== stateName) {
            let newRow = tileRow + dirRow;
            let newCol = tileCol + dirCol;
            // Boundary check
            if (0 <= newRow && newRow < width && 0 <= newCol && newCol < height) {
                addAndSortUnvisited({
                    tileRow: newRow,
                    tileCol: newCol,
                    dirRow,
                    dirCol,
                    heatLoss: heatLoss + tiles[newCol][newRow].heatLoss,
                    straightCount: straightCount + 1,
                    prevTiles: [...state.prevTiles, `${tileCol},${tileRow}`],
                }, unvisited);
            }
        }
        // Try all the directions
        if (start.name == stateName || straightCount >= minSteps) {
            for (let [dRow, dCol] of directions) {
                // Turn only after minSteps (Exception, first tile can "turn")
                // Don't move straight or backwards.
                if (!(dRow === dirRow && dCol === dirCol) &&
                    !(dRow === -dirRow && dCol === -dirCol)) {
                    let newRow = tileRow + dRow;
                    let newCol = tileCol + dCol;
                    // Boundary check
                    if (0 <= newRow && newRow < width && 0 <= newCol && newCol < height) {
                        addAndSortUnvisited({
                            tileRow: newRow,
                            tileCol: newCol,
                            dirRow: dRow,
                            dirCol: dCol,
                            heatLoss: heatLoss + tiles[newCol][newRow].heatLoss,
                            straightCount: 1,
                            prevTiles: [...state.prevTiles, `${tileCol},${tileRow}`],
                        }, unvisited);
                    }
                }
            }
        }
        // Visited the state
        visited.add(genKey(state));
        // // Sort Unvisited.
        // unvisited.sort((a, b) => a.heatLoss - b.heatLoss);
    }
};
const readMap = () => {
    const input = readInput().filter((i) => i);
    // console.log("input", input);
    let tiles = parseTiles(input);
    // console.log("tiles", tiles);
    findPath(tiles[0][0], tiles[tiles.length - 1][tiles[0].length - 1], tiles, 0, 3);
    findPath(tiles[0][0], tiles[tiles.length - 1][tiles[0].length - 1], tiles, 4, 10);
};
readMap();
//# sourceMappingURL=part2.js.map