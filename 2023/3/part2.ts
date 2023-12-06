import { inputLinesArray } from "../utils/utils";

type Location = {
  row: number;
  col: number;
  numbers: NumObject[];
};

type NumObject = {
  num: number;
  row: number;
  start: number;
  end: number;
};

const twoDimensionalCharacterMap = (lines: string[]) => {
  const Map: Array<Array<string>> = [];
  lines.forEach((line: string, i: number) => {
    const characters = line.split("");
    Map.push(characters);
  });

  return Map;
};

const getInputMap = () => {
  const lines = inputLinesArray("input.txt");
  const twoDMap = twoDimensionalCharacterMap(lines);

  return twoDMap;
};

const isAstrix = (test: string) => {
  const symbolRegex = /[\*]/;
  const result: RegExpMatchArray | null = test.match(symbolRegex);
  return !(result === null);
};

const gearLocations = (map: Array<Array<string>>) => {
  let foundGears: Location[] = [];
  map.forEach((line, lineIndex) => {
    console.log(`${line}`);
    console.log(`Current lineIndex: ${lineIndex}`);
    let foundIndex = 0;
    while (foundIndex > -1 && foundIndex < line.length) {
      let found = isAstrix(line[foundIndex]);
      if (found) {
        foundGears.push({ row: lineIndex, col: foundIndex, numbers: [] });
      }
      foundIndex++;
    }
  });

  return foundGears;
};

const joinStrings = (line: Array<string>, start: number, end: number) => {
  let result = [];
  for (let i = start; i <= end; i++) {
    result.push(line[i]);
  }
  const numString = result.join("");
  console.log(`numString: ${numString}`);
  return parseInt(numString);
};

const findNumber = (
  line: Array<string>,
  row: number,
  col: number
): { start: number; end: number } => {
  let start = -1;
  let end = -1;
  console.log("row = ", row);
  let stop = false;
  for (let i = row; i < line.length && !stop; i++) {
    let num = parseInt(line[i]);
    if (!isNaN(num)) {
      if (start === -1) {
        start = i;
        end = i;
      } else {
        end = i;
      }
    } else if (start != -1 && end != -1) {
      stop = true;
    }
  }
  const result = { start, end };
  return result;
};

const numberLocations = (map: Array<Array<string>>) => {
  let numberMap: NumObject[][] = Array(map.length);
  console.log("numberMap", numberMap);
  map.forEach((line, lineIndex) => {
    console.log(`${line}`);
    console.log(`Current lineIndex: ${lineIndex}`);
    let start = 0;
    let end = 0;
    while (
      (start > -1 && start < line.length) ||
      (end > -1 && end < line.length)
    ) {
      const indexes = findNumber(line, start, end);
      start = indexes.end + 1 == 0 ? -1 : indexes.end + 1;
      end = indexes.end + 1 == 0 ? -1 : indexes.end + 1;

      if (start === -1 && end === -1) {
        return;
      }

      const result = joinStrings(line, indexes.start, indexes.end);
      console.log("Parsed number:", result, "\n");
      const numObject = {
        num: result,
        row: lineIndex,
        start: indexes.start,
        end: indexes.end,
      };

      if (numberMap[lineIndex] === undefined) {
        numberMap[lineIndex] = Array(map.length);
      }

      for (let i = numObject.start; i <= numObject.end; i++) {
        numberMap[lineIndex][i] = numObject;
      }
    }
  });
  return numberMap;
};

const findGears = (map: Array<Array<string>>) => {
  const gears = gearLocations(map);
  return gears;
};

const findNumbers = (map: Array<Array<string>>) => {
  const numbers = numberLocations(map);
  return numbers;
};

const limitIndex = (max: number, min: number, index: number) => {
  if (index < min) {
    return min;
  }
  if (index > max) {
    return max;
  }
  return index;
};

const gearParimeter = (max: number, min: number, gear: Location) => {
  let startRow = gear.row - 1;
  let endRow = gear.row + 1;
  let startCol = gear.col - 1;
  let endCol = gear.col + 1;
  startRow = limitIndex(max, min, startRow);
  endRow = limitIndex(max, min, endRow);
  startCol = limitIndex(max, min, startCol);
  endCol = limitIndex(max, min, endCol);

  return {
    startRow,
    endRow,
    startCol,
    endCol,
  };
};

const sumOfGearPower = () => {
  const twoDMap = getInputMap();
  const numbersMap = findNumbers(twoDMap);
  const gears = findGears(twoDMap);

  let gearPowerSum = 0;
  gears.forEach((gear, index) => {

    console.log('gears', gears.slice(0, 5))
    const parimeter = gearParimeter(twoDMap[0].length - 1, 0, gear);
    let numbers = [];
    console.log('parimeter', parimeter)
    for (let row = parimeter.startRow; row <= parimeter.endRow; row++) {
      for (let col = parimeter.startCol; col <= parimeter.endCol; col++) {
        if (numbersMap[row][col] !== undefined) {
          numbers.push(numbersMap[row][col]);
        }
      }
    }

    console.log("numbers array", numbers);
    const removedDuplicates = [...new Set(numbers)];
    console.log("removed duplicates", removedDuplicates);
    if (removedDuplicates.length === 2) {
      gearPowerSum += removedDuplicates[0].num * removedDuplicates[1].num;
      console.log('\nCURRENT gearPowerSum:', gearPowerSum, "\n")
    }
    numbers = [];
  });

  console.log('\nFINAL gearPowerSum', gearPowerSum, "\n")
};

sumOfGearPower();
