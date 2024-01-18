import { inputLinesArray } from "../utils/utils";
const { inspect } = require("util");

type Operation = "<" | ">";
type PartName = "x" | "m" | "a" | "s";

const MIN_VALUE = 1;
const MAX_VALUE = 4000;

type Rule = {
  part: PartName;
  operation: Operation;
  amount: number;
  state: string;
};

type PartsRange = {
  xMin: number;
  xMax: number;
  mMin: number;
  mMax: number;
  aMin: number;
  aMax: number;
  sMin: number;
  sMax: number;
  state: string;
};

type StateRules = {
  state: string;
  rules: Rule[];
  finalState: string;
};

const readInput = () => {
  const lines = inputLinesArray("input.txt", false);
  return lines;
};

const parseRule = (rule: string): Rule => {
  const regEx = /^([xmas])([<>])(\d+):([a-zAR]+)$/;
  const match = rule.match(regEx);
  const part = match![1];
  const operation = match![2];
  const amount = parseInt(match![3]);
  const state = match![4];
  return {
    part: <PartName>part,
    operation: <Operation>operation,
    amount,
    state,
  };
};

const parseRuleString = (rule: string): StateRules => {
  const regEx = /^([a-z]+){(.*)}$/;
  const match = rule.match(regEx);

  let state = match![1];
  let rulesString = match![2];

  const rules = rulesString.split(",");
  let finalState: string = "";
  let ruleArray: Rule[] = [];
  rules.forEach((r, i) => {
    if (i === rules.length - 1) {
      finalState = r;
    } else {
      ruleArray.push(parseRule(r));
    }
  });

  return { state, rules: ruleArray, finalState };
};

const parseData = (data: string[]) => {
  const divide = data.findIndex((l) => l === "");
  let rulesData = data.slice(0, divide);

  let workflows = new Map<string, StateRules>();
  rulesData.forEach((r, i) => {
    const results = parseRuleString(r);
    workflows.set(results.state, results);
  });

  return { workflows };
};

const getPartMinMax = (part: PartName, partsRange: PartsRange) => {
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

const setPartMinMax = (part: PartName, min: number, max: number, partsRange: PartsRange) => {
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
  return partsRange
}


const createNewRange = (part: PartName, min: number, max: number, range: PartsRange, state: string) => {
  const newRange = Object.assign({}, range)
  newRange.state = state
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
  return newRange
}

const findNextStateAndRanges = (range: PartsRange, stateRules: StateRules) => {
  let rules = stateRules.rules;
  let finalState = stateRules.finalState;

  let result: PartsRange[] = []
  for (let i = 0; i < rules.length; i++) {
    let rule = rules[i]

    let { min, max } = getPartMinMax(rule.part, range);
    switch (rule.operation) {
      case "<":
        if (max > rule.amount) {
          result.push(createNewRange(rule.part, min, rule.amount - 1, range, rule.state))
          // modify the current range
          setPartMinMax(rule.part, rule.amount, max, range)
        }
        break;
      case ">":
        if (min < rule.amount) {
          result.push(createNewRange(rule.part, rule.amount + 1, max, range, rule.state))
          // modify the current range
          setPartMinMax(rule.part, min, rule.amount, range)
        }
        break;
    }
  }

  // final state goes to leftover range.
  range.state = finalState
  result.push(range)

  return result
}

const workFlowSum = (
  partsRange: PartsRange,
  workflows: Map<string, StateRules>
): PartsRange[] => {
  let ranges = [partsRange]

  let endRanges: PartsRange[] = []
  while(ranges.length !== 0) {
    let range = ranges.pop()!
    
    // End ranges don't need further processing
    if (range.state === 'A' || range.state === 'R') {
      endRanges.push(range)
      continue;
    }

    let stateRules = workflows.get(range!.state)!
    const newRanges = findNextStateAndRanges(range, stateRules)
    ranges.push(...newRanges)
  }

  return endRanges
};

const calculateSum = (ranges: PartsRange[]) => {
  let sum = 0
  ranges.forEach(r => {
    let combo = 1;
    ['x', 'm', 'a', 's'].forEach(p => {
      let { min, max } = getPartMinMax(p as PartName, r)
      combo *= (max - min + 1)
    })
    sum += combo
  })
  return sum
}

const readMap = () => {
  const input = readInput();
  const data = parseData(input);

  // console.log("data", data);

  let initRange: PartsRange = {
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
  let accepted = results.filter(r => r.state === 'A')
  // console.log('accepted', accepted)

  let sum = calculateSum(accepted)
  console.log('sum', sum)
};

readMap();


