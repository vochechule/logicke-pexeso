import { useState, useEffect } from "react";
import { generateNumberPairs } from "./data/numbers";
import { generateColorPairs } from "./data/colors";
import { generateSymbolPairs } from "./data/symbols";
import "./styles/App.css";

const GAME_TYPES = {
  numbers: { label: "Čísla", generator: generateNumberPairs },
  colors: { label: "Barvy", generator: generateColorPairs },
  symbols: { label: "Symboly", generator: generateSymbolPairs },
};

function App() {
  const [gameType, setGameType] = useState("numbers");
  const [pairCount, setPairCount] = useState(8);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    newGame();
  }, [gameType, pairCount]);

  const newGame = () => {
    const generator = GAME_TYPES[gameType].generator;
    const newCards = generator(pairCount);
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleFlip = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.value)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped.map((id) => cards.find((c) => c.id === id));

      if (first.value === second.value) {
        setMatched([...matched, first.value]);
        setTimeout(() => setFlipped([]), 500);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="App">
      <h1>Logické pexeso</h1>

      {/* Game mode selection */}
      <div style={{ marginBottom: "1rem" }}>
        {Object.entries(GAME_TYPES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setGameType(key)}
            disabled={gameType === key}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Difficulty selection */}
      <div style={{ marginBottom: "1rem" }}>
        Obtížnost:{" "}
        <select
          value={pairCount}
          onChange={(e) => setPairCount(Number(e.target.value))}
        >
          <option value={6}>6 dvojic</option>
          <option value={8}>8 dvojic</option>
          <option value={12}>12 dvojic</option>
        </select>
      </div>

      {/* New game button */}
      <button onClick={newGame} style={{ marginBottom: "1rem" }}>
        Nová hra
      </button>

      <p>Počet pokusů: {moves}</p>
      <p>Zbývá párů: {pairCount - matched.length}</p>

      {/* Game board */}
      <div className="grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card-wrapper"
            onClick={() => handleFlip(card)}
          >
            <div
              className={`card-inner ${
                flipped.includes(card.id) || matched.includes(card.value)
                  ? "flipped"
                  : ""
              }`}
            >
              <div className="card-front">?</div>
              <div
                className="card-back"
                style={
                  gameType === "colors"
                    ? { backgroundColor: card.value, color: "transparent" }
                    : {}
                }
              >
                {gameType === "symbols" ? card.value : card.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
