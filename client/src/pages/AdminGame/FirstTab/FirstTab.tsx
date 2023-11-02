import "./FirstTab.css";
import { useContext, useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { AuthContext } from "../../../utils/context";
import { ClueInfo } from "../../../utils/types";

const fixedCluesSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // this is fixed

const defaultClueInfo: ClueInfo = {
  clueID: 0,
  clueText: "",
  imageURL: "",
  location: "",
  QR_text: "",
};

const FirstTab = () => {
  // Get current user information
  const { user } = useContext(AuthContext);
  const { gId } = useParams();

  // Game information section
  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Clues information section
  const [providedClues, setProvidedClues] = useState<ClueInfo[]>([]);
  const [numProvidedClues, setNumProvidedClues] = useState<number[]>([]);
  const [currentClueNum, setCurrentClueNum] = useState(1);
  const [currentClueInfo, setCurrentClueInfo] = useState(defaultClueInfo);
  const [latestClueNum, setLatestClueNum] = useState(1); // this is the latest clue number that has been saved

  const [step, setStep] = useOutletContext();

  const saveGameInfo = async () => {
    // save game information to backend
    await fetch(`http://localhost:9999/mygame/${gId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: gId,
        gameName: gameName,
        gameDescription: gameDescription,
        startTime: startTime,
        endTime: endTime,
      }),
    });
  };

  const saveClueInfo = async () => {
    // replace the changed clues
    const tempClues = providedClues;
    if (currentClueNum < latestClueNum) {
      tempClues[currentClueNum - 1] = currentClueInfo;
    } else {
      tempClues.push(currentClueInfo);
    }
    setProvidedClues(tempClues);
    console.log(tempClues);

    // update clues information to backend
    await fetch(`http://localhost:9999/mygame/${gId}/${currentClueNum}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempClues),
    });
  };

  const handletoProcess = async () => {
    setStep(step + 1);
    const tempClues = providedClues;
    for (let i = 0; i < tempClues.length; i++) {
      tempClues[i].QR_text = `http://localhost:9999/${gId}/${i + 1}`;
    }
    await fetch(`http://localhost:9999/mygame/${gId}/${currentClueNum}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempClues),
    });
  };

  useEffect(() => {
    // load provided game information from backend
    const loadedGameInfo = async () => {
      try {
        // console.log(gId);
        const response = await fetch(`http://localhost:9999/mygame/${gId}`);
        if (response.ok) {
          const data = await response.json();
          //     // Handle the data and set state accordingly
          // console.log(data);
          if (Object.keys(data.hints).length === 0) {
            setLatestClueNum(1);
          } else {
            setLatestClueNum(data?.hints.length + 1);
            const numProvidedCluesTemp = data?.hints.map(
              (clue: ClueInfo) => clue.clueID
            );
            setNumProvidedClues(numProvidedCluesTemp);
            setProvidedClues(data?.hints);
          }
          setGameName(data?.name);
          setGameDescription(data?.description);
          setStartTime(data?.starttime);
          setEndTime(data?.endtime);

          setCurrentClueInfo(data?.hints[0]);
        } else {
          // Handle the situation when the response is not ok (e.g., error handling)
          console.error("Error fetching data:", response.status);
        }
      } catch (error) {
        // Handle any other errors that might occur during the fetch process
        console.error("Error:", error);
      }
    };
    loadedGameInfo();
  }, []);

  // useEffect(() => {

  // }, [providedClues]);

  if (user === null) return null;

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
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <input
                type="date"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <button className="save-btn" onClick={() => saveGameInfo()}>
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
                      if (numProvidedClues.includes(num)) {
                        setCurrentClueNum(num);
                        setCurrentClueInfo(providedClues[num - 1]);
                      } else {
                        setCurrentClueNum(latestClueNum);
                        setCurrentClueInfo({
                          ...defaultClueInfo,
                          clueID: providedClues.length + 1,
                        });
                      }
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
                value={currentClueInfo?.clueText}
                onChange={(e) => {
                  setCurrentClueInfo({
                    ...currentClueInfo,
                    clueText: e.target.value,
                  });
                }}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={currentClueInfo?.imageURL}
                onChange={(e) => {
                  setCurrentClueInfo({
                    ...currentClueInfo,
                    imageURL: e.target.value,
                  });
                }}
              />
              <button className="save-btn" onClick={() => saveClueInfo()}>
                Save
              </button>
            </form>
          </div>
        </div>

        <Link
          to={`/mygame/${gId}/process`}
          onClick={() => handletoProcess()}
          className="nav-btn"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default FirstTab;
