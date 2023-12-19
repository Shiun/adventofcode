import { inputLinesArray } from "../utils/utils";

const readInput = () => {
  const lines = inputLinesArray("input.txt", false);
  return lines;
};

const parsePatterns = (lines: string[]) => {
  let patterns: string[][] = [];
  let p: string[] = [];
  lines.forEach((l, index) => {
    if (l) {
      p.push(l);
    }
    if (!l || index === lines.length - 1) {
      patterns.push(p);
      p = new Array();
    }
  });
  return patterns;
};

const checkVerticalReflectionIndex = (pattern: string[], index: number) => {
  // console.log("index", index);

  let isReflection = true;
  let rowLength = pattern[0].length
  for (
    let i = index, j = index + (index - i) + 1;
    i >= 0 && j < rowLength && isReflection;
    i--, j++
  ) {
    let iColumn = pattern.reduce((s, r) => s + r[i], '')
    let jColumn = pattern.reduce((s, r) => s + r[j], '')
    // console.log('i, j', i, j)
    // console.log('iColumn', iColumn)
    // console.log('jColumn', jColumn)
    if (iColumn !== jColumn) {
      isReflection = false;
    }
  }
  return isReflection ? index : -1;
};

const findVerticalReflectionIndex = (pattern: string[]) => {
  // console.log("CHECK pattern", pattern);
  let line = pattern[0];
  let potentials: number[] = [];
  for (let i = 0; i < line.length - 1; i++) {
    if (line[i] === line[i + 1]) {
      potentials.push(i);
    }
  }
  console.log("potential cols", potentials);

  let vIndex = -1;

  potentials.forEach((i) => {
    if (vIndex === -1) vIndex = checkVerticalReflectionIndex(pattern, i);
  });

  return vIndex;
};

const findVerticalReflectionCount = (patterns: string[][]) => {

  let columns: number[] = []
  patterns.forEach(p => {
    columns.push(findVerticalReflectionIndex(p) + 1)
  })

  return columns;
};

const checkHorizontalReflectionIndex = (pattern: string[], index: number) => {
  // console.log('pattern.length', pattern.length)
  let isReflection = true;
    for (
      let i = index, j = index + (index - i) + 1;
      i >= 0 && j < pattern.length && isReflection;
      i--, j++
    ) {
      if (pattern[i] !== pattern[j]) {
        isReflection = false;
      }
    }

  return isReflection ? index : -1;
}

const findHorizontalReflectionIndex = (pattern: string[]) => {
  let potentials: number[] = []
  for(let r = 0; r < pattern.length - 1; r++) {
    if (pattern[r][0] === pattern[r + 1][0]) {
      potentials.push(r)
    }
  }
  console.log("potential rows", potentials)

  let hIndex = -1
  potentials.forEach((i) => {
    if (hIndex === -1) hIndex = checkHorizontalReflectionIndex(pattern, i);
  });

  return hIndex
}

const findHorizontalReflectionCount = (patterns: string[][]) => {
  let rows: number[] = []
  patterns.forEach(p => {
    rows.push(findHorizontalReflectionIndex(p) + 1)
  })
  return rows
}


const readGame = () => {
  let lines = readInput();
  // console.log("lines", lines);
  let patterns = parsePatterns(lines);
  // console.log('patterns', patterns)

  let columns = findVerticalReflectionCount(patterns);
  console.log('columns ', columns)

  let rows = findHorizontalReflectionCount(patterns)
  console.log('rows', rows)

  let sum = columns.reduce((sum, col) => sum + col, 0)
  console.log('sum of col', sum)

  sum = rows.reduce((sum, row) => sum + row * 100, sum)
  console.log('sum of col + 100 * row', sum)
};

readGame();
