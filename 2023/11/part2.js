"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const util = require("util");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseLine = (line) => {
    return line.split("");
};
const drawMap = (label, map) => {
    let drawnMap = map.map((r) => {
        return r.map((c) => c).join("") + "            ";
    });
    console.log(`${label}`, drawnMap);
};
const locateGalaxies = (map) => {
    let galaxies = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
            if (map[row][col] === "#") {
                galaxies.push({
                    imageCoord: { row, col },
                    expandedCoord: { row, col },
                });
            }
        }
    }
    return galaxies;
};
const calculateExpansion = (galaxies, map, expansionRate) => {
    // Row Expansion
    for (let r = 0; r < map.length; r++) {
        let row = map[r];
        if (!row.includes("#")) {
            galaxies
                .filter((g) => g.imageCoord.row > r)
                .forEach((g) => (g.expandedCoord.row += expansionRate - 1));
        }
    }
    // Col Expansion
    for (let col = 0; col < map[0].length; col++) {
        let hasGalaxy = false;
        for (let row = 0; row < map.length; row++) {
            if (map[row][col] === "#") {
                hasGalaxy = true;
            }
        }
        if (!hasGalaxy) {
            galaxies
                .filter((g) => g.imageCoord.col > col)
                .forEach((g) => (g.expandedCoord.col += expansionRate - 1));
            hasGalaxy = false;
        }
    }
};
const locateDistanceToNeighbors = (galaxy, galaxies) => {
    let sum = 0;
    let all = [];
    galaxies.forEach((n) => {
        let d = Math.abs(galaxy.expandedCoord.row - n.expandedCoord.row) +
            Math.abs(galaxy.expandedCoord.col - n.expandedCoord.col);
        sum += d;
        all.push(d);
    });
    return { galaxy, sum, all };
};
const readStarMap = () => {
    let lines = readInput();
    let map = [];
    lines.map((l) => {
        map.push(parseLine(l));
    });
    drawMap("map", map);
    let galaxies = locateGalaxies(map);
    console.log("galaxies", galaxies);
    let expansionRate = 1000000;
    calculateExpansion(galaxies, map, expansionRate);
    console.log("expanded galaxies", galaxies);
    let reducedGalaxies = Array.from(galaxies, (x) => x);
    let results = galaxies.map((g) => {
        reducedGalaxies.splice(reducedGalaxies.indexOf(g), 1);
        return locateDistanceToNeighbors(g, reducedGalaxies);
    });
    console.log("results", util.inspect(results, false, null, true));
    let sum = results.reduce((a, b) => a + b.sum, 0);
    console.log("sum", sum);
};
readStarMap();
