import "./FirstTab.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../utils/context";
import { ClueInfo } from "../../../utils/types";
import { GetContext } from "../AdminGame";
//
const serverUrl = import.meta.env.VITE_SERVER_URL;

const fixedCluesSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // this is fixed

const defaultClueInfo: ClueInfo = {
  clueID: 0,
  clueText: "",
  imageURL: "",
  location: "",
  QR_text: "",
};

function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const FirstTab = () => {
  // Get current user information
  const { user } = useContext(AuthContext);
  const { gId } = useParams();
  const navigate = useNavigate();

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

  const { step, setStep } = GetContext();

  const saveGameInfo = async () => {
    console.log(

      gId, gameName, gameDescription, startTime, endTime,
    )
    // save game information to backend
    const res = await fetch(`${serverUrl}/mygame/${gId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        gameId: gId,
        gameName: gameName,
        gameDescription: gameDescription,
        startTime: startTime,
        endTime: endTime,
      }),
    });
    if (res.status === 401) {
      navigate("/authfail");
      return;
    }
    if (!res.ok) {
      window.alert("Error happens. Please try again.");
      return;
    }
  };

  const saveClueInfo = async () => {
    // replace the changed clues
    const tempClues = providedClues;
    if (currentClueNum < latestClueNum) {
      tempClues[currentClueNum - 1] = currentClueInfo;
    } else {
      if (numProvidedClues.length === 0) {
        setNumProvidedClues([1]);
      }
      tempClues.push(currentClueInfo);
    }
    setProvidedClues(tempClues);
    console.log(tempClues);

    // update clues information to backend
    const res = await fetch(`${serverUrl}/mygame/${gId}/${currentClueNum}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempClues),
    });
    if (res.status === 401) {
      navigate("/authfail");
      return;
    }
  };

  function generateUniqueNumbersForGame(
    n: number,
    minVal: number,
    maxVal: number,
    gameId: string
  ): string[] {
    if (maxVal - minVal + 1 < n) {
      throw new Error(
        "Range too small for the number of unique values required."
      );
    }

    const uniqueNumbers = new Set<string>();
    while (uniqueNumbers.size < n) {
      const number = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      const qrCode = `${gameId}-${number}`;
      uniqueNumbers.add(qrCode);
    }

    return Array.from(uniqueNumbers);
  }
  const handletoProcess = async () => {
    setStep(step + 1);
    let tempClues = providedClues;
    const qrCodes = generateUniqueNumbersForGame(
      tempClues.length,
      10,
      10000,
      gId!
    );

    if (gId) {
      tempClues = tempClues.map((clue, index) => {
        if (clue.QR_text === "") {
          return {
            ...clue,
            QR_text: qrCodes[index],
          };
        }
        return clue;
      });
    }
    const res = await fetch(`${serverUrl}/mygame/${gId}/${currentClueNum}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempClues),
    });
    if (res.status === 401) {
      navigate("/authfail");
      return;
    }
  };
  useEffect(() => {
    console.log(gameDescription)
  }, [gameDescription])
  useEffect(() => {
    // load provided game information from backend
    const loadedGameInfo = async () => {
      try {
        // console.log(gId);
        const response = await fetch(`${serverUrl}/mygame/${gId}`, {
          credentials: "include",
        });
        if (response.status === 401) {
          navigate("/authfail");
          return;
        }
        if (response.ok) {
          const data = await response.json();
          //     // Handle the data and set state accordingly

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

  if (user === null) return null;

  return (
    <div className="first-tab">
      <div className="content">
        <div className="game-info">
          <div className="general-info">
            <form id="form1" name="form1">
              <input
                type="text"
                placeholder="Game name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Game description"
                value={gameDescription}
                onChange={(e) => setGameDescription(e.target.value)}
                required
              />
              <label className="start">Start time</label>
              <input
                type="datetime-local"
                value={startTime}
                min={formatDateTime(new Date())}
                onChange={(e) => {
                  setStartTime(e.target.value);
                }}
                required
              />
              <label className="end">End time</label>
              <input
                type="datetime-local"
                value={endTime}
                min={startTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
                required
              />

            </form>
            <div className="div">
              <button id="savegame" className="savegame-btn" onClick={() => saveGameInfo()}>
                Save
              </button>
            </div>
            <div className="clues-info">
              <label>Enter clue information</label>
              <div className="scroll-container">
                {fixedCluesSize.map((num) => (
                  <button
                    className={`scroll-item ${numProvidedClues.includes(num) ? "provided" : ""
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
      </div>

      <Link
        to={`/mygame/${gId}/process`}
        onClick={() => handletoProcess()}
        className="nav-btn"
      >
        Next
      </Link>
    </div>
  );
};

export default FirstTab;
