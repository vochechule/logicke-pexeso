import { useState, useEffect, useRef } from "react";
import { generateNumberPairs } from "./data/numbers";
import { generateColorPairs } from "./data/colors";
import { generateSymbolPairs } from "./data/symbols";
import "./styles/App.css";
//import "./styles/Troll.css";
import ParticleBackground from './components/ParticleBackground';


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

  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const [leaderboard, setLeaderboard] = useState([]);

  // Load leaderboard from localStorage
  useEffect(() => {
    const key = `${gameType}_${pairCount}_leaderboard`;
    const saved = localStorage.getItem(key);
    if (saved) setLeaderboard(JSON.parse(saved));
    else setLeaderboard([]);
  }, [gameType, pairCount]);

  // Timer effect
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  // Start new game and reset timer + stop timer
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
    setTimer(0);
    setRunning(false); // Timer **nezapínáme** hned při nové hře, ale až při prvním kliknutí
  };

  // Detect win
  useEffect(() => {
    if (matched.length === pairCount && pairCount > 0) {
      setRunning(false);
      createConfetti();
      saveScore(timer);
    }
  }, [matched, pairCount]);

  const saveScore = (time) => {
    if (time === 0) return;
    const key = `${gameType}_${pairCount}_leaderboard`;
    const updated = [...leaderboard, time].sort((a, b) => a - b).slice(0, 5);
    setLeaderboard(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const createConfetti = () => {
    const container = document.createElement("div");
    container.className = "confetti";

    for (let i = 0; i < 100; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      piece.style.animationDelay = `${Math.random() * 5}s`;
      piece.style.width = `${Math.random() * 10 + 5}px`;
      piece.style.height = piece.style.width;
      container.appendChild(piece);
    }

    document.body.appendChild(container);

    setTimeout(() => {
      container.remove();
    }, 5000);
  };

  const handleFlip = (card) => {
    if (
      flipped.length === 2 ||
      flipped.includes(card.id) ||
      matched.includes(card.value)
    )
      return;

    if (!running) setRunning(true); // Start timer při prvním kliknutí

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped.map((id) =>
        cards.find((c) => c.id === id)
      );

      if (first.value === second.value) {
        setMatched([...matched, first.value]);
        setTimeout(() => setFlipped([]), 500);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };
  // Format seconds as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="App">
      <ParticleBackground/>
      {/* Leaderboard + timer nahoře vlevo */}
      <div className="leaderboard">
  <h2 className="leaderboard-title">Nejlepší časy</h2>
  {leaderboard.length === 0 ? (
    <p className="leaderboard-empty">Zatím žádné záznamy</p>
  ) : (
    <ol className="leaderboard-list">
      {leaderboard.map((time, i) => (
        <li key={i} className="leaderboard-item">{formatTime(time)}</li>
      ))}
    </ol>
  )}
  <p className="leaderboard-timer">
    Čas: <strong>{formatTime(timer)}</strong>
  </p>
</div>

      <h1 style={{ textAlign: "center", marginTop: "3rem" }}>
        ✨✨Logické pexeso✨✨
      </h1>

      {/* Game mode selection */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        {Object.entries(GAME_TYPES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setGameType(key)}
            disabled={gameType === key}
            style={{ marginRight: "0.5rem" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Difficulty selection */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
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
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={newGame}>Nová hra</button>
      </div>

      <p style={{ textAlign: "center" }}>Počet pokusů: {moves}</p>
      <p style={{ textAlign: "center" }}>
        Zbývá párů: {pairCount - matched.length}
      </p>

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
