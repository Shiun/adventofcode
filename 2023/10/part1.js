"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseLine = (line) => {
    return line.split("");
};
// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
const parseMapValue = (value, row, col) => {
    let t = undefined;
    switch (value) {
        case "|":
            t = { dir: ["N", "S"], start: false, ground: false, row, col };
            break;
        case "-":
            t = { dir: ["E", "W"], start: false, ground: false, row, col };
            break;
        case "L":
            t = { dir: ["N", "E"], start: false, ground: false, row, col };
            break;
        case "J":
            t = { dir: ["N", "W"], start: false, ground: false, row, col };
            break;
        case "7":
            t = { dir: ["W", "S"], start: false, ground: false, row, col };
            break;
        case "F":
            t = { dir: ["E", "S"], start: false, ground: false, row, col };
            break;
        case ".":
            t = {
                dir: [],
                start: false,
                ground: true,
                row,
                col,
            };
            break;
        case "S":
            t = {
                dir: [],
                start: true,
                ground: false,
                row,
                col,
            };
            break;
    }
    return t;
};
const tileMap = (maze) => {
    let map = [];
    let start;
    maze.forEach((row, i) => {
        !map[i] ? map.push([]) : undefined;
        row.forEach((col, j) => {
            let tile = parseMapValue(maze[i][j], i, j);
            if (tile === null || tile === void 0 ? void 0 : tile.start)
                start = tile;
            map[i].push(tile);
        });
    });
    return { map, start };
};
const findConnectedDirection = (tile, map) => {
    let directions = [];
    // Check North
    if (tile.row >= 1 &&
        tile.row < map.length &&
        tile.col >= 0 &&
        tile.col < map[0].length) {
        let northTile = map[tile.row - 1][tile.col];
        if (northTile.dir.includes("S"))
            directions.push("N");
    }
    // Check South
    if (tile.row >= 0 &&
        tile.row < map.length - 1 &&
        tile.col >= 0 &&
        tile.col < map[0].length) {
        let northTile = map[tile.row + 1][tile.col];
        if (northTile.dir.includes("N"))
            directions.push("S");
    }
    // Check West
    if (tile.row >= 0 &&
        tile.row < map.length &&
        tile.col >= 1 &&
        tile.col < map[0].length) {
        let northTile = map[tile.row][tile.col - 1];
        if (northTile.dir.includes("E"))
            directions.push("W");
    }
    // Check East
    if (tile.row >= 0 &&
        tile.row < map.length &&
        tile.col >= 0 &&
        tile.col < map[0].length - 1) {
        let northTile = map[tile.row][tile.col + 1];
        if (northTile.dir.includes("W"))
            directions.push("E");
    }
    return directions;
};
const getConnectedTile = (tile, dir, map) => {
    let t = undefined;
    switch (dir) {
        case "N":
            t = map[tile.row - 1][tile.col];
            break;
        case "S":
            t = map[tile.row + 1][tile.col];
            break;
        case "W":
            t = map[tile.row][tile.col - 1];
            break;
        case "E":
            t = map[tile.row][tile.col + 1];
            break;
        default:
            console.log("Error (entering nonconnected title): ", tile, dir);
    }
    return t;
};
const walkMaze = (start, map) => {
    let currTile = undefined;
    let dir = start.dir[0];
    let steps = 0;
    while (currTile != start) {
        steps++;
        currTile = getConnectedTile(currTile ? currTile : start, dir, map);
        // console.log('From dir', dir)
        // console.log("currTile", currTile);
        switch (dir) {
            case "N":
                dir = currTile.dir.filter((d) => d != "S")[0];
                break;
            case "S":
                dir = currTile.dir.filter((d) => d != "N")[0];
                break;
            case "W":
                dir = currTile.dir.filter((d) => d != "E")[0];
                break;
            case "E":
                dir = currTile.dir.filter((d) => d != "W")[0];
                break;
        }
        // console.log('Next dir', dir)
    }
    return steps;
};
const readMaze = () => {
    let lines = readInput();
    let maze = [];
    lines.map((l) => {
        maze.push(parseLine(l));
    });
    // console.log("maze", maze);
    let { map, start } = tileMap(maze);
    // console.log("map", map);
    let dir = findConnectedDirection(start, map);
    // console.log("start dir", dir);
    start.dir = dir;
    console.log("start", start);
    let steps = walkMaze(start, map);
    console.log('steps', steps);
    console.log('furtherest point', steps / 2);
};
readMaze();
