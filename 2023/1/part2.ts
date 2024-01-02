const { readFileSync } = require("fs");

const numberString = (string: string) => {
  const reverse = string.split("").reverse().join("");
  const firstNumRegex =
    /[^\d|^(one|two|three|four|five|six|seven|eight|nine)]*(\d|one|two|three|four|five|six|seven|eight|nine)/;
  const lastNumRegex =
    /[^\d|^(eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)]*(\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)/;

  const firstNumber: RegExpMatchArray | null = string.match(firstNumRegex);
  const lastNumber: RegExpMatchArray | null = reverse.match(lastNumRegex);

  let firstInt: number | undefined = parseInt(firstNumber?.[1]!);
  firstInt = isNaN(firstInt)? convertToNumber(firstNumber?.[1]!) : firstInt;
  let lastInt: number | undefined = parseInt(lastNumber?.[1]!);
  lastInt = isNaN(lastInt)? convertToNumber(lastNumber?.[1]!) : lastInt
  console.log(`firstNumber: ${firstInt}`);
  console.log(`lastNumber: ${lastInt}`);
  console.log(`Number: ${firstInt}${lastInt}`);
  return parseInt(`${firstInt}${lastInt}`);
};

const convertToNumber = (string: string) => {
  switch (string) {
    case "one":
    case "eno":
      return 1;
    case "two":
    case "owt":
      return 2;
    case "three":
    case "eerht":
      return 3;
    case "four":
    case "ruof":
      return 4;
    case "five":
    case "evif":
      return 5;
    case "six":
    case "xis":
      return 6;
    case "seven":
    case "neves":
      return 7;
    case "eight":
    case "thgie":
      return 8;
    case "nine":
    case "enin":
      return 9;
    default:
  }
};

const generatePart2Result = () => {
  const lines = readFileSync("input.txt").toString().split("\n");

  let sum = 0;
  lines
    .filter((n: string) => n)
    .forEach((i: string) => {
      console.log(`String: ${i}`);
      sum += numberString(i);
      console.log("\n");
    });
  console.log(`Sum: ${sum}`);
};
generatePart2Result();
