import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GameDetails.css"
import Navbar from "../../components/Navbar/Navbar.tsx";
import { useNavigate } from "react-router-dom";

interface GameDetailsProps {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    clues: number;
    // Add other fields as necessary
  }

const mockGameDetails=
{
  "id": 10,
  "name": "Mystery of the Lost Pyramid",
  "startDate": "2023-11-01",
  "endDate": "2023-11-10",
  "description": "In the heart of Egypt lies a mystery that has been unsolved for centuries: the Lost Pyramid. Many have tried to uncover its secrets, but none have succeeded. This game will take you on a thrilling adventure through the sands of time. Along the way, you'll encounter challenging puzzles, cryptic clues, and a story that spans millennia. Do you have what it takes to solve the Mystery of the Lost Pyramid? Join the adventure and find out!",
  "clues":10
}


  function GameDetails() {
    const { gameId } = useParams<{ gameId: string }>();
    // const [gameDetails, setGameDetails] = useState<GameDetailsProps | null>(null);
    const [gameDetails, setGameDetails] = useState<GameDetailsProps | null>(mockGameDetails);
    const [gameIdd, setGameId] = useState(0);
  
    // useEffect(() => {
    //   // Fetch game details from your API
    //   const fetchGameDetails = async () => {
    //     try {
    //       const response = await axios.get(`/path-to-your-api/games/${gameId}`);
    //       setGameDetails(response.data);
    //     } catch (error) {
    //       console.error("Failed to fetch game details:", error);
    //     }
    //   };
  
    //   fetchGameDetails();
    // }, [gameId]);
    const navigate = useNavigate();
    const handleStartGame = (gameId: number) => {
      navigate(`/start-game/${gameId}`);
    }
  
    return (
      <>
      <Navbar gameId={gameIdd} setGameId={setGameId} />
      <div className="game-details-container">
        {gameDetails ? (
          <>
            <div className="gameTitle">
              <h1>{gameDetails.name}</h1>
              <h1>{gameId}</h1>
            </div>
            <div className="content">
              <p className="description">Description: {gameDetails.description}</p>
              <div className="extraDeets">
                <p>Start Date: {gameDetails.startDate}</p>
                <p>End Date: {gameDetails.endDate}</p>
                <p>Clues: {gameDetails.clues}</p>
              </div>
            </div>
            <button className={"startgamebutton"} onClick={() => handleStartGame(gameDetails.id)}>Start Game</button>
          </>
        ) : (
          <p>Loading game details...</p>
        )}
      </div>
      </>
    );
  }
  
  export default GameDetails;