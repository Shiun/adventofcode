import { inputLinesArray } from "../utils/utils";

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
};

const readInput = () => {
  const lines = inputLinesArray("input.txt");
  return lines;
};

const parseHandAndBid = (line: string): Hand => {
  let handRegex = /^([2-9AKQJT]{5}) ([\d]*)$/;
  let match = line.match(handRegex);
  return { hand: match![1], bid: parseInt(match![2]), type: undefined, strength: 0 };
};
const FACES = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

const cardType = (hand: Hand) => {
  let cards = hand.hand.split("");
  // console.log("cards", cards);
  let faces = cards.map((card) => FACES.indexOf(card));
  // console.log("faces", faces);

  let groups = FACES.map((face, i) => faces.filter((j) => i === j).length).sort(
    (x, y) => y - x
  );
  // console.log('groups', groups)
  // console.log("sorted groups", groups);

  if (groups[0] === 5) return "FIVE_OF_KIND";
  if (groups[0] === 4) return "FOUR_OF_KIND";
  if (groups[0] === 3 && groups[1] === 2) return "FULL_HOUSE";
  if (groups[0] === 3) return "THREE_OF_KIND";
  if (groups[0] === 2 && groups[1] === 2) return "TWO_PAIR";
  if (groups[0] === 2) return "ONE_PAIR";
  return "HIGH_CARD";
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
  let cards1 = hand1.hand.split('')
  let cards2 = hand2.hand.split('')

  // console.log('cards1', cards1)
  // console.log('cards2', cards2)
  for (let i = 0; i < cards1.length; i++) {
    let card1Strength = FACES.indexOf(cards1[i])
    let card2Strength = FACES.indexOf(cards2[i])
    if (card1Strength > card2Strength) {
      return 1
    } else if (card1Strength < card2Strength) {
      return -1
    }
  }
  return 0
}

const sortCardByStrength = (hands: Hand[]) => {
  hands.sort((a, b) => {
    let compare =  a.strength - b.strength;
    if(compare !== 0) return compare;
    return compareHands(a, b)
  });
};

const readCards = () => {
  let lines = readInput();
  let hands = lines.map((l: string) => {
    return parseHandAndBid(l);
  });

  hands.forEach((h: Hand) => {
    h.type = cardType(h);
    h.strength = cardStrength(h.type)
  });
  // console.log("Hands", hands);

  sortCardByStrength(hands)
  console.log("Sorted Hands", hands)

  const total = hands.reduce((sum: number, hand: Hand, index: number) => {
    let s =  sum + hand.bid * (index + 1)
    return s
  }, 0)

  console.log('Total:', total)
};

readCards();
