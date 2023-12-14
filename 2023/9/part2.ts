import { inputLinesArray } from "../utils/utils";

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const parseNumbers = (line: string) => {
  return line.split(" ").map(n => parseInt(n));
};

const findNextDiff = (nums: number[]): number => {
  let diff = nums.map((num, i) => {
    if (i < nums.length - 1) {
      return nums[ i + 1] - num
    }
    return NaN
  }).filter(n => !Number.isNaN(n))
  // console.log('diff', diff)
  if (!diff.every(val => val === diff[0])) {
    return nums[0] - findNextDiff(diff)
  }
  return nums[0] - diff[0]
}

const readHistory = () => {
  let lines = readInput();
  let history = new Map<number, number[]>()

  lines.forEach((line: string, i: number) => {
    history.set((i), parseNumbers(line))
  })

  let sum = 0
  history.forEach(h => {
    let newNum = findNextDiff(h)
    sum += newNum
  })
  console.log('sum', sum)
}

readHistory();