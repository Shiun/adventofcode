"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const readSequence = (line) => {
    return line.split("");
};
const parseMap = (lines) => {
    let map = new Map();
    const mapRegex = /^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)$/;
    lines.forEach((l) => {
        const m = l.match(mapRegex);
        if (m) {
            let node = { left: m[2], right: m[3] };
            map.set(m[1], node);
        }
    });
    return map;
};
const bruteForceWalk = (sequence, map) => {
    let numSteps = 0;
    let currentNode = 'AAA';
    let sequenceIndex = 0;
    while (currentNode !== 'ZZZ') {
        let nextNodes = map.get(currentNode);
        let direction = sequence[sequenceIndex];
        // console.log('nextNodes', nextNodes)
        // console.log('direction', direction)
        switch (direction) {
            case 'L':
                currentNode = nextNodes === null || nextNodes === void 0 ? void 0 : nextNodes.left;
                break;
            case 'R':
                currentNode = nextNodes === null || nextNodes === void 0 ? void 0 : nextNodes.right;
                break;
        }
        sequenceIndex = (++sequenceIndex) % sequence.length;
        // console.log('sequenceIndex', sequenceIndex)
        numSteps++;
    }
    console.log('numSteps', numSteps);
};
const readMap = () => {
    let lines = readInput();
    let sequence = readSequence(lines[0]);
    console.log("Sequence", sequence);
    let map = parseMap(lines);
    console.log('map', map);
    bruteForceWalk(sequence, map);
};
readMap();
