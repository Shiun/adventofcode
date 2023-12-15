import { inputLinesArray } from "../utils/utils";
type Marking = "#" | ".";

type Coordinate = {
  row: number;
  col: number;
};

type Galaxy = {
  coord: Coordinate;
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

const calculateExpansion = (map: Array<Array<string>>) => {
  // Calculate row expansion
  let rowExpansionMap: Array<Array<string>> = [];
  map.map((row, i) => {
    if (!row.includes("#")) {
      rowExpansionMap.push([...row]);
    }
    rowExpansionMap.push(row);
  });

  let colExpansionMap: Array<Array<string>> = [];
  // Calculate col expansion
  for (let col = 0; col < rowExpansionMap[0].length; col++) {
    let hasGalaxy = false;
    for (let row = 0; row < rowExpansionMap.length; row++) {
      if (rowExpansionMap[row][col] === "#") {
        hasGalaxy = true;
      }
    }

    if (!hasGalaxy) {
      for (let row = 0; row < rowExpansionMap.length; row++) {
        if (colExpansionMap[row] === undefined) colExpansionMap[row] = [];
        // console.log('No galaxy for:', row, col)
        colExpansionMap[row].push(".", ".");
      }
      hasGalaxy = false;
    } else {
      for (let row = 0; row < rowExpansionMap.length; row++) {
        if (colExpansionMap[row] === undefined) colExpansionMap[row] = [];
        colExpansionMap[row].push(rowExpansionMap[row][col]);
      }
    }
  }
  return colExpansionMap;
};

const locateGalaxies = (map: Array<Array<string>>) => {
  let galaxies: Galaxy[] = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === "#") {
        galaxies.push({ coord: { row, col } });
      }
    }
  }
  return galaxies;
};

// const locateNearestNeighbor = (galaxy: Galaxy, galaxies: Galaxy[]) => {
//   let distance = 0;
//   let nearestNeighbor = undefined;
//   galaxies.forEach((n) => {
//     let nDistance =
//       Math.abs(galaxy.coord.row - n.coord.row) +
//       Math.abs(galaxy.coord.col - n.coord.col);
//     if (distance === 0 || nDistance < distance) {
//       distance = nDistance;
//       nearestNeighbor = n;
//     }
//   });
//   galaxy.nearestNeighbor = nearestNeighbor;
//   return { distance, nearestNeighbor };
// };

const locateDistanceToNeighbors = (galaxy: Galaxy, galaxies: Galaxy[]) => {
  let sum = 0;
  galaxies.forEach((n) => {
    sum +=
      Math.abs(galaxy.coord.row - n.coord.row) +
      Math.abs(galaxy.coord.col - n.coord.col);
  });
  return { galaxy, sum }
};

const readStarMap = () => {
  let lines = readInput();
  let map: Array<Array<string>> = [];
  lines.map((l: string) => {
    map.push(parseLine(l));
  });
  // drawMap("original map", map);
  // console.log("map.length", map.length);
  // console.log("map[0].length", map[0].length);
  map = calculateExpansion(map);

  // drawMap("drawnMap", map);
  // console.log("map.length", map.length);
  // console.log("map[0].length", map[0].length);

  let galaxies = locateGalaxies(map);
  console.log("galaxies", galaxies);

  let reducedGalaxies = Array.from(galaxies, x => x)
  let results = galaxies.map((g: Galaxy) => {
    reducedGalaxies.splice(reducedGalaxies.indexOf(g), 1)
    return locateDistanceToNeighbors(g, reducedGalaxies)
  });
  console.log("results", results);
  let sum = results.reduce((a, b) => a + b.sum, 0);
  console.log("sum", sum);
};

readStarMap();
