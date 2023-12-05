const {readFileSync} = require('fs');

export const inputLinesArray = (filePath: string) => {
  const lines = readFileSync(filePath).toString().split("\n").filter(n => n);
  return lines
}