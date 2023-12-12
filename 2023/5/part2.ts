import { inputLinesArray } from "../utils/utils";
const util = require('util')

type Range = {
  sourceRange: SeedRange;
  destRange: SeedRange;
};

type FullMap = Range[];

type SeedLocation = {
  seed: number;
  location: number;
};

type SeedRange = {
  start: number;
  end: number;
  numValues: number;
};

type compareResult = (-1 | 0 | 1);

const maps = [
  "seed-to-soil map:",
  "soil-to-fertilizer map:",
  "fertilizer-to-water map:",
  "water-to-light map:",
  "light-to-temperature map:",
  "temperature-to-humidity map:",
  "humidity-to-location map:",
];

const rangeEntry = (numbers: number[]) => {
  return {
    sourceRange: {
      start: numbers[1],
      end: numbers[1] + numbers[2] - 1,
      numValues: numbers[2]
    },
    destRange: {
      start: numbers[0],
      end: numbers[0] + numbers[2] - 1,
      numValues: numbers[2]
    }
  };
};

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const parseSeeds = (lines: Array<string>) => {
  const seedsRegex = /^seeds: ([\d ]*)$/;
  let seedMatch = lines[0].match(seedsRegex);
  const seeds = seedMatch?.[1].split(" ");
  return seeds;
};

const seedRanges = (seeds: number[]) => {
  const seedRanges: SeedRange[] = [];
  seeds.forEach((seed, index) => {
    if (index > 0 && index % 2) {
      seedRanges.push({
        start: seeds[index - 1],
        end: seeds[index - 1] + seeds[index] - 1,
        numValues: seeds[index]
      });
    }
  });
  return seedRanges;
};

const parseMap = (lines: Array<string>, mapTitle: string) => {
  let i = 0;
  let found = false;

  while (i < lines.length && !found) {
    if (lines[i] === mapTitle) {
      found = true;
    }
    i++;
  }

  const fullMap: FullMap = [];

  let finish = false;
  while (i < lines.length && !finish) {
    const numbers = lines[i].split(" ").map((i: string) => parseInt(i));
    if (lines[i].split(" ").length != 3) {
      finish = true;
    } else {
      const range = rangeEntry(numbers);

      fullMap.push(range);
      i++;
    }
  }

  // console.log(
  //   `${mapTitle}: `,
  //   fullMap.sort((a, b) => a.sourceRange.start - b.sourceRange.start)
  // );
  return fullMap.sort((a, b) => a.sourceRange.start - b.sourceRange.start);
};

const parseMaps = (lines: Array<string>) => {
  const fullMaps: FullMap[] = [];
  for (let i = 0; i < maps.length; i++) {
    const map = parseMap(lines, maps[i]);
    fullMaps.push(map);
  }
  return fullMaps;
};

const compareRange = (range: SeedRange, value: number): compareResult => {
  if (value < range.start) {
    return -1
  }
  if (value >= range.start && value <= range.end) {
    return 0
  }
  return 1;
}

const translateRange = (ranges: SeedRange[], map: FullMap ) => {
  // console.log('map', map)
  const newRange: SeedRange[] = []
  // const remainderRanges: SeedRange[] = []

  for(let rindex = 0; rindex < ranges.length; rindex++ ) {
    let r = ranges[rindex]
    // console.log('RANGES', ranges)
    // console.log('CHECKING RANGE: ', r)
    let finished = false;
    map.forEach(m => {
      if (finished) {
        return
      }
      let startResult = compareRange(m.sourceRange, r.start)
      let endResult = compareRange(m.sourceRange, r.end)
      // console.log('Current m:', m)
      // console.log('r.start', r.start)
      // console.log('r.end', r.end)
      // console.log('startResult', startResult)
      // console.log('endResult', endResult, '\n')

      if(startResult < 0) {
        if (endResult < 0) {
          newRange.push({start: r.start, end: r.end, numValues: r.numValues})
        } if (endResult == 0) {
          newRange.push({start: r.start, end: m.sourceRange.start - 1, numValues: m.sourceRange.start - r.start})
          newRange.push({start: m.destRange.start, end: m.destRange.start + r.end - m.sourceRange.start , numValues: r.end - m.sourceRange.start + 1})
        } else {
          newRange.push({start: r.start, end: m.sourceRange.start - 1, numValues: m.sourceRange.start - r.start})
          newRange.push({start: m.destRange.start, end: m.destRange.end, numValues: m.destRange.numValues})
          ranges.push({start: m.sourceRange.end + 1, end: r.end , numValues: r.end - m.sourceRange.end})
        }
        finished = true
      } else if (startResult === 0) {
        if (endResult == 0) {
          newRange.push({start: r.start - m.sourceRange.start + m.destRange.start, end: r.end - m.sourceRange.start + m.destRange.start, numValues: r.numValues})
        } else {
          newRange.push({start: r.start - m.sourceRange.start + m.destRange.start, end: m.destRange.end, numValues: m.destRange.end - (r.start - m.sourceRange.start + m.destRange.start) + 1})
          ranges.push({start: m.sourceRange.end + 1, end: r.end, numValues: r.end - m.sourceRange.end})
        }
        finished = true
      }
      // console.log('current newRange', newRange)
    })

    if (!finished) {
      newRange.push({start: r.start, end: r.end, numValues: r.numValues})
      // console.log('current newRange', newRange)
    }
    finished = false
  }

  return newRange
}


const processInput = () => {
  const lines = readInput();
  const seeds = parseSeeds(lines)?.map((i) => parseInt(i));
  // console.log("seeds: ", seeds);
  const ranges = seedRanges(seeds!).sort((a, b) => a.start - b.start);
  console.log("seed ranges :", ranges);

  const fullMaps = parseMaps(lines);
  // console.log("fullMaps", util.inspect(fullMaps, false, null, true))

  // const firstMap = fullMaps[0]
  // console.log('First Map', firstMap)
  // const newRange = translateRange(ranges, firstMap)
  // console.log('New Range', newRange.sort((a, b) => a.start - b.start))

  let resultRange = ranges
  fullMaps.forEach(m => {
    resultRange = translateRange(resultRange, m).sort((a, b) => a.start - b.start)
    // console.log('New Result Range', resultRange, '\n\n')
  })

  // console.log('resultRange', resultRange)

  let location = resultRange[0].start
  resultRange.forEach(r => {
    if (r.start < location) {
      location = r.start
    }
  })

  console.log('Final lowest location:', location)
};

processInput();
