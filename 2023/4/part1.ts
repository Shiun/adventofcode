import { inputLinesArray } from "../utils/utils";

const numberArray = (numStrings: Array<string>) => {
  const numArray: number[] = [];
  numStrings.forEach((numString) => {
    const int = parseInt(numString);
    !isNaN(int) ? numArray.push(int) : null;
  });
  return numArray;
};

const winningNumbers = (game: string) => {
  const winningRegex = /^Card *\d*: ([\d* ]*) \|/;
  const match = game.match(winningRegex);

  if (match) {
    // console.log(match[1].split(" "));
    return numberArray(match[1].split(" "));
  }
};

const gameNumbers = (game: string) => {
  const gameRegex = /\|[ ]*([\d* ]*)/;
  const match = game.match(gameRegex);

  if (match) {
    // console.log(match[1].split(" "));
    return numberArray(match[1].split(" "));
  }
};

const readInputLines = () => {
  const lines = inputLinesArray("input.txt");
  // console.log('lines', lines)

  let sum = 0
  lines.forEach((line: string, lineIndex: number) => {
    const winNums = winningNumbers(line);
    console.log("winNums", winNums);
    const gameNums = gameNumbers(line);
    console.log("gameNums", gameNums);

    let intersection = winNums?.filter((x) => gameNums?.includes(x));
    console.log("intersection", intersection);
    if (intersection && intersection.length > 0) {
      sum += Math.pow(2, intersection.length - 1)
      console.log('\nCURRENT sum', sum, '\n')
    }
  });

  console.log('FINAL sum:', sum)
};

readInputLines();
