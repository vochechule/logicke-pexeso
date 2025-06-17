const SYMBOLS = ["★", "♥", "♦", "♣", "♠", "☀", "☁", "♫", "⚡", "☂", "✈", "⚙"];

export const generateSymbolPairs = (pairCount = 8) => {
  const selected = SYMBOLS.slice(0, pairCount);
  const pairs = [];

  selected.forEach((symbol, i) => {
    pairs.push({ id: i + "a", value: symbol });
    pairs.push({ id: i + "b", value: symbol });
  });

  return shuffle(pairs);
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
