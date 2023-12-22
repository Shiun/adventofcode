"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt", false);
    return lines;
};
const parseLine = (line) => {
    return line.split(",");
};
const parseSequence = (line) => {
    let seqRegEx = /^([a-z]+)([-=])([1-9]*)$/;
    let match = line.match(seqRegEx);
    let sequence = {};
    sequence.hash = match[1];
    sequence.hashValue = formulateValue(match[1]);
    sequence.operation = match[2];
    if (sequence.operation === '=') {
        sequence.lensValue = parseInt(match[3]);
    }
    // console.log('sequence', sequence)
    return sequence;
};
const formulateValue = (line) => {
    let value = 0;
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        value += char.charCodeAt(0);
        value *= 17;
        value %= 256;
    }
    return value;
};
const equalOperation = (boxes, sequence) => {
    if (!boxes[sequence.hashValue]) {
        boxes[sequence.hashValue] = [];
    }
    let sIndex = boxes[sequence.hashValue].findIndex(s => s.hash == sequence.hash);
    if (sIndex !== -1) {
        boxes[sequence.hashValue].splice(sIndex, 1, sequence);
    }
    else {
        boxes[sequence.hashValue].push(sequence);
    }
};
const dashOperation = (boxes, sequence) => {
    if (!boxes[sequence.hashValue]) {
        boxes[sequence.hashValue] = [];
    }
    boxes[sequence.hashValue] = boxes[sequence.hashValue].filter(s => s.hash != sequence.hash);
};
const fileBoxes = (boxes, sequences) => {
    sequences.forEach(s => {
        switch (s.operation) {
            case '=':
                equalOperation(boxes, s);
                break;
            case '-':
                dashOperation(boxes, s);
                break;
        }
    });
};
const calculateBoxPower = (box) => {
    return box.reduce((a, s, i) => a += (i + 1) * s.lensValue, 0);
};
const calculateFocusPower = (boxes) => {
    return boxes.reduce((a, b, i) => a += (i + 1) * calculateBoxPower(b), 0);
};
const readSequence = () => {
    const input = readInput();
    // console.log('input', input)
    let seqStrings = parseLine(input[0]);
    // console.log('seqStrings', seqStrings)
    let sequences = seqStrings.map((s) => parseSequence(s));
    let boxes = new Array(256);
    boxes.forEach(b => b = []);
    fileBoxes(boxes, sequences);
    let sum = calculateFocusPower(boxes);
    console.log('Focus power', sum);
    // console.log('boxes', boxes)
    // let values = sequence.map(s => formulateValue(s))
    // console.log('values', values)
    // let sum = values.reduce((a, v) => a + v, 0)
    // console.log('sum', sum)
};
readSequence();
