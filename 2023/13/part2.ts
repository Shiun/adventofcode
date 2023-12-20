import { inputLinesArray } from "../utils/utils";


type IndexRecord = {
  index: number
  smudgeCount: number
}

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

  let rowLength = pattern[0].length
  let smudgeCount = 0
  for (
    let i = index, j = index + (index - i) + 1;
    i >= 0 && j < rowLength && smudgeCount <= 1;
    i--, j++
  ) {
    let iColumn = pattern.reduce((s, r) => s + r[i], '')
    let jColumn = pattern.reduce((s, r) => s + r[j], '')
    // console.log('i, j', i, j)
    // console.log('iColumn', iColumn)
    // console.log('jColumn', jColumn)
    if (iColumn !== jColumn) {
      for(let i = 0; i < iColumn.length && smudgeCount <= 1; i++) {
        if (iColumn[i] !== jColumn[i]) {
          smudgeCount++
        }
      }
    }
  }
  return {
    index,
    smudgeCount
  }
};

const findVerticalReflectionIndex = (pattern: string[]) => {
  // console.log("CHECK pattern", pattern);
  let line = pattern[0];
  let potentials: number[] = [];
  for (let i = 0; i < line.length - 1; i++) {
    // if (line[i] === line[i + 1]) {
      potentials.push(i);
    // }
  }
  // console.log("potential cols", potentials);

  let records: IndexRecord[] = [];

  potentials.forEach((i) => {
    records.push(checkVerticalReflectionIndex(pattern, i));
  });

  return records;
};

const findVerticalReflectionCount = (patterns: string[][]) => {

  let columns: IndexRecord[] = []
  patterns.forEach(p => {
    columns.push(...findVerticalReflectionIndex(p))
  })

  return columns;
};

const checkHorizontalReflectionIndex = (pattern: string[], index: number) => {
  let smudgeCount = 0
  let isReflection = true;
  for (
    let i = index, j = index + (index - i) + 1;
    i >= 0 && j < pattern.length && isReflection;
    i--, j++
  ) {
    if (pattern[i] !== pattern[j]) {
      for(let x = 0; x < pattern[i].length && smudgeCount <= 1; x++) {
        if (pattern[i][x] !== pattern[j][x]) {
          smudgeCount++
        }
      }
    }
  }

  return {
    index,
    smudgeCount
  }
}

const findHorizontalReflectionIndex = (pattern: string[]) => {
  let potentials: number[] = []
  for(let r = 0; r < pattern.length - 1; r++) {
    // if (pattern[r][0] === pattern[r + 1][0]) {
      potentials.push(r)
    // }
  }
  // console.log("potential rows", potentials)

  let rows: IndexRecord[] = []
  potentials.forEach((i) => {
    rows.push(checkHorizontalReflectionIndex(pattern, i));
  });

  return rows
}

const findHorizontalReflectionCount = (patterns: string[][]) => {
  let rows: IndexRecord[] = []
  patterns.forEach(p => {
    rows.push(...findHorizontalReflectionIndex(p))
  })
  return rows
}


const readGame = () => {
  let lines = readInput();
  // console.log("lines", lines);
  let patterns = parsePatterns(lines);
  // console.log('patterns', patterns)

  // let columns = findVerticalReflectionCount(patterns);
  // console.log('columns ', columns)

  // let rows = findHorizontalReflectionCount(patterns)
  // console.log('rows', rows)

  let sum = 0
  patterns.forEach((p, i) => {
    // console.log('pattern index:', i)
    let columns = findVerticalReflectionCount([p]);
    // console.log('columns ', columns)
    sum = columns.reduce((sum, col) => col.smudgeCount === 1 ? sum + col.index + 1 : sum, sum)
    console.log('sum of col', sum)
    let rows = findHorizontalReflectionCount([p])
    // console.log('rows', rows)
    sum = rows.reduce((sum, row) => row.smudgeCount === 1 ? sum + (row.index + 1) * 100 : sum, sum)
    console.log('sum of col + 100 * row', sum, '\n\n')
  })

  console.log('Final sum', sum)

  // sum = rows.reduce((sum, row) => sum + row * 100, sum)
  // console.log('sum of col + 100 * row', sum)
};

readGame();
