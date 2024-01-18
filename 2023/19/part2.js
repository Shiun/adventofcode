"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const { inspect } = require("util");
const MIN_VALUE = 1;
const MAX_VALUE = 4000;
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt", false);
    return lines;
};
const parseRule = (rule) => {
    const regEx = /^([xmas])([<>])(\d+):([a-zAR]+)$/;
    const match = rule.match(regEx);
    const part = match[1];
    const operation = match[2];
    const amount = parseInt(match[3]);
    const state = match[4];
    return {
        part: part,
        operation: operation,
        amount,
        state,
    };
};
const parseRuleString = (rule) => {
    const regEx = /^([a-z]+){(.*)}$/;
    const match = rule.match(regEx);
    let state = match[1];
    let rulesString = match[2];
    const rules = rulesString.split(",");
    let finalState = "";
    let ruleArray = [];
    rules.forEach((r, i) => {
        if (i === rules.length - 1) {
            finalState = r;
        }
        else {
            ruleArray.push(parseRule(r));
        }
    });
    return { state, rules: ruleArray, finalState };
};
const parseData = (data) => {
    const divide = data.findIndex((l) => l === "");
    let rulesData = data.slice(0, divide);
    let workflows = new Map();
    rulesData.forEach((r, i) => {
        const results = parseRuleString(r);
        workflows.set(results.state, results);
    });
    return { workflows };
};
const getPartMinMax = (part, partsRange) => {
    let min;
    let max;
    switch (part) {
        case "x":
            min = partsRange.xMin;
            max = partsRange.xMax;
            break;
        case "m":
            min = partsRange.mMin;
            max = partsRange.mMax;
            break;
        case "a":
            min = partsRange.aMin;
            max = partsRange.aMax;
            break;
        case "s":
            min = partsRange.sMin;
            max = partsRange.sMax;
            break;
    }
    return { min, max };
};
const setPartMinMax = (part, min, max, partsRange) => {
    switch (part) {
        case "x":
            partsRange.xMin = min;
            partsRange.xMax = max;
            break;
        case "m":
            partsRange.mMin = min;
            partsRange.mMax = max;
            break;
        case "a":
            partsRange.aMin = min;
            partsRange.aMax = max;
            break;
        case "s":
            partsRange.sMin = min;
            partsRange.sMax = max;
            break;
    }
    return partsRange;
};
const createNewRange = (part, min, max, range, state) => {
    const newRange = Object.assign({}, range);
    newRange.state = state;
    switch (part) {
        case "x":
            newRange.xMin = min;
            newRange.xMax = max;
            break;
        case "m":
            newRange.mMin = min;
            newRange.mMax = max;
            break;
        case "a":
            newRange.aMin = min;
            newRange.aMax = max;
            break;
        case "s":
            newRange.sMin = min;
            newRange.sMax = max;
            break;
    }
    return newRange;
};
const findNextStateAndRanges = (range, stateRules) => {
    let rules = stateRules.rules;
    let finalState = stateRules.finalState;
    let result = [];
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let { min, max } = getPartMinMax(rule.part, range);
        switch (rule.operation) {
            case "<":
                if (max > rule.amount) {
                    result.push(createNewRange(rule.part, min, rule.amount - 1, range, rule.state));
                    // modify the current range
                    setPartMinMax(rule.part, rule.amount, max, range);
                }
                break;
            case ">":
                if (min < rule.amount) {
                    result.push(createNewRange(rule.part, rule.amount + 1, max, range, rule.state));
                    // modify the current range
                    setPartMinMax(rule.part, min, rule.amount, range);
                }
                break;
        }
    }
    // final ranges goes to leftover range.
    range.state = finalState;
    result.push(range);
    return result;
};
const workFlowSum = (partsRange, workflows) => {
    let ranges = [partsRange];
    let endRanges = [];
    while (ranges.length !== 0) {
        let range = ranges.pop();
        // End ranges don't need further processing
        if (range.state === 'A' || range.state === 'R') {
            endRanges.push(range);
            continue;
        }
        let stateRules = workflows.get(range.state);
        const newRanges = findNextStateAndRanges(range, stateRules);
        ranges.push(...newRanges);
    }
    return endRanges;
};
const calculateSum = (ranges) => {
    let sum = 0;
    ranges.forEach(r => {
        let combo = 1;
        ['x', 'm', 'a', 's'].forEach(p => {
            let { min, max } = getPartMinMax(p, r);
            combo *= (max - min + 1);
        });
        sum += combo;
    });
    return sum;
};
const readMap = () => {
    const input = readInput();
    const data = parseData(input);
    // console.log("data", data);
    let initRange = {
        xMin: MIN_VALUE,
        xMax: MAX_VALUE,
        mMin: MIN_VALUE,
        mMax: MAX_VALUE,
        aMin: MIN_VALUE,
        aMax: MAX_VALUE,
        sMin: MIN_VALUE,
        sMax: MAX_VALUE,
        state: "in"
    };
    let results = workFlowSum(initRange, data.workflows);
    // console.log('results', results)
    let accepted = results.filter(r => r.state === 'A');
    // console.log('accepted', accepted)
    let sum = calculateSum(accepted);
    console.log('sum', sum);
};
readMap();
//# sourceMappingURL=part2.js.map