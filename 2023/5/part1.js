"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const maps = [
    "seed-to-soil map:",
    "soil-to-fertilizer map:",
    "fertilizer-to-water map:",
    "water-to-light map:",
    "light-to-temperature map:",
    "temperature-to-humidity map:",
    "humidity-to-location map:",
];
const rangeEntry = (numbers) => {
    return {
        sourceStart: numbers[1],
        sourceEnd: numbers[1] + numbers[2] - 1,
        destStart: numbers[0],
        destEnd: numbers[0] + numbers[2] - 1,
        range: numbers[2],
    };
};
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseSeeds = (lines) => {
    const seedsRegex = /^seeds: ([\d ]*)$/;
    let seedMatch = lines[0].match(seedsRegex);
    const seeds = seedMatch === null || seedMatch === void 0 ? void 0 : seedMatch[1].split(" ");
    return seeds;
};
const parseMap = (lines, mapTitle) => {
    let i = 0;
    let found = false;
    while (i < lines.length && !found) {
        if (lines[i] === mapTitle) {
            found = true;
        }
        i++;
    }
    const fullMap = [];
    let finish = false;
    while (i < lines.length && !finish) {
        const numbers = lines[i].split(" ").map((i) => parseInt(i));
        if (lines[i].split(" ").length != 3) {
            finish = true;
        }
        else {
            const range = rangeEntry(numbers);
            fullMap.push(range);
            i++;
        }
    }
    console.log(`${mapTitle}: `, fullMap.sort((a, b) => a.sourceStart - b.sourceStart));
    return fullMap.sort((a, b) => a.sourceStart - b.sourceStart);
};
const locationForSeed = (fullMaps, seed) => {
    console.log("seed: ", seed);
    let started = seed;
    let mapped = -1;
    fullMaps.forEach((map, mapIndex) => {
        let i = 0;
        let found = false;
        while (i < map.length && !found) {
            let range = map[i++];
            // Before range
            if (started < range.sourceStart) {
                console.log("before range");
                mapped = started;
                found = true;
            }
            // In Range
            if (started >= range.sourceStart && started <= range.sourceEnd) {
                mapped = started - range.sourceStart + range.destStart;
                console.log("STARTED", started);
                console.log("MAPPED", mapped);
                found = true;
            }
        }
        // After range
        if (!found) {
            console.log("after range");
            mapped = started;
        }
        console.log(`${maps[mapIndex]}: ${started} -> ${mapped}\n\n`);
        started = mapped;
        found = false;
    });
    return { seed, location: mapped };
};
const processInput = () => {
    var _a;
    const lines = readInput();
    const seeds = (_a = parseSeeds(lines)) === null || _a === void 0 ? void 0 : _a.map((i) => parseInt(i));
    console.log("seeds: ", seeds);
    const fullMaps = [];
    for (let i = 0; i < maps.length; i++) {
        const map = parseMap(lines, maps[i]);
        fullMaps.push(map);
    }
    const results = [];
    seeds === null || seeds === void 0 ? void 0 : seeds.forEach(seed => {
        let result = locationForSeed(fullMaps, seed);
        results.push(result);
    });
    console.log('Results', results);
    let location = results[0].location;
    results.forEach(r => {
        if (location > r.location) {
            location = r.location;
        }
    });
    console.log('Final location:', location);
};
processInput();
