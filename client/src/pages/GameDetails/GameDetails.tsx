import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GameDetails.css";
import Navbar from "../../components/Navbar/Navbar.tsx";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../utils/context";

interface GameDetailsProps {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  clues: number;
}

const serverUrl = import.meta.env.VITE_SERVER_URL;

function GameDetails() {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameDetails, setGameDetails] = useState<GameDetailsProps | null>(null);
  const [gameIdd, setGameId] = useState(0);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleStartGame = async (gameId: number) => {
    if (!user) {
      // Notify the user that they need to be logged in
      window.alert("Please log in to start the game.");
      return;
    }

    const uid = user.email;

    try {
      const response = await fetch(
        `${serverUrl}/startGame?gameId=${gameId}&uid=${uid}`,
        {
          credentials: "include",
        }
      );

      if (response.status === 401) {
        navigate("/authfail");
        return;
      }
      if (!response.ok) {
        window.alert("Error happens. Please try again.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        navigate(`/playerview/${gameId}`);
      } else {
        // Handle any errors or issues reported by the server
        console.error("Error starting the game:", data.message);
        window.alert("Error starting the game. Please try again.");
      }
    } catch (error) {
      console.error("Error making API call:", error);
      window.alert("Error starting the game. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch game details from API
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`${serverUrl}/game/${gameId}`, {
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/authfail");
          return;
        }

        if (!response.ok) {
          window.alert("Error happens. Please try again.");
          return;
        }

        const data = await response.json();
        setGameDetails(data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  return (
    <div className="game-details">
      <Navbar gameId={gameIdd} setGameId={setGameId} />
      
      <div className="game-details-container">
        {gameDetails ? (
          <>
            <div className="gameTitle">
              <h1>{gameDetails.name}</h1>
              <h1>{gameId}</h1>
            </div>
            <div className="content">
              <p className="description">
                Description: {gameDetails.description}
              </p>
              <div className="extraDeets">
                <p>Start Date: {gameDetails.startDate}</p>
                <p>End Date: {gameDetails.endDate}</p>
                <p> Number of Clues: {gameDetails.clues}</p>
              </div>
            </div>
            <button
              className="startgamebutton"
              onClick={() => handleStartGame(gameDetails.id)}
            >
              Join Game
              </button>
              <button
              className="backPage"
              onClick={() => navigate("/MainPage")}
            >
              back
            </button>
          </>
        ) : (
          <p>Loading game details...</p>
          )}
          </div>
    </div>
  );
}

export default GameDetails;
