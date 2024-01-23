"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const { inspect } = require("util");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt", false);
    return lines;
};
const parseType = (tString) => {
    switch (tString) {
        case "&":
            return "C";
        case "%":
            return "F";
    }
    return "B";
};
const parseModule = (line) => {
    let regEx = /^(?<type>[%&]*)(?<name>[\w]+) -> (?<dests>[a-z\,\s]+)$/;
    let match = line.match(regEx);
    let dests = match.groups.dests.split(", ");
    let type = parseType(match.groups.type);
    let name = match.groups.name;
    // match.groups!.type ? console.log("type", match.groups!.type) : undefined;
    // console.log("name", name);
    // console.log("dests", name);
    switch (type) {
        case "B":
            return { name, module: { type, name, dests, ins: new Map() } };
        case "F":
            return { name, module: { type, name, dests, ins: new Map(), on: false } };
        case "C":
            return { name, module: { type, name, dests, ins: new Map() } };
    }
};
const connectModules = (modulesMap) => {
    modulesMap.forEach((v, k, map) => {
        v.dests.forEach((d) => {
            let destModule = map.get(d);
            destModule?.ins.set(k, { from: k, to: d, signal: "low" });
        });
    });
};
const processFlipFlopModule = (module, signalInput) => {
    if (signalInput.signal === "high") {
        return [];
    }
    module.on = !module.on;
    let outSignal = module.on ? "high" : "low";
    let newSignals = module.dests.map((dest) => ({
        from: module.name,
        to: dest,
        signal: outSignal,
    }));
    return newSignals;
};
const processConjunctionModule = (module, signalInput) => {
    module.ins.get(signalInput.from).signal = signalInput.signal;
    let allHighSignals = true;
    module.ins.forEach((v) => {
        v.signal !== "high" ? (allHighSignals = false) : undefined;
    });
    let newSignals = module.dests.map((dest) => ({
        from: module.name,
        to: dest,
        signal: allHighSignals ? "low" : "high",
    }));
    return newSignals;
};
const processSignal = (module, signalInput) => {
    switch (module?.type) {
        case "F":
            return processFlipFlopModule(module, signalInput);
        case "C":
            return processConjunctionModule(module, signalInput);
    }
    return [];
};
const processPulses = (modulesMap, conjunction) => {
    let broadcast = modulesMap.get("broadcaster");
    let c = conjunction;
    let done = false;
    let counter = 0;
    while (!done) {
        counter++;
        // resetConjunctionModules(modulesMap);
        broadcast?.dests.forEach((dest) => {
            let signals = [];
            signals.push({ from: "broadcaster", to: dest, signal: "low" });
            while (signals.length !== 0 && !done) {
                let s = signals.shift();
                let m = modulesMap.get(s.to);
                if (s.from === c && s.signal === "high") {
                    done = true;
                    continue;
                }
                let newSignals = processSignal(m, s);
                signals.push(...newSignals);
            }
        });
    }
    return counter;
};
// Least common multiplier (lcm)
// Greatest common denominator (gcd)
// lcm(a, b) = a * b / gcd(a, b)
const gcd = (a, b) => {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
};
const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
};
const readConfiguration = () => {
    const input = readInput();
    // console.log("input", input);
    const modulesMap = new Map();
    let result = [];
    // These are the conjunctions that we need to process
    // looking for high signals from these that then is sent to 
    // conjunction module 'ns', resulting in a low signal to 'rx'
    ["dc", "rv", "vp", "cq"].forEach((c) => {
        const modulesMap = new Map();
        // Parse modules
        input.forEach((l) => {
            let { name, module } = parseModule(l);
            modulesMap.set(name, module);
        });
        // Initialize connections between modules
        connectModules(modulesMap);
        result.push(processPulses(modulesMap, c));
    });
    let multiplier = result.reduce((sum, c) => lcm(sum, c), 1);
    console.log("common multiplier", multiplier);
};
readConfiguration();
//# sourceMappingURL=part2.js.map