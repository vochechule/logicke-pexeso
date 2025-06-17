export const generateNumberPairs = (pairCount = 8) => {
  const numbers = Array.from({ length: pairCount }, (_, i) => i + 1);
  const pairs = [];

  numbers.forEach((num, index) => {
    pairs.push({ id: index + 'a', value: num });
    pairs.push({ id: index + 'b', value: num });
  });

  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  return pairs;
};
