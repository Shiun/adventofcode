"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const { inspect } = require("util");
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
const parsePartString = (partString) => {
    const regEx = /^{x=([\d]+),m=([\d]+),a=([\d]+),s=([\d]+)}$/;
    const match = partString.match(regEx);
    const x = parseInt(match[1]);
    const m = parseInt(match[2]);
    const a = parseInt(match[3]);
    const s = parseInt(match[4]);
    return { x, m, a, s };
};
const parseData = (data) => {
    const divide = data.findIndex((l) => l === "");
    let rulesData = data.slice(0, divide);
    let workflows = new Map();
    rulesData.forEach((r, i) => {
        const results = parseRuleString(r);
        workflows.set(results.state, results);
    });
    let partsData = data.slice(divide + 1);
    let parts = partsData.map((p) => parsePartString(p));
    return { workflows, parts };
};
const findNextState = (part, stateRules) => {
    let rules = stateRules.rules;
    let finalState = stateRules.finalState;
    for (let i = 0; i < rules.length; i++) {
        let r = rules[i];
        let partValue = part[r.part];
        switch (r.operation) {
            case "<":
                if (partValue < r.amount) {
                    return r.state;
                }
                break;
            case ">":
                if (partValue > r.amount) {
                    return r.state;
                }
                break;
        }
    }
    return finalState;
};
const workFlowValue = (state, part, workflows) => {
    let stateRules = workflows.get(state);
    let prevState = state;
    let nextState = state;
    while (nextState !== "A" && nextState !== "R") {
        prevState = nextState;
        nextState = findNextState(part, stateRules);
        stateRules = workflows.get(nextState);
        // console.log(`${prevState} => ${nextState}`);
    }
    if (nextState === "A") {
        // console.log('part', part)
        return part.x + part.m + part.a + part.s;
    }
    return 0;
};
const readMap = () => {
    const input = readInput();
    const data = parseData(input);
    // console.log("data", data);
    let sum = 0;
    data.parts.forEach(p => {
        let result = workFlowValue("in", p, data.workflows);
        // console.log('p', p, result)
        sum += result;
    });
    console.log('sum', sum);
    // workFlowValue("in", data.parts[0], data.workflows);
};
readMap();
//# sourceMappingURL=part1.js.map