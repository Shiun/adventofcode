import { inputLinesArray } from "../utils/utils";
type Marking = "#" | "." | "S";

type Coordinate = {
  row: number;
  col: number;
  symbol: Marking;
};

const directions = [
  [0, -1], // North
  [0, 1], // South
  [1, 0], // East
  [-1, 0], // West
];


const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const parseLine = (line: string, row: number): Coordinate[] => {
  let char = line.split("") as Marking[];

  let plots = char.map((symbol: Marking, col) => ({
    row,
    col,
    symbol,
  }));

  return plots;
};

const calculatePlots = (start: Coordinate, map: Array<Array<Coordinate>>, steps: number) => {
  let height = map.length
  let width = map[0].length

  let positions = [start]
  let newPositions: Coordinate[] = []
  for(let i = 0; i < steps; i++) {
    //Walk steps
    while(positions.length !== 0) {
      let p = positions.pop()!
      directions.forEach(d => {
        let [dr, dc] = d;
        let newRow = p.row + dr;
        let newCol = p.col + dc;

        // boundary check
        if (0 <= newRow && newRow < width && 0 <= newCol && newCol < height) {
          if (map[newRow][newCol].symbol !== '#') {
            newPositions.push(map[newRow][newCol])
          }
        }
      })  
    }
    positions = newPositions.filter((pos, index) => newPositions.indexOf(pos) === index)
    newPositions = []
  }


  return positions
}

const readMap = () => {
  let lines = readInput();
  let map = lines.map((l: string, row: number) => parseLine(l, row));

  console.log("map", map);

  let start
  for(let row = 0; row < map.length; row++) {
    for(let col = 0; col < map[0].length; col++) {
      if (map[row][col].symbol === 'S') {
        start = map[row][col]
      }
    }
  }

  console.log('start', start)

  let positions = calculatePlots(start, map, 64)
  console.log('positions', positions)
  console.log('positions.length', positions.length)
};

readMap();
