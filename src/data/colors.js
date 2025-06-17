const COLORS = [
  "red", "green", "blue", "orange", "purple", "pink",
  "brown", "gray", "cyan", "lime", "magenta", "gold"
];

export const generateColorPairs = (pairCount = 8) => {
  const selected = COLORS.slice(0, pairCount);
  const pairs = [];

  selected.forEach((color, i) => {
    pairs.push({ id: i + "a", value: color });
    pairs.push({ id: i + "b", value: color });
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
