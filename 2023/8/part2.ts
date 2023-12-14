import { inputLinesArray } from "../utils/utils";

type MapNode = {
  right: string;
  left: string;
};

type GhostResult = {
  startNode: string,
  steps: number,
  endNode: string,
}

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const readSequence = (line: string) => {
  return line.split("");
};

const parseMap = (lines: string[]) => {
  let map = new Map<string, MapNode>();
  const mapRegex = /^([0-9A-Z]{3}) = \(([0-9A-Z]{3}), ([0-9A-Z]{3})\)$/;
  lines.forEach((l) => {
    const m: RegExpMatchArray | null = l.match(mapRegex);
    if (m) {
      let node: MapNode = { left: m[2], right: m[3] };
      map.set(m[1], node);
    }
  });
  return map;
};

const groupMap = (map: Map<string, MapNode>) => {
  let groupMap = new Map<string, string[]>();
  map.forEach((mapNode, key) => {
    let chars = key.split("");
    if (!groupMap.has(chars[2])) {
      groupMap.set(chars[2], [key]);
    } else {
      let nodes = groupMap.get(chars[2]);
      nodes?.push(key);
      groupMap.set(chars[2], nodes!);
    }
  });

  // console.log("groupMap", groupMap);
  return groupMap;
};

const findStartEndNodes = (
  sequence: string[],
  map: Map<string, MapNode>,
  groupedMap: Map<string, string[]>
) => {
  let startNodes = groupedMap.get("A");
  let endNodes = groupedMap.get("Z");
  return { startNodes, endNodes };
};

const bruteForceWalk = (startNode: string, sequence: string[], map: Map<string, MapNode>): GhostResult => {
  let numSteps = 0
  let currentNode: string = startNode
  let sequenceIndex = 0
  let lastCharacter = 'A'
  while (lastCharacter !== 'Z') {
    // console.log('lastCharacter', lastCharacter)
    let nextNodes = map.get(currentNode!)
    let direction = sequence[sequenceIndex]

    // console.log('nextNodes', nextNodes)
    // console.log('direction', direction)
    switch(direction) {
      case 'L':
        currentNode = nextNodes!.left
        break;
      case 'R':
        currentNode = nextNodes!.right
        break;
    }
    sequenceIndex = (++sequenceIndex)%sequence.length
    lastCharacter = currentNode.split('')[2]
    // console.log('sequenceIndex', sequenceIndex)
    numSteps++
  }

  // console.log('numSteps', numSteps)
  return { startNode, steps: numSteps, endNode: currentNode!}
}


// Least common multiplier (lcm)
// Greatest common denominator (gcd)
// lcm(a, b) = a * b / gcd(a, b)

const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a
  }
  return gcd(b, a % b)
}

const lcm = (a: number, b: number): number => {
  return a * b / gcd(a, b)
}



const readMap = () => {
  let lines = readInput();
  let sequence = readSequence(lines[0]);
  console.log("Sequence", sequence);
  let map = parseMap(lines);
  console.log("map", map);

  let groupedMap = groupMap(map);

  let { startNodes, endNodes } = findStartEndNodes(sequence, map, groupedMap);

  let results: GhostResult[] = []
  startNodes?.forEach((node: string) => {
    results.push(bruteForceWalk(node, sequence, map))
  })

  console.log('results', results)
  console.log("startNodes", startNodes);
  console.log("endNodes", endNodes);

  let multiplier = results.reduce((sum, result) => lcm(sum, result.steps), 1)
  console.log('common multiplier', multiplier)
};

readMap();
