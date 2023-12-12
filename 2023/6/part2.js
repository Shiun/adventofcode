"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const readInput = () => {
    const lines = (0, utils_1.inputLinesArray)("input2.txt");
    return lines;
};
const parseTime = (time) => {
    const timeRegex = /^Time:[ ]*([\d]*)$/;
    const match = time.match(timeRegex);
    const times = match === null || match === void 0 ? void 0 : match[1].split(" ").map((i) => parseInt(i)).filter((i) => !isNaN(i));
    console.log("Times", times);
    return times;
};
const parseDistance = (distance) => {
    const distanceRegex = /^Distance:[ ]*([\d]*)$/;
    const match = distance.match(distanceRegex);
    const distances = match === null || match === void 0 ? void 0 : match[1].split(" ").map((i) => parseInt(i)).filter((i) => !isNaN(i));
    console.log("Distances", distances);
    return distances;
};
// const possibleWins = (race: Race) => {
//   let count = 0;
//   for (let t = 1; t < race.time; t++) {
//     // for(let speed = 1; speed < race.time; speed++) {
//     //   if (t * )
//     // }
//     let speed = t;
//     let distance = speed * (race.time - speed);
//     if (distance > race.distance) {
//       count++;
//     }
//   }
//   return count;
// };
const lowestPossibleSpeed = (race) => {
    let lowSpeed = race.distance;
    let start = 0;
    let end = race.time;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        let speed = mid;
        let traveled = speed * (race.time - speed);
        if (traveled > race.distance) {
            if (speed < lowSpeed) {
                lowSpeed = speed;
            }
            end = mid - 1;
        }
        else {
            start = mid + 1;
        }
    }
    return lowSpeed;
};
const highestPossibleSpeed = (race) => {
    let highSpeed = 0;
    let start = 0;
    let end = race.time;
    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        let speed = mid;
        let traveled = speed * (race.time - speed);
        if (traveled > race.distance) {
            if (speed > highSpeed) {
                highSpeed = speed;
            }
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }
    return highSpeed;
};
const processInput = () => {
    const lines = readInput();
    const times = parseTime(lines[0]);
    const distances = parseDistance(lines[1]);
    const races = [];
    if (times.length === distances.length) {
        for (let i = 0; i < times.length; i++) {
            races.push({ distance: distances[i], time: times[i] });
        }
    }
    console.log("races", races);
    let lowSpeed = lowestPossibleSpeed(races[0]);
    console.log('Lowest Speed:', lowSpeed);
    console.log('check', lowSpeed * (races[0].time - lowSpeed) > races[0].distance);
    let highSpeed = highestPossibleSpeed(races[0]);
    console.log('Highest Speed:', highSpeed);
    console.log('check', highSpeed * (races[0].time - highSpeed) > races[0].distance);
    console.log('Number Possible Wins:', highSpeed - lowSpeed + 1);
    // let wins: number[] = []
    // races.forEach(r => {
    //   let w = possibleWins(r)
    //   wins.push(w)
    // })
    // console.log('wins', wins)
    // console.log('possible ways to beat record', wins.reduce((a, c) => a * c))
};
processInput();
