import { inputLinesArray } from "../utils/utils";

type Tile = {
  type: TileType;
  beamCount: number;
  x: number;
  y: number;
  seen: Set<Dir>;
};

type TileType = "." | "/" | "\\" | "-" | "|";

type Dir = "N" | "S" | "E" | "W";

const readInput = () => {
  const lines = inputLinesArray("input.txt", false);
  return lines;
};

const parseTiles = (lines: string[]) => {
  let tiles: Tile[][] = [];
  let t: Tile[] = [];
  lines.forEach((l, y) => {
    t = l
      .split("")
      .map((i, x) => ({
        type: i as TileType,
        beamCount: 0,
        x,
        y,
        seen: new Set(),
      }));
    tiles.push(t);
  });
  return tiles;
};

const withinLayout = (x: number, y: number, width: number, height: number) => {
  return x >= 0 && x < width && y >= 0 && y < height;
};

const processTile = (fromDir: Dir, tile: Tile, tiles: Tile[][]) => {
  if (tile.seen.has(fromDir)) {
    return;
  }
  tile.seen.add(fromDir);

  tile.beamCount++;
  let x1 = tile.x;
  let y1 = tile.y;
  let x2 = tile.x;
  let y2 = tile.y;
  let fromDir1 = fromDir;
  let fromDir2 = fromDir;
  let split = false;

  // console.log('processing tile', tile, fromDir)
  switch (tile.type) {
    case ".":
      switch (fromDir) {
        case "N":
          y1++;
          break;
        case "S":
          y1--;
          break;
        case "E":
          x1--;
          break;
        case "W":
          x1++;
          break;
      }
      if (withinLayout(x1, y1, tiles[0].length, tiles.length)) {
        processTile(fromDir1, tiles[y1][x1], tiles);
      }
      break;
    case "/":
      switch (fromDir) {
        case "N":
          x1--;
          fromDir1 = "E";
          break;
        case "S":
          x1++;
          fromDir1 = "W";
          break;
        case "E":
          y1++;
          fromDir1 = "N";
          break;
        case "W":
          y1--;
          fromDir1 = "S";
          break;
      }
      if (withinLayout(x1, y1, tiles[0].length, tiles.length)) {
        processTile(fromDir1, tiles[y1][x1], tiles);
      }
      break;
    case "\\":
      switch (fromDir) {
        case "N":
          x1++;
          fromDir1 = "W";
          break;
        case "S":
          x1--;
          fromDir1 = "E";
          break;
        case "E":
          y1--;
          fromDir1 = "S";
          break;
        case "W":
          y1++;
          fromDir1 = "N";
          break;
      }
      if (withinLayout(x1, y1, tiles[0].length, tiles.length)) {
        processTile(fromDir1, tiles[y1][x1], tiles);
      }
      break;
    case "-":
      switch (fromDir) {
        case "N":
          x1--;
          x2++;
          fromDir1 = "E";
          fromDir2 = "W";
          split = true;
          break;
        case "S":
          x1--;
          x2++;
          fromDir1 = "E";
          fromDir2 = "W";
          split = true;
          break;
        case "E":
          x1--;
          fromDir1 = "E";
          break;
        case "W":
          x1++;
          fromDir1 = "W";
          break;
      }
      if (withinLayout(x1, y1, tiles[0].length, tiles.length)) {
        processTile(fromDir1, tiles[y1][x1], tiles);
      }
      if (split && withinLayout(x2, y2, tiles[0].length, tiles.length)) {
        processTile(fromDir2, tiles[y2][x2], tiles);
      }
      break;
    case "|":
      switch (fromDir) {
        case "N":
          y1++;
          fromDir1 = "N";
          break;
        case "S":
          y1--;
          fromDir1 = "S";
          break;
        case "E":
          y1++;
          y2--;
          fromDir1 = "N";
          fromDir2 = "S";
          split = true;
          break;
        case "W":
          y1++;
          y2--;
          fromDir1 = "N";
          fromDir2 = "S";
          split = true;
          break;
      }
      if (withinLayout(x1, y1, tiles[0].length, tiles.length)) {
        processTile(fromDir1, tiles[y1][x1], tiles);
      }
      if (split && withinLayout(x2, y2, tiles[0].length, tiles.length)) {
        processTile(fromDir2, tiles[y2][x2], tiles);
      }
      break;
    default:
      break;
  }
};

const readLayout = () => {
  const input = readInput();
  let tiles = parseTiles(input);
  // console.log("tiles", tiles);
  processTile("W", tiles[0][0], tiles);
  // console.log("Tiles", tiles)
  let count = 0;
  tiles.forEach((l) => {
    l.forEach((t) => {
      t.beamCount > 0 ? count++ : undefined;
    });
  });

  console.log("count", count);
};

readLayout();
