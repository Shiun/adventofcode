import { inputLinesArray } from "../utils/utils";

type Direction = "N" | "S" | "E" | "W" | undefined;

type Tile = {
  dir: Direction[];
  start: boolean;
  ground: boolean;
  row: number;
  col: number;
  isPath: boolean;
};

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const parseLine = (line: string) => {
  return line.split("");
};

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

const parseMapValue = (value: string, row: number, col: number) => {
  let t: Tile | undefined = undefined;
  switch (value) {
    case "|":
      t = { dir: ["N", "S"], start: false, ground: false, row, col, isPath: false };
      break;
    case "-":
      t = { dir: ["E", "W"], start: false, ground: false, row, col, isPath: false };
      break;
    case "L":
      t = { dir: ["N", "E"], start: false, ground: false, row, col, isPath: false };
      break;
    case "J":
      t = { dir: ["N", "W"], start: false, ground: false, row, col, isPath: false };
      break;
    case "7":
      t = { dir: ["W", "S"], start: false, ground: false, row, col, isPath: false };
      break;
    case "F":
      t = { dir: ["E", "S"], start: false, ground: false, row, col, isPath: false };
      break;
    case ".":
      t = {
        dir: [],
        start: false,
        ground: true,
        row,
        col,
        isPath: false
      };
      break;
    case "S":
      t = {
        dir: [],
        start: true,
        ground: false,
        row,
        col,
        isPath: true
      };
      break;
  }
  return t;
};

const tileMap = (maze: Array<Array<string>>) => {
  let map: Array<Array<Tile>> = [];
  let start: Tile | undefined;
  maze.forEach((row, i) => {
    !map[i] ? map.push([]) : undefined;
    row.forEach((col, j) => {
      let tile = parseMapValue(maze[i][j], i, j);
      if (tile?.start) start = tile;
      map[i].push(tile!);
    });
  });

  return { map, start };
};

const findConnectedDirection = (
  tile: Tile,
  map: Array<Array<Tile>>
): Array<Direction> => {
  let directions: Array<Direction> = [];

  // Check North
  if (
    tile.row >= 1 &&
    tile.row < map.length &&
    tile.col >= 0 &&
    tile.col < map[0].length
  ) {
    let northTile = map[tile.row - 1][tile.col];
    if (northTile.dir.includes("S")) directions.push("N");
  }

  // Check South
  if (
    tile.row >= 0 &&
    tile.row < map.length - 1 &&
    tile.col >= 0 &&
    tile.col < map[0].length
  ) {
    let northTile = map[tile.row + 1][tile.col];
    if (northTile.dir.includes("N")) directions.push("S");
  }

  // Check West
  if (
    tile.row >= 0 &&
    tile.row < map.length &&
    tile.col >= 1 &&
    tile.col < map[0].length
  ) {
    let northTile = map[tile.row][tile.col - 1];
    if (northTile.dir.includes("E")) directions.push("W");
  }

  // Check East
  if (
    tile.row >= 0 &&
    tile.row < map.length &&
    tile.col >= 0 &&
    tile.col < map[0].length - 1
  ) {
    let northTile = map[tile.row][tile.col + 1];
    if (northTile.dir.includes("W")) directions.push("E");
  }

  return directions;
};

const getConnectedTile = (
  tile: Tile,
  dir: Direction,
  map: Array<Array<Tile>>
) => {
  let t: Tile | undefined = undefined;
  switch (dir) {
    case "N":
      t = map[tile.row - 1][tile.col];
      break;
    case "S":
      t = map[tile.row + 1][tile.col];
      break;
    case "W":
      t = map[tile.row][tile.col - 1];
      break;
    case "E":
      t = map[tile.row][tile.col + 1];
      break;
    default:
      console.log("Error (entering nonconnected title): ", tile, dir);
  }
  return t;
};

const walkMaze = (start: Tile, map: Array<Array<Tile>>) => {
  let currTile = undefined;
  let dir = start.dir[0];
  let steps = 0
  while (currTile != start) {
    steps++
    currTile = getConnectedTile(currTile ? currTile : start, dir, map);
    currTile!.isPath = true
    // console.log('From dir', dir)
    // console.log("currTile", currTile);
    switch (dir) {
      case "N":
        dir = currTile!.dir.filter((d) => d != "S")[0];
        break;
      case "S":
        dir = currTile!.dir.filter((d) => d != "N")[0];
        break;
      case "W":
        dir = currTile!.dir.filter((d) => d != "E")[0];
        break;
      case "E":
        dir = currTile!.dir.filter((d) => d != "W")[0];
        break;
    }
    // console.log('Next dir', dir)
  }

  return steps
};

const readMaze = () => {
  let lines = readInput();
  let maze: Array<Array<string>> = [];
  lines.map((l: string) => {
    maze.push(parseLine(l));
  });

  // console.log("maze", maze);

  let { map, start } = tileMap(maze);
  // console.log("map", map);

  let dir = findConnectedDirection(start!, map);
  // console.log("start dir", dir);
  start!.dir = dir

  console.log("start", start);

  let steps = walkMaze(start!, map)

  console.log('steps', steps)
  console.log('furtherest point', steps/2)

  // let final = map.map(r => {
  //   return r.map(c => c.isPath ? '*' : '.')
  // })

  // console.log('final', final)
};

readMaze();
