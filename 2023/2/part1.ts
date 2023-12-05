const {readFileSync} = require('fs');


const processSet = (set: string, color: string): number => {
  const ballRegex = new RegExp(`([0-9]*) ${color}`)
  const matches: RegExpMatchArray | null = set.match(ballRegex)
  if(matches) {
    return parseInt(matches[1])
  }
  return 0
}

const processLine = (line: string) => {
  const gameIdRegex = /^Game (\d*): (.*)$/
  const gameId: RegExpMatchArray | null = line.match(gameIdRegex);
  console.log(`Game Id : ${gameId?.[1]}`)
  console.log(`Game: ${gameId?.[2]}`)

  return processGame(`${gameId?.[1]}`, gameId?.[2])
  // processGame(gameId?.[2], 'green', 13)
  // processGame(gameId?.[2], 'blue', 14)
}

const processGame = (gameId: string | undefined, line: string | undefined) => {
  if (line === undefined || gameId === undefined) {
    return 0;
  }
  const sets = line.split('; ');

  sets.forEach((set, index) => {
    console.log(`Set ${index + 1}: ${set}`)
  })

  const colorLimits = { 'red': 12, 'green': 13, 'blue': 14}
  let over = false;
  for (const [color, limit] of Object.entries(colorLimits)) {

    sets.forEach(i => {
      // console.log(`Set: ${i}`);
      const cubes = processSet(i, `${color}`)
      if (cubes > limit) {
        console.log('return 0')
        console.log(`OVER: ${color}: ${cubes} which is > ${limit}`)
        over = true;
        return
      }
      console.log(`Ok: ${color}: ${cubes}`)
    })
  }

  if (over) {
    console.log(`Game return 0`)
    return 0
  } else {
    console.log(`Game return ${parseInt(gameId)}`)
    return parseInt(gameId)
  }
}

const inputStringArray = () => {
  const lines = readFileSync('input.txt').toString().split("\n").filter(n => n);
  let idSum = 0
  lines.forEach((i) => {
    idSum += processLine(i);
    console.log(`idSum = ${idSum}\n`)
  })

  console.log(`Game Id Sum: ${idSum}`)
}


inputStringArray();