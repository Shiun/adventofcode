import { inputLinesArray } from "../utils/utils";
const { inspect } = require("util");

type ModuleString = "%" | "&" | undefined;
type ModuleType = "F" | "C" | "B";
type Signal = "high" | "low";

type ModuleState = {
  on: boolean;
};

type SignalInput = {
  from: string;
  to: string;
  signal: Signal;
};

type Module = {
  type: ModuleType;
  name: string;
  dests: string[];
  ins: Map<string, SignalInput>;
  on?: boolean; // Flip-Flop state.
};

const readInput = () => {
  const lines = inputLinesArray("input.txt", false);
  return lines;
};

const parseType = (tString: ModuleString): ModuleType => {
  switch (tString) {
    case "&":
      return "C";
    case "%":
      return "F";
  }
  return "B";
};

const parseModule = (line: string) => {
  let regEx = /^(?<type>[%&]*)(?<name>[\w]+) -> (?<dests>[a-z\,\s]+)$/;
  let match = line.match(regEx)!;

  let dests = match.groups!.dests.split(", ");
  let type = parseType(match.groups!.type as ModuleString);
  let name = match.groups!.name;

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

const connectModules = (modulesMap: Map<string, Module>) => {
  modulesMap.forEach((v, k, map) => {
    v.dests.forEach((d) => {
      let destModule = map.get(d)!;
      destModule?.ins.set(k, { from: k, to: d, signal: "low" });
    });
  });
};

const resetConjunctionModules = (modulesMap: Map<string, Module>) => {
  modulesMap.forEach((v, k, map) => {
    if (v.type === "C") {
      v.dests.forEach((d) => {
        let destModule = map.get(d)!;
        destModule?.ins.set(k, { from: k, to: d, signal: "low" });
      });
    }
  });
};

const moduleState = (modulesMap: Map<string, Module>) => {
  let state: { [k: string]: object } = {};
  modulesMap.forEach((v, k, map) => {
    state[k] = { on: v.on, ins: v.ins };
  });
  return state;
};

const processFlipFlopModule = (module: Module, signalInput: SignalInput) => {
  if (signalInput.signal === "high") {
    return [];
  }

  module.on = !module.on;
  let outSignal: Signal = module.on ? "high" : "low";
  let newSignals: SignalInput[] = module.dests.map((dest) => ({
    from: module.name,
    to: dest,
    signal: outSignal,
  }));
  return newSignals;
};

const processConjunctionModule = (module: Module, signalInput: SignalInput) => {
  module.ins.get(signalInput.from)!.signal = signalInput.signal;

  let allHighSignals = true;
  module.ins.forEach((v) => {
    v.signal !== "high" ? (allHighSignals = false) : undefined;
  });

  let newSignals: SignalInput[] = module.dests.map((dest) => ({
    from: module.name,
    to: dest,
    signal: allHighSignals ? "low" : "high",
  }));
  return newSignals;
};

const processSignal = (module: Module, signalInput: SignalInput) => {
  switch (module?.type) {
    case "F":
      return processFlipFlopModule(module, signalInput);
    case "C":
      return processConjunctionModule(module, signalInput);
  }
  return [];
};

const processPulses = (modulesMap: Map<string, Module>) => {
  let broadcast = modulesMap.get("broadcaster");
  let signals: SignalInput[] = [];

  let low = 1; //Initial low to broadcaster
  let high = 0;
  // console.log(`button -> low -> broadcaster`);
  broadcast?.dests.forEach((dest) => {
    signals.push({ from: "broadcaster", to: dest, signal: "low" });
  });

  while (signals.length !== 0) {
    let s = signals.shift()!;
    let m = modulesMap.get(s.to)!;

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

  const modulesMap = new Map<string, Module>();

  // Parse modules
  input.forEach((l: string) => {
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
  let lowCount = 0
  let highCount = 0
  while (JSON.stringify(initState) !== JSON.stringify(postProcessedState) && cycleCount < 1000) {
    resetConjunctionModules(modulesMap);
    result = processPulses(modulesMap);
    cycleCount++;
    // console.log(`Cycle (${cycleCount}) low, high: `, result.low, result.high);
    lowCount += result.low
    highCount += result.high
    postProcessedState = moduleState(modulesMap);
  }


  let multiplier = 1000 / cycleCount
  let remainder = 1000 % cycleCount

  console.log('cycleCount', cycleCount)
  console.log('multiplier', multiplier)
  console.log('remainder', remainder)

  let totalLow = lowCount * multiplier
  let totalHigh = highCount * multiplier

  console.log(`Total: (totalLow * totalHigh) = :(${totalLow} * (${totalHigh}) = ${totalLow * totalHigh})`)
};

readConfiguration();
