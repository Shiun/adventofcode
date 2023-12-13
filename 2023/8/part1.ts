import { inputLinesArray } from "../utils/utils";

type MapNode = {
  right: string;
  left: string;
};

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const readSequence = (line: string) => {
  return line.split("");
};

const parseMap = (lines: string[]) => {
  let map = new Map<string, MapNode>();
  const mapRegex = /^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)$/
  lines.forEach((l) => {
    const m: RegExpMatchArray | null = l.match(mapRegex)
    if (m) {
      let node: MapNode = { left: m[2], right: m[3]}
      map.set(m[1], node)
    }
  });
  return map
};

const bruteForceWalk = (sequence: string[], map: Map<string, MapNode>) => {
  let numSteps = 0
  let currentNode: string | undefined = 'AAA'
  let sequenceIndex = 0
  while (currentNode !== 'ZZZ') {
    let nextNodes = map.get(currentNode!)
    let direction = sequence[sequenceIndex]

    // console.log('nextNodes', nextNodes)
    // console.log('direction', direction)
    switch(direction) {
      case 'L':
        currentNode = nextNodes?.left
        break;
      case 'R':
        currentNode = nextNodes?.right
        break;
    }
    sequenceIndex = (++sequenceIndex)%sequence.length
    // console.log('sequenceIndex', sequenceIndex)
    numSteps++
  }

  console.log('numSteps', numSteps)
}

const readMap = () => {
  let lines = readInput();

  let sequence = readSequence(lines[0]);
  console.log("Sequence", sequence);
  let map = parseMap(lines);

  console.log('map', map)

  bruteForceWalk(sequence, map)
};

readMap();
