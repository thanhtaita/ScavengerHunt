import { useEffect, useState } from "react";
import "./MainPage.css";
import Navbar from "../../components/Navbar/Navbar.tsx";
import { GameList } from "../../components/GameList/GameList.tsx";
import { GameRow } from "../../utils/types.ts";
import { useContext } from "react";
import { AuthContext } from "../../utils/context";
import { useNavigate } from "react-router-dom";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const MainPage = () => {
  const navigate = useNavigate();

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
    if (!user) {
      // Notify the user that they need to be logged in
      window.alert("Please log in to create a game.");
      return;
    }
    const res = await fetch(`${serverUrl}/mygame`, {
      credentials: "include",
    });

    if (res.status === 401) {
      navigate("/authfail");
      return;
    }
    if (!res.ok) {
      window.alert("Error happens. Please try again.");
      return;
    }

    const data = await res.json();
    console.log(data);
    const redirectURL = data.url;

    // if game exists, redirect to game page
    window.location.assign(redirectURL);
  };

  useEffect(() => {
    // Fetch games from API
    console.log(loggedIn);
    console.log("Fetching games...");
    const fetchGames = async () => {
      try {
        const res = await fetch(`${serverUrl}`);
        if (!res.ok) {
          window.alert("Error happens. Please try again.");
          return;
        }
        const data = await res.json();
        console.log(data);
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

      <div className="shade">
        <div className="main-page-content">
          <div className="titleHeader">
            <div className="title">Scavenger Hunt!</div>
            <p className="bio">
              Hey {user?.name || "you"}! Welcome to Scavenger Hunt! Join a game
              or create your own one!
            </p>
          </div>

          <GameList
            games={fetchedGames}
            gameId={gameId}
            onClick={handleRowClick}
          />
          <button className="add-button" onClick={() => handleCreateGame()}>
            Create Game +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
