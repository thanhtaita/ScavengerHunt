import { useState } from "react";
import "./MainPage.css";
import Navbar from "../../components/Navbar/Navbar.tsx";
import { Leaderboards } from "../../components/Leaderboard/Leaderboards.tsx";
import { GameRow } from "../../utils/types.ts";

const games = [
  {
    id: 1,
    name: "Game A",
    startDate: "2023-10-13",
    clues: 4,
  },

  {
    id: 2,
    name: "Game B",
    startDate: "2023-10-13",
    clues: 2,
  },

  {
    id: 10,
    name: "Game 20",
    startDate: "2023-10-13",
    clues: 10,
  },
  {
    id: 5,
    name: "Game C",
    startDate: "2023-10-13",
    clues: 4,
  },
];

const MainPage = () => {
  const [gameId, setGameId] = useState(0);

  const handleRowClick = (row: GameRow) => {
    // Handle what should happen when a row is clicked
    console.log(`Row clicked: ${row}`);
  };

  return (
    <>
      <Navbar gameId={gameId} setGameId={setGameId} />

      <div className="titleHeader">
        <div className="title">Scavenger Hunt!</div>
        <p className="bio">
          bring the excitement of scavenger hunts into the digital realm.
        </p>
      </div>

      <Leaderboards games={games} gameId={gameId} onClick={handleRowClick} />
    </>
  );
};

export default MainPage;
