import { useEffect, useState } from "react";
import "./MainPage.css";
import Navbar from "../../components/Navbar/Navbar.tsx";
import { Leaderboards } from "../../components/Gamelist/Gamelist.tsx";
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
  const { user, loggedIn } = useContext(AuthContext);
  const [gameId, setGameId] = useState(0);
  const [fetchedGames, setFetchedGames] = useState<GameRow[]>([]);

  const handleRowClick = (row: GameRow) => {
    // Handle what should happen when a row is clicked
    console.log(`Row clicked: ${row}`);
  };

  const handleCreateGame = async () => {
    // call api to check if the user has a game
    // only allow user to create a game if they don't have one
    const res = await fetch(
      `https://jkjk-ui9d.onrender.com/mygame?email=${user?.email}`
    );
    const data = await res.json();
    console.log(data);
    const redirectURL = data.url;

    // if game exists, redirect to game page
    window.location.assign(redirectURL);
  };

  useEffect(() => {
    // Fetch games from API
    console.log("Fetching games...");
    const fetchGames = async () => {
      try {
        const res = await fetch("https://jkjk-ui9d.onrender.com/");
        const data = await res.json();
        setFetchedGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, [user]);

  return (
    <div className="main-page">
      <Navbar gameId={gameId} setGameId={setGameId} />

      <div className="main-page-content">
        <div className="titleHeader">
          <div className="title">Scavenger Hunt!</div>
          <p className="bio">
            Hey {user?.name || "you"}! Welcome to Scavenger Hunt! Join a game or
            create your own one!
          </p>
        </div>
      </div>

      <Leaderboards
        games={fetchedGames}
        gameId={gameId}
        onClick={handleRowClick}
      />
      <button className="add-button" onClick={() => handleCreateGame()}>
        Create Game +
      </button>
    </div>
  );
};

export default MainPage;
