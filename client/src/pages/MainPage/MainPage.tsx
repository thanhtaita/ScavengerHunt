import { useEffect, useState } from "react";
import "./MainPage.css";
import Navbar from "../../components/Navbar/Navbar.tsx";
import { Leaderboards } from "../../components/Gamelist/Gamelist.tsx";
import { GameRow } from "../../utils/types.ts";
import { useContext } from "react";
import { AuthContext } from "../../utils/context";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const MainPage = () => {
  const { user } = useContext(AuthContext);
  const [gameId, setGameId] = useState(0);
  const [fetchedGames, setFetchedGames] = useState<GameRow[]>([]);

  const handleRowClick = (row: GameRow) => {
    // Handle what should happen when a row is clicked
    console.log(`Row clicked: ${row}`);
  };

  const handleCreateGame = async () => {
    // call api to check if the user has a game
    // only allow user to create a game if they don't have one
    if (!user) {
      // Notify the user that they need to be logged in
      window.alert("Please log in to create a game.");
      return;
    }
    const res = await fetch(`${serverUrl}/mygame?email=${user?.email}`);
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
        const res = await fetch(`${serverUrl}/`);
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
          <div className="title">New Scavenger Hunt!</div>
          <p className="bio">
            Hey {user?.name || "you"}! Welcome to Scavenger Hunt! Join a game or
            create your own one!
          </p>
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
    </div>
  );
};

export default MainPage;
