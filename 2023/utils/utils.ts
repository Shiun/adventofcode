const {readFileSync} = require('fs');

export const inputLinesArray = (filePath: string, filterEmpty: boolean = true) => {
  let lines = readFileSync(filePath).toString().split("\n")

  if (filterEmpty) {
    lines = lines.filter((n: string) => n);
  }
  return lines
}