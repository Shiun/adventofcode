import { inputLinesArray } from "../utils/utils";
const util = require("util");

type Coordinate = {
  row: number;
  col: number;
};

type Galaxy = {
  imageCoord: Coordinate;
  expandedCoord: Coordinate;
  nearestNeighbor?: Galaxy | undefined;
};

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const parseLine = (line: string) => {
  return line.split("");
};

const drawMap = (label: string, map: Array<Array<string>>) => {
  let drawnMap = map.map((r) => {
    return r.map((c) => c).join("") + "            ";
  });
  console.log(`${label}`, drawnMap);
};

const locateGalaxies = (map: Array<Array<string>>) => {
  let galaxies: Galaxy[] = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === "#") {
        galaxies.push({
          imageCoord: { row, col },
          expandedCoord: { row, col },
        });
      }
    }
  }
  return galaxies;
};

const calculateExpansion = (
  galaxies: Galaxy[],
  map: Array<Array<string>>,
  expansionRate: number
) => {
  // Row Expansion
  for (let r = 0; r < map.length; r++) {
    let row = map[r];
    if (!row.includes("#")) {
      galaxies
        .filter((g) => g.imageCoord.row > r)
        .forEach((g) => (g.expandedCoord.row += expansionRate - 1));
    }
  }

  // Col Expansion
  for (let col = 0; col < map[0].length; col++) {
    let hasGalaxy = false;
    for (let row = 0; row < map.length; row++) {
      if (map[row][col] === "#") {
        hasGalaxy = true;
      }
    }

    if (!hasGalaxy) {
      galaxies
        .filter((g) => g.imageCoord.col > col)
        .forEach((g) => (g.expandedCoord.col += expansionRate - 1));
      hasGalaxy = false;
    }
  }
};

const locateDistanceToNeighbors = (galaxy: Galaxy, galaxies: Galaxy[]) => {
  let sum = 0;
  let all: number[] = []
  galaxies.forEach((n) => {
    let d =
      Math.abs(galaxy.expandedCoord.row - n.expandedCoord.row) +
      Math.abs(galaxy.expandedCoord.col - n.expandedCoord.col);
    sum += d;
    all.push(d)
  });
  return { galaxy, sum, all};
};

const readStarMap = () => {
  let lines = readInput();

  let map: Array<Array<string>> = [];
  lines.map((l: string) => {
    map.push(parseLine(l));
  });

  drawMap("map", map);
  let galaxies = locateGalaxies(map);
  console.log("galaxies", galaxies);

  let expansionRate = 1000000;
  calculateExpansion(galaxies, map, expansionRate);
  console.log("expanded galaxies", galaxies);

  let reducedGalaxies = Array.from(galaxies, (x) => x);
  let results = galaxies.map((g: Galaxy) => {
    reducedGalaxies.splice(reducedGalaxies.indexOf(g), 1);
    return locateDistanceToNeighbors(g, reducedGalaxies);
  });
  console.log("results", util.inspect(results, false, null, true));
  let sum = results.reduce((a, b) => a + b.sum, 0);
  console.log("sum", sum);
};

readStarMap();
