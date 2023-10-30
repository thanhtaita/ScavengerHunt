import { useEffect, useState } from "react";
import "./MainPage.css";
import Navbar from "../../components/Navbar/Navbar.tsx";
import { Leaderboards } from "../../components/Leaderboard/Leaderboards.tsx";
import { GameRow } from "../../utils/types.ts";
import { useContext } from "react";
import { AuthContext } from "../../utils/context";

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
  const { user } = useContext(AuthContext);

  const [gameId, setGameId] = useState(0);

  const handleRowClick = (row: GameRow) => {
    // Handle what should happen when a row is clicked
    console.log(`Row clicked: ${row}`);
  };

  useEffect(() => {
    // Fetch games from API
    console.log("Fetching games...");
    const fetchGames = async () => {
      const res = await fetch("http://localhost:9999/");
      const data = await res.json();
      console.log(data);
    };
    fetchGames();
  }, []);

  return (
    <>
      <Navbar gameId={gameId} setGameId={setGameId} />

      <div className="titleHeader">
        <div className="title">Scavenger Hunt!</div>
        <p className="bio">
          Hey {user?.name || "you"}! Welcome to Scavenger Hunt! Join a game or
          create your own one!
        </p>
      </div>

      <Leaderboards games={games} gameId={gameId} onClick={handleRowClick} />
      <button className="add-button">Create Game +</button>
    </>
  );
};

export default MainPage;
