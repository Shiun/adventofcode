"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const { inspect } = require("util");
const Directions = [
    [-1, 0], // North
    [1, 0], // South
    [0, 1], // East
    [0, -1], // West
];
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseLine = (line, row) => {
    let tiles = line.split("").map((t, col) => ({
        id: `${row},${col}`,
        type: t,
        x: row,
        y: col,
        dir: [0, 0],
    }));
    return tiles;
};
const isPath = (type) => {
    return (type === "." || type === "<" || type === ">" || type === "^" || type === "v");
};
const isValidPath = (tile, dir) => {
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
const findPaths = (t, map, dir) => {
    let height = map.length;
    let width = map[0].length;
    let directions = [];
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
        if (0 <= newX &&
            newX < height &&
            0 <= newY &&
            newY < width &&
            isPath(map[newX][newY].type)) {
            directions.push([dx, dy]);
        }
    });
    return directions;
};
// Given a node and direction, return next node and edge count.
const walkPath = (node, dir, map) => {
    let count = 0;
    let path = [dir];
    let curX = node.x;
    let curY = node.y;
    let lastDir = dir;
    while (path.length === 1) {
        let curDir = path.pop();
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
    let nextNode = {
        x: curX,
        y: curY,
        id: map[curX][curY].id,
        edges: new Map(),
    };
    let edge = { fromNode: node.id, toNode: nextNode.id, length: count };
    return { nextNode, edge, dir: lastDir };
};
// Graph of forks as nodes and edges as length of paths.
const buildGraph = (map, start, end) => {
    // Initial Tile to start walking
    let fromTile = [map[start.x][start.y]];
    let graph = new Map();
    graph.set(start.id, start);
    while (fromTile.length !== 0) {
        let visit = fromTile.pop();
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
            let fromNode = graph.get(visit.id);
            fromNode.edges.set(edge.toNode, edge);
            // set next fork tile to visit.
            let nextTile = map[nextNode.x][nextNode.y];
            nextTile.dir = dir;
            fromTile.push(nextTile);
        });
    }
    return graph;
};
const connectGraph = (graph) => {
    let nodeIds = Array.from(graph.keys());
    nodeIds.forEach((n) => {
        let fromNode = graph.get(n);
        fromNode.edges.forEach((e) => {
            let toNode = graph.get(e.toNode);
            if (!toNode.edges.has(n)) {
                toNode.edges.set(n, {
                    fromNode: toNode.id,
                    toNode: n,
                    length: e.length,
                });
            }
        });
    });
};
const topologicalSort = (node, graph, orderedArray) => {
    node.edges.forEach((e) => {
        if (!orderedArray.includes(e.toNode)) {
            topologicalSort(graph.get(e.toNode), graph, orderedArray);
        }
    });
    orderedArray.push(node.id);
};
const findLongestDistances = (current, end, graph, visited, weight) => {
    visited.push(current.id);
    if (current.id === end.id) {
        return [{ nodes: visited, weight }];
    }
    let result = [];
    current.edges.forEach((e) => {
        if (visited.includes(e.toNode)) {
            return;
        }
        // visited.push(e.toNode)
        let nextNode = graph.get(e.toNode);
        result.push(...findLongestDistances(nextNode, end, graph, [...visited], weight + e.length));
    });
    result = result.filter((r) => r.nodes.includes(end.id));
    return result;
};
const iFindLongestDistances = (start, end, graph) => {
    let paths = [{ nodes: [start.id], weight: 0 }];
    let results = [];
    while (paths.length !== 0) {
        let currPath = paths.pop();
        let currNode = graph.get(currPath.nodes[currPath.nodes.length - 1]);
        let newPaths = [];
        currNode.edges.forEach(e => {
            // Avoid revisiting nodes
            if (currPath.nodes.includes(e.toNode)) {
                return;
            }
            let newPath = { nodes: [...currPath.nodes, e.toNode], weight: currPath.weight + e.length };
            if (e.toNode === end.id) {
                results.push(newPath);
            }
            else {
                newPaths.push(newPath);
            }
        });
        paths.push(...newPaths);
    }
    return results;
};
const readMaze = () => {
    let lines = readInput();
    let map = lines.map((l, row) => parseLine(l, row));
    let start = map[0][1];
    let end = map[map.length - 1][map[0].length - 2];
    let startNode = {
        x: start.x,
        y: start.y,
        id: start.id,
        edges: new Map(),
    };
    let endNode = {
        x: end.x,
        y: end.y,
        id: end.id,
        edges: new Map(),
    };
    let graph = buildGraph(map, startNode, endNode);
    // Bidrectional graph
    connectGraph(graph);
    // console.log("graph", inspect(graph, false, null, true));
    // Calculate Longest Path with DFS
    let visited = [];
    let weight = 0;
    // let result = findLongestDistances(startNode, endNode, graph, visited, weight);
    // console.log("result", result);
    let result = iFindLongestDistances(startNode, endNode, graph);
    // console.log("result", result);
    let longest = 0;
    let path;
    result.forEach((r) => {
        if (r.weight > longest) {
            longest = r.weight;
            path = r;
        }
    });
    console.log('number of possible paths', result.length);
    console.log("longest", path);
};
readMaze();
//# sourceMappingURL=part2.js.map