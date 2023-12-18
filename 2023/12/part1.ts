import { match } from "assert";
import { inputLinesArray } from "../utils/utils";

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

type Row = {
  positions: string[];
  groups: number[];
};

const parseLine = (line: string) => {
  let recordRegex = /^([\.?#]+) ([\d,]*)$/;
  let match = line.match(recordRegex);
  let positions = match![1].split("");
  let groups = match![2].split(",").map((i) => parseInt(i));
  // console.log(match, positions, groups);
  return { positions, groups };
};


// genrate strings from positions array
const generateStrings = (positions: string[]): string[] => {
  let results: string[] = []
  positions.forEach(char => {
    if (char === '.' || char === '#') {
      if (results.length === 0) {
        results.push(char)
      } else {
        for(let i = 0; i < results.length; i++) {
          results[i] = results[i] + char
        }  
      }
    } else {
      if (results.length === 0) {
        results.push('#')
        results.push('.')
      } else {
        let newStrings = []
        for(let i = 0; i < results.length; i++) {
          let newString = results[i] + '#'
          results[i] = results[i] + '.'
          newStrings.push(newString)
        }
        for (let j = 0; j < newStrings.length; j++) {
          results.push(newStrings[j])
        }
      }
    }
  })
  return results
};

const numMatches = (strings: string[], groups: number[]) => {
  let g = groups.map(g => {
    return `#{${g}}`
  })
  let matchString = g.join('\\.+')
  // console.log('g ', g)
  matchString = '^\\.*' + matchString + '\\.*$'
  // console.log('matchString', matchString)

  let matchRegEx = new RegExp(matchString)

  let numMatches = 0
  strings.forEach(s => {
    // console.log(s)
    s.match(matchRegEx) ? numMatches++ : undefined
  })

  // console.log('numMatches', numMatches)
  return numMatches
}

const readGame = () => {
  let lines = readInput();
  let rows = lines.map((l: string) => parseLine(l));
  // console.log("rows", rows);

  // console.log('rows[0]', rows[0].positions.join(''), rows[0].groups)

  let total = 0
  rows.forEach((r: Row, index: number)  => {
    // console.log(`row #${index + 1}`, r.positions.join(''), r.groups)
    let strings = generateStrings(r.positions)
    total += numMatches(strings, r.groups)
  })

  console.log("total:", total)
};

readGame();
