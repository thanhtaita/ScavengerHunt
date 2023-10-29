import "./FirstTab.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const fixedCluesSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // this is fixed
interface ClueInfo {
  clueNum: number;
  question: string;
  imageURL: string;
}

const defaultClueInfo: ClueInfo = {
  clueNum: 0,
  question: "",
  imageURL: "",
};

const loadedClues: ClueInfo[] = [
  {
    clueNum: 1,
    question: "This is the question for first clue",
    imageURL:
      "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    clueNum: 2,
    question: "This is the question for second clue",
    imageURL:
      "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    clueNum: 3,
    question: "This is the question for third clue",
    imageURL:
      "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
]; // after loading from backend, this will be updated

const FirstTab = () => {
  // Game information section
  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Clues information section
  const [providedClues, setProvidedClues] = useState<ClueInfo[]>([]);
  const [numProvidedClues, setNumProvidedClues] = useState<number[]>([]);
  const [currentClueNum, setCurrentClueNum] = useState(1);
  const [currentClueInfo, setCurrentClueInfo] = useState(defaultClueInfo);
  const [latestClueNum, setLatestClueNum] = useState(1); // this is the latest clue number that has been saved

  useEffect(() => {
    // load provided clues from backend
    setProvidedClues(loadedClues);
    const numProvidedClues = loadedClues.map(({ clueNum }) => clueNum);
    setNumProvidedClues(numProvidedClues);
    setLatestClueNum(numProvidedClues.length + 1);
    setCurrentClueInfo(loadedClues[0]);
    setCurrentClueNum(1);
  }, []);

  return (
    <div className="first-tab">
      <h1 className="title">Fill Questions</h1>
      <div className="content">
        <div className="game-info">
          <div className="general-info">
            <form>
              <input
                type="text"
                placeholder="Game name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Game description"
                value={gameDescription}
                onChange={(e) => setGameDescription(e.target.value)}
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button
                className="save-btn"
                onClick={() => console.log("save game information")}
              >
                Save
              </button>
            </form>
            <div className="clues-info">
              <label>Enter clue information</label>
              <div className="scroll-container">
                {fixedCluesSize.map((num) => (
                  <button
                    className={`scroll-item ${
                      numProvidedClues.includes(num) ? "provided" : ""
                    }`}
                    key={num}
                    onClick={() => {
                      setCurrentClueNum(num);
                      setCurrentClueInfo(providedClues[num - 1]);
                    }}
                  >
                    Clue {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="each-question">
            <div>Clue {currentClueNum}</div>
            <form>
              <input
                type="text"
                placeholder="Question"
                value={currentClueInfo.question}
                onChange={(e) => {
                  setCurrentClueInfo({
                    ...currentClueInfo,
                    question: e.target.value,
                  });
                }}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={currentClueInfo.imageURL}
                onChange={(e) => {
                  setCurrentClueInfo({
                    ...currentClueInfo,
                    imageURL: e.target.value,
                  });
                }}
              />
              <button
                className="save-btn"
                onClick={() => console.log(`save clue ${currentClueNum}`)}
              >
                Save
              </button>
            </form>
          </div>
        </div>

        <Link to="/mygame/process" className="nav-btn">
          Next
        </Link>
      </div>
    </div>
  );
};

export default FirstTab;
