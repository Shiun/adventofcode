"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input.txt");
    return lines;
};
const parseBricks = (line, row) => {
    let ends = line.split("~");
    let regEx = /^(?<x>[\d]+),(?<y>[\d]+),(?<z>[\d]+)$/;
    let startMatch = ends[0].match(regEx);
    let endMatch = ends[1].match(regEx);
    return {
        id: `id: ${row}`,
        startX: parseInt(startMatch.groups.x),
        startY: parseInt(startMatch.groups.y),
        startZ: parseInt(startMatch.groups.z),
        endX: parseInt(endMatch.groups.x),
        endY: parseInt(endMatch.groups.y),
        endZ: parseInt(endMatch.groups.z),
        dropIDs: [],
        topBricks: [],
    };
};
const sortBricks = (bricks) => {
    bricks.sort((a, b) => a.startZ - b.startZ);
};
const maxVolume = (bricks) => {
    let x = 0;
    let y = 0;
    let z = 1;
    bricks.forEach((b) => {
        x = x < b.endX ? b.endX : x;
        y = y < b.endY ? b.endY : y;
        z = z < b.endZ ? b.endZ : z;
    });
    return { x, y, z };
};
const getInitialState = (v) => {
    let state = new Array();
    for (let x = 0; x <= v.x; x++) {
        state[x] = [];
        for (let y = 0; y <= v.y; y++) {
            state[x][y] = [];
            for (let z = 0; z <= v.z; z++) {
                state[x][y][z] = z === 0 ? true : false;
            }
        }
    }
    return state;
};
const setOccupiedState = (b, state, occupied = true) => {
    for (let x = b.startX; x <= b.endX; x++) {
        for (let y = b.startY; y <= b.endY; y++) {
            for (let z = b.startZ; z <= b.endZ; z++) {
                state[x][y][z] = occupied;
            }
        }
    }
};
const restState = (bricks, v) => {
    let state = getInitialState(v);
    bricks.forEach((b) => {
        let stop = false;
        while (!stop) {
            for (let x = b.startX; x <= b.endX; x++) {
                for (let y = b.startY; y <= b.endY; y++) {
                    // Check if space below brick is occupied
                    if (state[x][y][b.startZ - 1] === true) {
                        stop = true;
                    }
                }
            }
            if (!stop) {
                // Move brick downward
                b.startZ--;
                b.endZ--;
            }
        }
        // Update state with final brick position
        setOccupiedState(b, state);
    });
    setTopBricks(bricks);
    return state;
};
const dropIDs = (bricks, state) => {
    let dropIDs = [];
    for (let i = 0; i < bricks.length; i++) {
        let b = bricks[i];
        let drops = true;
        for (let x = b.startX; x <= b.endX; x++) {
            for (let y = b.startY; y <= b.endY && drops; y++) {
                // Check if space below brick is occupied
                if (state[x][y][b.startZ - 1] === true) {
                    drops = false;
                }
            }
        }
        drops ? dropIDs.push(b.id) : undefined;
    }
    return dropIDs;
};
const findTopBricks = (b, bricks) => {
    let candidates = bricks.filter((c) => c.startZ === b.startZ + 1 || c.startZ === b.endZ + 1);
    return candidates;
};
const displaySlice = (b, state) => {
    let slices = [];
    for (let z = b.startZ; z <= b.endZ; z++) {
        let slice = [];
        for (let x = 0; x < state.length; x++) {
            slice[x] = "";
            for (let y = 0; y < state[0].length; y++) {
                slice[x] = slice[x] + (state[x][y][z] === true ? "#" : ".");
            }
        }
        slices.push(slice);
        slice = [];
    }
    console.log("brick", b);
    slices.forEach((s) => {
        console.log("\n");
        s.forEach((l) => {
            console.log(l);
        });
        console.log("\n");
    });
};
const countBricksWithFallingNeighbors = (bricks, state) => {
    let count = 0;
    bricks.forEach((b, index) => {
        let stateCopy = JSON.parse(JSON.stringify(state));
        // displaySlice(b, state);
        // remove b and see if directTopNeighbors will drop.
        setOccupiedState(b, stateCopy, false);
        // displaySlice(b, stateCopy);
        b.dropIDs = dropIDs(b.topBricks, stateCopy);
        if (b.dropIDs.length !== 0) {
            count++;
        }
    });
    return count;
};
const setTopBricks = (bricks) => {
    bricks.forEach((b, index) => {
        let topBricks = index < bricks.length - 1 ? bricks.slice(index + 1) : [];
        b.topBricks = findTopBricks(b, topBricks);
    });
};
const countChainReaction = (bricks, bricksMap, state) => {
    let chainCount = 0;
    let chainIds = new Map();
    bricks.forEach((b, index) => {
        let stateCopy = JSON.parse(JSON.stringify(state));
        let brickIds = [b.id];
        while (brickIds.length !== 0) {
            // remove b and see if directTopNeighbors will drop.
            let nextIds = [];
            let removedBrick;
            brickIds.forEach((id) => {
                removedBrick = bricksMap.get(id);
                setOccupiedState(removedBrick, stateCopy, false);
            });
            brickIds.forEach((id) => {
                removedBrick = bricksMap.get(id);
                removedBrick.dropIDs = dropIDs(removedBrick.topBricks, stateCopy);
                nextIds.push(...removedBrick.dropIDs);
            });
            nextIds = nextIds.filter((id, index) => nextIds.indexOf(id) === index);
            nextIds.forEach(i => chainIds.set(i, i));
            brickIds = nextIds;
        }
        chainCount += chainIds.size;
        chainIds = new Map();
    });
    return chainCount;
};
const readMap = () => {
    let lines = readInput();
    // console.log("lines", lines);
    let bricks = lines.map((l, row) => parseBricks(l, row));
    sortBricks(bricks);
    // console.log("bricks", bricks);
    let v = maxVolume(bricks);
    console.log("volume", v);
    let state = restState(bricks, v);
    // console.log("state", state);
    // console.log("final brick state", bricks);
    let count = countBricksWithFallingNeighbors(bricks, state);
    // Map for easier reference to bricks
    let bricksMap = new Map();
    bricks.forEach((b) => {
        bricksMap.set(b.id, b);
    });
    let chainCount = countChainReaction(bricks, bricksMap, state);
    console.log("final brick state", bricks);
    console.log("bricksMap", bricksMap);
    console.log("bricks with falling neighbors:", count);
    console.log("chain reaction count:", chainCount);
};
readMap();
//# sourceMappingURL=part2.js.map