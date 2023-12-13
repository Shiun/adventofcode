import { inputLinesArray } from "../utils/utils";
const util = require('util')

type CardType =
  | "FIVE_OF_KIND"
  | "FOUR_OF_KIND"
  | "FULL_HOUSE"
  | "THREE_OF_KIND"
  | "TWO_PAIR"
  | "ONE_PAIR"
  | "HIGH_CARD";

type Hand = {
  hand: string;
  bid: number;
  type: CardType | undefined;
  strength: number;
  jackCount: number;
};

type FaceGroup = {
  face: string;
  count: number;
};

type CardData = {
  type: CardType;
  groups: {
    face: string;
    count: number;
  }[];
  sortedGroups: {
    face: string;
    count: number;
  }[];
};

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const parseHandAndBid = (line: string): Hand => {
  let handRegex = /^([2-9AKQJT]{5}) ([\d]*)$/;
  let match = line.match(handRegex);
  return {
    hand: match![1],
    bid: parseInt(match![2]),
    type: undefined,
    strength: 0,
    jackCount: 0,
  };
};
const FACES = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];

const countCards = (hand: Hand) => {
  let cards = hand.hand.split("");
  // console.log("cards", cards);
  let faces = cards.map((card) => FACES.indexOf(card));
  // console.log("faces", faces);

  let groups = FACES.map((face, i) => {
    let grouping = faces.filter((j) => i === j).length;
    let faceCount = { face, count: grouping };
    return faceCount;
  });

  let sortedGroups = groups.map((i) => i).sort((x, y) => y.count - x.count);
  // console.log("groups", groups);
  // console.log("sortedGroups", sortedGroups);
  return { sortedGroups, groups };
};

const handType = (hand: Hand): CardData => {
  let { groups, sortedGroups } = countCards(hand);

  let numJokers = groups[0].count;
  if (sortedGroups[0].count === 5) {
    return { type: "FIVE_OF_KIND", groups, sortedGroups };
  }
  if (sortedGroups[0].count === 4) {
    if (sortedGroups[0].face === 'J') {
      return { type: "FIVE_OF_KIND", groups, sortedGroups };
    }
    if (numJokers === 1) {
      return { type: "FIVE_OF_KIND", groups, sortedGroups };
    }
    return { type: "FOUR_OF_KIND", groups, sortedGroups };
  }
  if (sortedGroups[0].count === 3 && sortedGroups[1].count === 2) {
    if (sortedGroups[0].face === 'J' || sortedGroups[1].face === 'J') {
      return { type: "FIVE_OF_KIND", groups, sortedGroups };
    }
    // // CAN'T HAPPEN
    // if(numJokers == 1) {
    // }
    return { type: "FULL_HOUSE", groups, sortedGroups };
  }
  if (sortedGroups[0].count === 3) {
    if(sortedGroups[0].face === 'J') {
      return { type: "FOUR_OF_KIND", groups, sortedGroups };
    }
    // CAN'T HAPPEND
    // if (numJokers === 2) {
    //   return { type: "FIVE_OF_KIND", groups, sortedGroups };
    // }
    if (numJokers === 1) {
      return { type: "FOUR_OF_KIND", groups, sortedGroups };
    }
    return { type: "THREE_OF_KIND", groups, sortedGroups };
  }
  if (sortedGroups[0].count === 2 && sortedGroups[1].count === 2) {
    if (sortedGroups[0].face === 'J' || sortedGroups[1].face === 'J') {
      return { type: "FOUR_OF_KIND", groups, sortedGroups };
    }
    if (numJokers === 1) {
      return { type: "FULL_HOUSE", groups, sortedGroups };
    }
    return { type: "TWO_PAIR", groups, sortedGroups };
  }
  if (sortedGroups[0].count === 2) {
    if (sortedGroups[0].face === 'J' ) {
      return { type: "THREE_OF_KIND", groups, sortedGroups };
    }
    if (numJokers === 1) {
      return { type: "THREE_OF_KIND", groups, sortedGroups };
    }
    return { type: "ONE_PAIR", groups, sortedGroups };
  }
  if (numJokers === 1) {
    return { type: "ONE_PAIR", groups, sortedGroups };
  }
  return { type: "HIGH_CARD", groups, sortedGroups };
};

const cardStrength = (type: CardType) => {
  switch (type) {
    case "FIVE_OF_KIND":
      return 7;
    case "FOUR_OF_KIND":
      return 6;
    case "FULL_HOUSE":
      return 5;
    case "THREE_OF_KIND":
      return 4;
    case "TWO_PAIR":
      return 3;
    case "ONE_PAIR":
      return 2;
    case "HIGH_CARD":
      return 1;
    default:
      return 0;
  }
};

const compareHands = (hand1: Hand, hand2: Hand) => {
  let cards1 = hand1.hand.split("");
  let cards2 = hand2.hand.split("");

  // console.log('cards1', cards1)
  // console.log('cards2', cards2)
  for (let i = 0; i < cards1.length; i++) {
    let card1Strength = FACES.indexOf(cards1[i]);
    let card2Strength = FACES.indexOf(cards2[i]);
    if (card1Strength > card2Strength) {
      return 1;
    } else if (card1Strength < card2Strength) {
      return -1;
    }
  }
  return 0;
};

const sortCardByStrength = (hands: Hand[]) => {
  hands.sort((a, b) => {
    let compare = a.strength - b.strength;
    if (compare !== 0) return compare;
    return compareHands(a, b);
  });
};

const readCards = () => {
  let lines = readInput();
  let hands = lines.map((l: string) => {
    return parseHandAndBid(l);
  });

  hands.forEach((h: Hand) => {
    let data = handType(h);
    h.type = data.type;
    h.strength = cardStrength(h.type);
    h.jackCount = data.groups[0].count;
  });
  // console.log("Hands", hands);

  sortCardByStrength(hands);
  console.log("Sorted Hands", util.inspect(hands, false, null, true));

  const total = hands.reduce((sum: number, hand: Hand, index: number) => {
    let s = sum + hand.bid * (index + 1);
    return s;
  }, 0);

  console.log("Total:", total);
};

readCards();
