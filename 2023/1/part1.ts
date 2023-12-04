const {readFileSync} = require('fs');

const number = (string: string) => {

  const reverse = string.split("").reverse().join("");
  const firstNumRegex = /[^\d]*(\d)/;

  const firstNumber: RegExpMatchArray | null = string.match(firstNumRegex);
  const lastNumber: RegExpMatchArray | null = reverse.match(firstNumRegex);

  console.log(`firstNumber: ${firstNumber?.[1]}`)
  console.log(`lastNumber: ${lastNumber?.[1]}`)
  console.log(`Number: ${firstNumber?.[1]}${lastNumber?.[1]}`)
  return parseInt(`${firstNumber?.[1]}${lastNumber?.[1]}`);
}

const generateResult = () => {
  const lines = readFileSync('input.txt').toString().split("\n");

  let sum = 0;
  lines.filter(n => n).forEach((i: string) => {
    console.log(`String: ${i}`)
    sum += number(i);
    console.log("\n");
  })
  console.log(`Sum: ${sum}`);
}
generateResult();