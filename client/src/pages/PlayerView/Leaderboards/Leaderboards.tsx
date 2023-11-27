import { useEffect, useState, useRef } from "react";
import "../playerView.css";
import { useParams } from "react-router-dom";

const serverUrl = import.meta.env.VITE_SERVER_URL;

interface leader {
  ranking: string;
  player_name: string;
  solved_clues: number;
  time: string;
}

const Leaderboards = () => {
  // will be use to get the user information
  
  // to get the game id from url
  const { gId } = useParams();
  
  // console.log("should be the gameid: ",gId);
  const isMounted = useRef(false);

  // something to store the data that we get from the backend
  const [data, setData] = useState<Array<leader>>([]);

  // everything will be in a useEffect hook:
  useEffect(() => {
    if (!isMounted.current) {
      const fetchLeaderboards = async () => {
        // fetch the data from the backend
        const response = await fetch(`${serverUrl}/playerview/
    ${gId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
        )
        const eachData = await response.json();
        if (eachData.length > 0) {
          const newData: Array<leader> = [];
          for (let i = 0; i < eachData.length; i++) {
            console.log("eachData: ", eachData[i]);
            let nonNullValues: Array<unknown> = [];
            if (eachData[i].solvedclues.length > 0) {
              const solvedCluesArray = JSON.parse(eachData[i]?.solvedclues);
              nonNullValues = solvedCluesArray.filter((value: unknown) => value !== null);
            }
            const eachLeader: leader = {
              ranking: eachData[i].points,
              player_name: eachData[i].email,
              solved_clues: nonNullValues.length,
              time: eachData[i].latest_time_date,
            };
            newData.push(eachLeader);
            }
          setData([...data, ...newData]);
        }
        else {
          console.log("no data");
        }
      }
      fetchLeaderboards();
     
      }
    isMounted.current = true;
  }, []);
  console.log("data: ", data);

  return (
    <div className="leaderboardsContainer">
      <h1>Leaderboards</h1>
      <table id="leaderboards">
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
