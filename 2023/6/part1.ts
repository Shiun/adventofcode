import { inputLinesArray } from "../utils/utils";

type Race = {
  distance: number,
  time: number
}


const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines
}

const parseTime = (game: string) => {
  const timeRegex = /^Time:[ ]*([\d* ]*)$/;
  const match = game.match(timeRegex);
  const times = match?.[1].split(" ").map(i => parseInt(i)).filter(i => (!isNaN(i)))
  console.log('Times', times)
  return times
};

const parseDistance = (game: string) => {
  const distanceRegex = /^Distance:[ ]*([\d* ]*)$/;
  const match = game.match(distanceRegex);
  const distances = match?.[1].split(" ").map(i => parseInt(i)).filter(i => (!isNaN(i)))
  console.log('Distances', distances)
  return distances
};

const possibleWins = (race: Race) => {
  let count = 0
  for(let t = 1; t < race.time; t++) {
    // for(let speed = 1; speed < race.time; speed++) {
    //   if (t * )
    // }
    let speed = t;
    let distance = speed * (race.time - t)
    if (distance > race.distance) {
      count++
    }
  }
  return count
}

const processInput = () => {
  const lines = readInput();
  const times = parseTime(lines[0])
  const distances = parseDistance(lines[1])

  const races: Race[] = []
  if (times!.length === distances!.length) {
    for (let i = 0; i < times!.length; i++) {
      races.push({distance: distances![i], time: times![i]})
    }
  }
  console.log('races', races)

  let wins: number[] = []
  races.forEach(r => {
    let w = possibleWins(r)
    wins.push(w)
  })
  console.log('wins', wins)
  console.log('possible ways to beat record', wins.reduce((a, c) => a * c))
}

processInput();