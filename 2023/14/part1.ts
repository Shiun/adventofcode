import { inputLinesArray } from "../utils/utils";

const readInput = () => {
  const lines = inputLinesArray("input.txt", false);
  return lines;
};

const transposePlatform = (lines: string[]) => {
  const rows = lines.length, cols = lines[0].length;
  let tPlatform: string[] = [];
  for (let j = 0; j < cols; j++) {
    tPlatform[j] = "";
  }  

  for (let j = 0; j < cols; j++) {
    for (let i = rows - 1; i >= 0; i--) {
      // console.log('tPlatform[j][i]', tPlatform[j][i])
      // console.log('lines[i][j]', lines[i][j])
      tPlatform[j] = tPlatform[j] + lines[i][j]
    }
  }
  return tPlatform;
}

const calculateLoadForLine = (line: string) => {
  let hashIndexes: number[] = []
  let rockIndexes: number[] = []
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '#') {
      hashIndexes.push(i + 1)
    }
    if (line[i] === 'O') {
      rockIndexes.push(i + 1)
    }
  }
  // console.log('hashIndexes', hashIndexes)
  // console.log('rockIndexes', rockIndexes)
  let sum = 0
  let highestHash = 0
  let rocksToCheck = [...rockIndexes]
  hashIndexes.forEach((h) => {
    const blockedRocks = rocksToCheck.filter(r => r < h)
    blockedRocks.forEach((b, i) => {
      sum += h - (i + 1)
    })
    rocksToCheck = rocksToCheck.filter(r => !blockedRocks.includes(r))

    if (h > highestHash) {
      highestHash = h
    }
  })

  const nonBlockedRocks = rockIndexes.filter(r => r > highestHash)
  // console.log('nonBlockedRocks', nonBlockedRocks)
  nonBlockedRocks.forEach((r, i) => {
    sum += line.length - i
  })

  // console.log('Sum', sum)
  return sum
}

const calculateLoads = (platform: string[]) => {
  let sum = 0
  platform.forEach((l: string) => {
    sum += calculateLoadForLine(l)
  })

  console.log('Total Load', sum)
  return 0
}

const readPlatform = () => {
  const lines = readInput()
  const tPlatform = transposePlatform(lines)
  // console.log(tPlatform)

  calculateLoads(tPlatform)
}

readPlatform()