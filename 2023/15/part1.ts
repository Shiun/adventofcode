import { inputLinesArray } from "../utils/utils";

const readInput = () => {
  const lines = inputLinesArray("input.txt", false);
  return lines;
};

const parseLine = (line: string) => {
  return line.split(",");
};

const formulateValue = (line: string) => {
  let value = 0
  for(let i = 0; i < line.length; i++) {
    let char = line[i]
    value += char.charCodeAt(0)
    value *= 17
    value %= 256
  }
  return value
}

const readSequence = () => {
  const input = readInput()
  console.log('input', input)
  let sequence = parseLine(input[0])
  console.log('sequence', sequence)

  let values = sequence.map(s => formulateValue(s))
  console.log('values', values)
  let sum = values.reduce((a, v) => a + v, 0)
  console.log('sum', sum)
}

readSequence()