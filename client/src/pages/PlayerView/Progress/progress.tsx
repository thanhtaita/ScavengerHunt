import "./progress.css";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useContext } from "react";
import { AuthContext } from "../../../utils/context";
import { useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { ClueShowInfo } from "../../../utils/types";

const serverUrl = import.meta.env.VITE_SERVER_URL;

interface MyComponentState {
  loading: boolean;
  error: Error | null;
}

const defaultPieData = {
  labels: ["Solved Clues", "Current Clue", "Clues to Solve"],
  datasets: [
    {
      data: [0, 0, 0], // Default values
      backgroundColor: ["#69BF4F", "#FFC36B", "#C2C2C2"],
    },
  ],
};

const Progress = () => {
  const [solvedClues, setSolvedClues] = useState([]);
  const [unsolvedClues, setUnsolvedClues] = useState([]);
  const [totalClues, setTotalClues] = useState(0);
  const [pieData, setPieData] = useState(defaultPieData);

  const { user } = useContext(AuthContext);
  const { gameId } = useParams<{ gameId: string }>();

  const [state, setState] = useState<MyComponentState>({
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) return;
    const uid = user?.email;
    async function fetchData() {
      try {
        const response = await fetch(`${serverUrl}/progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include other headers as required
          },
          body: JSON.stringify({ uid, gameId }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Result", result);

        if (!result) {
          // Check if result is null or undefined
          throw new Error("No result returned from the API");
        }
        const { solvedCluesInfo, unsolvedCluesInfo, total_clues } = result;
        setSolvedClues(solvedCluesInfo);
        setUnsolvedClues(unsolvedCluesInfo);
        if (unsolvedCluesInfo.length === 0) {
          confetti();
        }
        setTotalClues(total_clues);
        console.log(totalClues);

        setState({ loading: false, error: null });
      } catch (error) {
        if (error instanceof Error) {
          setState({ loading: false, error: error });
        }
      } finally {
        if (state.loading) {
          setState((prevState) => ({ ...prevState, loading: false }));
        }
        // setState({ data: null, loading: false, error: new Error('An unknown error occurred') });
      }
    }

    fetchData();
  }, [user, gameId, totalClues, state.loading]);

  useEffect(() => {
    // Move the logic for creating pie data into a function
    const creatingPieData = () => {
      const solvedCount = solvedClues.length;
      const currentCount = unsolvedClues.length;
      const newPieData = {
        labels: ["Solved Clues", "Current Clue"],
        datasets: [
          {
            data: [solvedCount, currentCount],
            backgroundColor: ["#69BF4F", "#FFC36B"],
          },
        ],
      };

      setPieData(newPieData);
    };

    // Call the function when the component mounts or whenever needed
    creatingPieData();
  }, [solvedClues, unsolvedClues]); // Dependency array en

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Error: {state.error.message}</div>;

  return (
    <div className="outsideContainer">
      <p className="progressTitle">Progress</p>
      <div className="progressContainer">
        <div className="clues">
          {/* <div className="currentClue">
                    <p className="currentClues">Current Clue</p>
                        <ul><li>{currentClue}</li></ul>
                    </div> */}
          <div className="solvedClues">
            {unsolvedClues.length === 0 && (
              <p className="solvedTitle">
                🎉 You've completed the game! Congrats! 🏆
              </p>
            )}
            {unsolvedClues.length !== 0 && (
              <div>
                <p className="solvedTitle"> Current Clue(s)</p>
                <ul className="scrollableList">
                  {unsolvedClues.map((clue: ClueShowInfo, index) => (
                    <div className="each-clue">
                      <li key={index}>{clue?.clueText}</li>
                      {clue?.imageURL && (
                        <img src={clue?.imageURL} alt="clue" />
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="solvedClues">
            <p className="solvedTitle"> Solved Clues</p>
            <ul className="scrollableList">
              {solvedClues.map((clue: ClueShowInfo, index) => (
                <div className="each-clue">
                  <li key={index}>{clue?.clueText}</li>
                  {clue?.imageURL && <img src={clue?.imageURL} alt="clue" />}
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div className="pieChart">{pieData && <Pie data={pieData} />}</div>
      </div>
    </div>
  );
};

export default Progress;
