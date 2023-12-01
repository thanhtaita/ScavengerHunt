import { useEffect, useState, useRef } from "react";
import "./Leaderboards.css";
import { useParams } from "react-router-dom";

const serverUrl = import.meta.env.VITE_SERVER_URL;

interface leader {
  ranking: string;
  player_name: string;
  solved_clues: number;
  time: string;
}

const Leaderboards = () => {
  // to get the game id from url
  const { gameId } = useParams();

  console.log("should be the gameid: ", gameId);

  // something to store the data that we get from the backend
  const [data, setData] = useState<Array<leader>>([]);
  const isMounted = useRef(false);

  // everything will be in a useEffect hook:
  useEffect(() => {
    // prevents from rerendering
    if (!isMounted.current) {
      const fetchLeaderboards = async () => {
        // fetch the data from the backend
        const response = await fetch(
          `${serverUrl}/playerview/
    ${gameId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const eachData = await response.json();
        // checking if the data is not empty
        if (eachData.length > 0) {
          // creating a new array to store the data in the format we want
          const newData: Array<leader> = [];

          // looping through the data that we get from the backend
          for (let i = 0; i < eachData.length; i++) {
            let nonNullValues: Array<unknown> = []; // creating array to store all the non null values

            // checking to see if the solved clues array is not empty
            if (eachData[i].solvedclues.length > 0) {
              const solvedCluesArray = JSON.parse(eachData[i]?.solvedclues);
              nonNullValues = solvedCluesArray.filter(
                (value: unknown) => value !== null
              );
            }
            // creating a new object of leader type
            const eachLeader: leader = {
              ranking: eachData[i].points,
              player_name: eachData[i].email,
              solved_clues: nonNullValues.length,
              time: eachData[i].latest_time_date,
            };

            newData.push(eachLeader); // pushing leader object into the array
          }
          newData.sort((a, b) => b.solved_clues - a.solved_clues); // sorting the array in descending order of solved clues
          const firstFiveData: Array<leader> = newData.slice(0, 5); // getting the first five elements of the array
          setData(firstFiveData); // updating the leaderboard
        } else {
          console.log("no data");
        }
      };
      fetchLeaderboards();
    }
    isMounted.current = true;
  }, [gameId]);

  return (
    <div className="leaderboardsContainer">
      <p className="titleOfLeaderBoards">Leaderboards</p>
      <table className="leaderboards">
        <tbody>
          <tr>
            <th>Rankings</th>
            <th>Name of the player</th>
            <th>Clues Solved</th>
            <th>TimeStamp of Last Clue Solved</th>
          </tr>
        </tbody>
        <tbody>
          {data.map((element: leader, index: number) => (
            <tr key={index}>
              <td>{element.ranking}</td>
              <td>{element.player_name}</td>
              <td>{element.solved_clues}</td>
              <td>{element.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboards;
