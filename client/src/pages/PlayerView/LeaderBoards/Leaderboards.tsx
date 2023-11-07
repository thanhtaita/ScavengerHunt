import "./leaderboards.css";
interface leader {
  ranking: string;
  player_name: string;
  solved_clues: number;
  time: string;
}

const Leaderboards = () => {
  // this is dummy data
  const leaderboards: Array<leader> = [
    {
      ranking: "1",
      player_name: "Ali",
      solved_clues: 4,
      time: "10/29/23 08:45pm",
    },
    {
      ranking: "2",
      player_name: "Tai",
      solved_clues: 4,
      time: "10/29/23 08:46pm",
    },
    {
      ranking: "3",
      player_name: "Vishal",
      solved_clues: 4,
      time: "10/29/23 08:47pm",
    },
    {
      ranking: "4",
      player_name: "Hema",
      solved_clues: 3,
      time: "10/29/23 08:50pm",
    },
  ];

  return (
    <div className="leaderboardsContainer">
      <p className="leaderboards-title">Current Leaderboards</p>
      <table className="leaderboards-table">
        <tr className="first-row-table">
          <th>Rankings</th>
          <th>Name of the player</th>
          <th>Clues Solved</th>
          <th>TimeStamp of Last Clue Solved</th>
        </tr>
        {leaderboards.map((element: leader) => (
          <tr className="data-rows">
            <td>{element.ranking}</td>
            <td>{element.player_name}</td>
            <td>{element.solved_clues}</td>
            <td>{element.time}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Leaderboards;
