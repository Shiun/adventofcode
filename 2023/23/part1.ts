import { inputLinesArray } from "../utils/utils";
const { inspect } = require("util");
type Slope = "<" | ">" | "^" | "v";

type TileType = "." | "#" | Slope;

type Tile = {
  id: string;
  type: TileType;
  x: number;
  y: number;
  dir: [number, number];
};

type TileState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

type Node = {
  id: string;
  x: number;
  y: number;
  edges: Map<string, Edge>;
};

type Edge = {
  fromNode: string;
  toNode: string;
  length: number;
};

const Directions = [
  [-1, 0], // North
  [1, 0], // South
  [0, 1], // East
  [0, -1], // West
];

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const parseLine = (line: string, row: number): Tile[] => {
  let tiles: Tile[] = line.split("").map((t: string, col: number) => ({
    id: `${row},${col}`,
    type: t as TileType,
    x: row,
    y: col,
    dir: [0, 0],
  }));

  return tiles;
};

const isPath = (type: TileType) => {
  return (
    type === "." || type === "<" || type === ">" || type === "^" || type === "v"
  );
};

const isValidPath = (tile: Tile, dir: [number, number]) => {
  let [dx, dy] = dir;
  switch (tile.type) {
    case ".":
      return true;
    case "<":
      return !(dx === 0 && dy === 1); //EAST
    case ">":
      return !(dx === 0 && dy === -1); //WEST
    case "^":
      return !(dx === 1 && dy === 0); // SOUTH
    case "v":
      return !(dx === -1 && dy === 0); // NORTH
    case "#":
    default:
      return false;
  }
};

const findPaths = (t: Tile, map: Tile[][], dir: [number, number]) => {
  let height = map.length;
  let width = map[0].length;
  let directions: Array<[number, number]> = [];
  let [currX, currY] = dir;
  Directions.forEach((d) => {
    let [dx, dy] = d;
    // Don't walk backwards
    if (dx + currX === 0 && dy + currY === 0) {
      return;
    }
    // try new direction
    let newX = t.x + dx;
    let newY = t.y + dy;
    if (
      0 <= newX &&
      newX < height &&
      0 <= newY &&
      newY < width &&
      isPath(map[newX][newY].type)
    ) {
      directions.push([dx, dy]);
    }
  });
  return directions;
};

// Given a node and direction, return next node and edge count.
const walkPath = (node: Tile, dir: [number, number], map: Tile[][]) => {
  let count = 0;
  let path = [dir];
  let curX = node.x;
  let curY = node.y;
  let lastDir = dir;
  while (path.length === 1) {
    let curDir = path.pop()!;
    let [dx, dy] = curDir;
    curX += dx;
    curY += dy;
    let visit = map[curX][curY];
    if (!isValidPath(visit, curDir)) {
      return { nextNode: null, edge: null, dir: null };
    }
    visit.dir = [dx, dy];
    // console.log("visiting:", visit);
    path.push(...findPaths(visit, map, curDir));
    count++;
    lastDir = curDir;
  }

  let nextNode: Node = {
    x: curX,
    y: curY,
    id: map[curX][curY].id,
    edges: new Map<string, Edge>(),
  };
  let edge: Edge = { fromNode: node.id, toNode: nextNode.id, length: count };

  return { nextNode, edge, dir: lastDir };
};

// Graph of forks as nodes and edges as length of paths.
const buildGraph = (map: Tile[][], start: Node, end: Node) => {
  // Initial Tile to start walking
  let fromTile = [map[start.x][start.y]];

  let graph = new Map<string, Node>();
  graph.set(start.id, start);

  while (fromTile.length !== 0) {
    let visit = fromTile.pop()!;
    // Define edge length and find nodes to visit.
    let pathDirections = findPaths(visit, map, visit.dir);
    pathDirections.forEach((p) => {
      let { nextNode, edge, dir } = walkPath(visit, p, map);

      if (nextNode === null || edge === null || dir === null) {
        return;
      }
      // Add next Node to graph
      graph.set(nextNode.id, nextNode);
      // Add edge to fromNode
      let fromNode = graph.get(visit.id)!;
      fromNode.edges.set(edge.toNode, edge);

      // set next fork tile to visit.
      let nextTile = map[nextNode.x][nextNode.y];
      nextTile.dir = dir;
      fromTile.push(nextTile);
    });
  }

  return graph;
};

const topologicalSort = (node: Node, graph: Map<string, Node>, orderedArray: Array<string>) => {
  node.edges.forEach(e => {
    if(!orderedArray.includes(e.toNode)) {
      topologicalSort(graph.get(e.toNode)!, graph, orderedArray)
    }
  })
  orderedArray.push(node.id)
}


type NodeWeight = {
  id: string;
  weight: number;
};

const findLongestDistances = (start: Node, end: Node, graph: Map<string, Node>, orderedStack: Array<string>) => {
  let distances = new Map<string, number>()

  let nodeIds = Array.from(graph.keys());
  nodeIds.forEach((n) => {
    let distance =  n === start.id ? 0 : Number.MIN_VALUE
    distances.set(n, distance)
  });

  // Process vertices in topological order 
    while (orderedStack.length !== 0) { 
      // Get the next vertex from topological order 
      let nodeId = orderedStack.pop()!;
      let node = graph.get(nodeId)!
 
      let distance = distances.get(nodeId)!
      // Update distances of all adjacent vertices 
      if (distance !== Number.MIN_VALUE) { 
        node.edges.forEach(e => {
          if (distances.get(e.toNode)! < distance + e.length) {
            distances.set(e.toNode, (distance + e.length))
          }
        })
      } 
  } 

  console.log('distances', distances)

  return distances
};

const readMaze = () => {
  let lines = readInput();
  console.log("lines", lines);
  let map = lines.map((l: string, row: number) => parseLine(l, row));
  console.log("map", map);
  let start = map[0][1];
  let end = map[map.length - 1][map[0].length - 2];

  let startNode: Node = {
    x: start.x,
    y: start.y,
    id: start.id,
    edges: new Map<string, Edge>(),
  };
  let endNode: Node = {
    x: end.x,
    y: end.y,
    id: end.id,
    edges: new Map<string, Edge>(),
  };
  let graph = buildGraph(map, startNode, endNode);
  console.log("graph", inspect(graph, false, null, true));

  let orderedStack: string [] = []
  topologicalSort(startNode, graph, orderedStack)
  console.log('orderedStack', orderedStack)

  let distances = findLongestDistances(startNode, endNode, graph, orderedStack);
  console.log('Longest Distance:', distances.get(endNode.id)!)

};

readMaze();
