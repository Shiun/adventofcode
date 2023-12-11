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
    return numberArray(match[1].split(" "));
  }
};

const gameNumbers = (game: string) => {
  const gameRegex = /\|[ ]*([\d* ]*)/;
  const match = game.match(gameRegex);

  if (match) {
    return numberArray(match[1].split(" "));
  }
};

const countCards = (gameWinnings: number[][]) => {
  const cardCount = Array(gameWinnings.length).fill(1);
  console.log("INIT cardCount ", cardCount);

  for (let gameIndex = 0; gameIndex < gameWinnings.length; gameIndex++) {
    let game = gameWinnings[gameIndex];
    console.log("Processing winnings for game:", gameIndex + 1);
    // cardCount[gameIndex] = incrementCount(cardCount[gameIndex]);
    console.log(
      `game ${gameIndex}:`,
      game.map((i) => i + 1)
    );
    game?.forEach((winningCopies, index) => {
      console.log(`num cards for game ${gameIndex + 1} : ${cardCount[gameIndex]}`);
      cardCount[winningCopies] = cardCount[winningCopies] + cardCount[gameIndex];
    });

    console.log("CURRENT cardCount", cardCount, "\n");
  }
  console.log("cardCount data structure", cardCount);
  return cardCount;
};

const readInputLines = () => {
  const lines = inputLinesArray("input.txt");

  let gameWinnings: number[][] = Array(lines.length);
  console.log("initial gameWinnings:", gameWinnings);
  lines.forEach((line: string, lineIndex: number) => {
    // Initialize game winning arrays
    if (gameWinnings[lineIndex] === undefined) {
      gameWinnings[lineIndex] = [];
    }

    console.log("processing game:", lineIndex + 1);

    const winNums = winningNumbers(line);
    const gameNums = gameNumbers(line);

    let intersection = winNums?.filter((x) => gameNums?.includes(x));
    if (intersection && intersection.length > 0) {
      console.log("intersection.length", intersection.length);
      for (
        let i = lineIndex + 1;
        i < lineIndex + intersection.length + 1;
        i++
      ) {
        gameWinnings[lineIndex].push(i);
      }
    }

    console.log("GAME", lineIndex + 1);
    console.log("Scratch Cards", gameWinnings[lineIndex], "\n\n\n");
  });
  console.log(
    "FINAL gameWinnings:",
    gameWinnings.map((i: Array<number>) => i.map((j) => j + 1))
  );

  const cardCount: number[] = countCards(gameWinnings);
  let sum = 0;
  cardCount.forEach((game: number) => {
    if (game) {
      sum += game;
    }
  });

  console.log("sum", sum);
};

readInputLines();
