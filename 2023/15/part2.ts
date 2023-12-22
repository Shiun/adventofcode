import { inputLinesArray } from "../utils/utils";

type Sequence = {
  hash?: string,
  hashValue?: number,
  operation?: string,
  lensValue?: number,
}

const readInput = () => {
  const lines = inputLinesArray("input.txt", false);
  return lines;
};

const parseLine = (line: string) => {
  return line.split(",");
};

const parseSequence = (line: string): Sequence => {
  let seqRegEx = /^([a-z]+)([-=])([1-9]*)$/
  let match = line.match(seqRegEx)
  let sequence: Sequence = {};
  sequence.hash = match![1]
  sequence.hashValue = formulateValue(match![1])
  sequence.operation = match![2]
  if (sequence.operation === '=') {
    sequence.lensValue = parseInt(match![3])
  }

  // console.log('sequence', sequence)
  return sequence
}

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

const equalOperation = (boxes: Array<Array<Sequence>>, sequence: Sequence) => {
  if (!boxes[sequence.hashValue!]) {
    boxes[sequence.hashValue!] = []
  }

  let sIndex = boxes[sequence.hashValue!].findIndex(s => s.hash == sequence.hash!)
  if (sIndex !== -1) {
    boxes[sequence.hashValue!].splice(sIndex, 1, sequence)
  } else {
    boxes[sequence.hashValue!].push(sequence)
  }
}

const dashOperation = (boxes: Array<Array<Sequence>>, sequence: Sequence) => {
  if (!boxes[sequence.hashValue!]) {
    boxes[sequence.hashValue!] = []
  }

  boxes[sequence.hashValue!] = boxes[sequence.hashValue!].filter(s => s.hash != sequence.hash!)
}


const fileBoxes = (boxes: Array<Array<Sequence>>, sequences: Sequence[]) => {
  sequences.forEach(s => {
    switch(s.operation!) {
      case '=':
        equalOperation(boxes, s)
        break
      case '-':
        dashOperation(boxes, s)
        break
    }
  })
}

const calculateBoxPower = (box: Array<Sequence>) => {
  return box.reduce((a: number, s: Sequence, i: number) => a += (i + 1)*s.lensValue!, 0)
}

const calculateFocusPower = (boxes: Array<Array<Sequence>>) => {
  return boxes.reduce((a: number, b: Array<Sequence>, i: number) => a += (i + 1)*calculateBoxPower(b), 0)
}

const readSequence = () => {
  const input = readInput()
  // console.log('input', input)
  let seqStrings = parseLine(input[0])
  // console.log('seqStrings', seqStrings)
  let sequences = seqStrings.map((s: string) => parseSequence(s))

  let boxes: Array<Array<Sequence>> = new Array(256)
  boxes.forEach(b => b = [])

  fileBoxes(boxes, sequences)

  let sum = calculateFocusPower(boxes)
  console.log('Focus power', sum)
  // console.log('boxes', boxes)

  // let values = sequence.map(s => formulateValue(s))
  // console.log('values', values)
  // let sum = values.reduce((a, v) => a + v, 0)
  // console.log('sum', sum)
}

readSequence()