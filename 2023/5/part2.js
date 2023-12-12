"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const util = require('util');
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
        sourceRange: {
            start: numbers[1],
            end: numbers[1] + numbers[2] - 1,
            numValues: numbers[2]
        },
        destRange: {
            start: numbers[0],
            end: numbers[0] + numbers[2] - 1,
            numValues: numbers[2]
        }
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
const seedRanges = (seeds) => {
    const seedRanges = [];
    seeds.forEach((seed, index) => {
        if (index > 0 && index % 2) {
            seedRanges.push({
                start: seeds[index - 1],
                end: seeds[index - 1] + seeds[index] - 1,
                numValues: seeds[index]
            });
        }
    });
    return seedRanges;
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
    // console.log(
    //   `${mapTitle}: `,
    //   fullMap.sort((a, b) => a.sourceRange.start - b.sourceRange.start)
    // );
    return fullMap.sort((a, b) => a.sourceRange.start - b.sourceRange.start);
};
const parseMaps = (lines) => {
    const fullMaps = [];
    for (let i = 0; i < maps.length; i++) {
        const map = parseMap(lines, maps[i]);
        fullMaps.push(map);
    }
    return fullMaps;
};
const compareRange = (range, value) => {
    if (value < range.start) {
        return -1;
    }
    if (value >= range.start && value <= range.end) {
        return 0;
    }
    return 1;
};
const translateRange = (ranges, map) => {
    // console.log('map', map)
    const newRange = [];
    // const remainderRanges: SeedRange[] = []
    for (let rindex = 0; rindex < ranges.length; rindex++) {
        let r = ranges[rindex];
        // console.log('RANGES', ranges)
        // console.log('CHECKING RANGE: ', r)
        let finished = false;
        map.forEach(m => {
            if (finished) {
                return;
            }
            let startResult = compareRange(m.sourceRange, r.start);
            let endResult = compareRange(m.sourceRange, r.end);
            // console.log('Current m:', m)
            // console.log('r.start', r.start)
            // console.log('r.end', r.end)
            // console.log('startResult', startResult)
            // console.log('endResult', endResult, '\n')
            if (startResult < 0) {
                if (endResult < 0) {
                    newRange.push({ start: r.start, end: r.end, numValues: r.numValues });
                }
                if (endResult == 0) {
                    newRange.push({ start: r.start, end: m.sourceRange.start - 1, numValues: m.sourceRange.start - r.start });
                    newRange.push({ start: m.destRange.start, end: m.destRange.start + r.end - m.sourceRange.start, numValues: r.end - m.sourceRange.start + 1 });
                }
                else {
                    newRange.push({ start: r.start, end: m.sourceRange.start - 1, numValues: m.sourceRange.start - r.start });
                    newRange.push({ start: m.destRange.start, end: m.destRange.end, numValues: m.destRange.numValues });
                    ranges.push({ start: m.sourceRange.end + 1, end: r.end, numValues: r.end - m.sourceRange.end });
                }
                finished = true;
            }
            else if (startResult === 0) {
                if (endResult == 0) {
                    newRange.push({ start: r.start - m.sourceRange.start + m.destRange.start, end: r.end - m.sourceRange.start + m.destRange.start, numValues: r.numValues });
                }
                else {
                    newRange.push({ start: r.start - m.sourceRange.start + m.destRange.start, end: m.destRange.end, numValues: m.destRange.end - (r.start - m.sourceRange.start + m.destRange.start) + 1 });
                    ranges.push({ start: m.sourceRange.end + 1, end: r.end, numValues: r.end - m.sourceRange.end });
                }
                finished = true;
            }
            // console.log('current newRange', newRange)
        });
        if (!finished) {
            newRange.push({ start: r.start, end: r.end, numValues: r.numValues });
            // console.log('current newRange', newRange)
        }
        finished = false;
    }
    return newRange;
};
const processInput = () => {
    var _a;
    const lines = readInput();
    const seeds = (_a = parseSeeds(lines)) === null || _a === void 0 ? void 0 : _a.map((i) => parseInt(i));
    // console.log("seeds: ", seeds);
    const ranges = seedRanges(seeds).sort((a, b) => a.start - b.start);
    console.log("seed ranges :", ranges);
    const fullMaps = parseMaps(lines);
    // console.log("fullMaps", util.inspect(fullMaps, false, null, true))
    // const firstMap = fullMaps[0]
    // console.log('First Map', firstMap)
    // const newRange = translateRange(ranges, firstMap)
    // console.log('New Range', newRange.sort((a, b) => a.start - b.start))
    let resultRange = ranges;
    fullMaps.forEach(m => {
        resultRange = translateRange(resultRange, m).sort((a, b) => a.start - b.start);
        // console.log('New Result Range', resultRange, '\n\n')
    });
    // console.log('resultRange', resultRange)
    let location = resultRange[0].start;
    resultRange.forEach(r => {
        if (r.start < location) {
            location = r.start;
        }
    });
    console.log('Final lowest location:', location);
};
processInput();
