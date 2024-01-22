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
const resetConjunctionModules = (modulesMap) => {
    modulesMap.forEach((v, k, map) => {
        if (v.type === "C") {
            v.dests.forEach((d) => {
                let destModule = map.get(d);
                destModule?.ins.set(k, { from: k, to: d, signal: "low" });
            });
        }
    });
};
const moduleState = (modulesMap) => {
    let state = {};
    modulesMap.forEach((v, k, map) => {
        state[k] = { on: v.on, ins: v.ins };
    });
    return state;
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
const processPulses = (modulesMap) => {
    let broadcast = modulesMap.get("broadcaster");
    let signals = [];
    let low = 1; //Initial low to broadcaster
    let high = 0;
    // console.log(`button -> low -> broadcaster`);
    broadcast?.dests.forEach((dest) => {
        signals.push({ from: "broadcaster", to: dest, signal: "low" });
    });
    while (signals.length !== 0) {
        let s = signals.shift();
        let m = modulesMap.get(s.to);
        s.signal === "high" ? high++ : low++;
        // console.log(`${s.from} -> ${s.signal} -> ${s.to}`);
        let newSignals = processSignal(m, s);
        signals.push(...newSignals);
    }
    return { high, low };
};
const readConfiguration = () => {
    const input = readInput();
    // console.log("input", input);
    const modulesMap = new Map();
    // Parse modules
    input.forEach((l) => {
        let { name, module } = parseModule(l);
        modulesMap.set(name, module);
    });
    // Initialize connections between modules
    connectModules(modulesMap);
    console.log("BEFORE modulesMap", inspect(modulesMap, false, null, true));
    // Get Initial State
    let initState = moduleState(modulesMap);
    let result;
    let postProcessedState = {};
    let cycleCount = 0;
    let lowCount = 0;
    let highCount = 0;
    while (JSON.stringify(initState) !== JSON.stringify(postProcessedState) && cycleCount < 1000) {
        resetConjunctionModules(modulesMap);
        result = processPulses(modulesMap);
        cycleCount++;
        // console.log(`Cycle (${cycleCount}) low, high: `, result.low, result.high);
        lowCount += result.low;
        highCount += result.high;
        postProcessedState = moduleState(modulesMap);
    }
    let multiplier = 1000 / cycleCount;
    let remainder = 1000 % cycleCount;
    console.log('cycleCount', cycleCount);
    console.log('multiplier', multiplier);
    console.log('remainder', remainder);
    let totalLow = lowCount * multiplier;
    let totalHigh = highCount * multiplier;
    console.log(`Total: (totalLow * totalHigh) = :(${totalLow} * (${totalHigh}) = ${totalLow * totalHigh})`);
};
readConfiguration();
//# sourceMappingURL=part1.js.map