import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface GameDetailsProps {
    id: number;
    name: string;
    startDate: string;
    clues: string;
    description: string;
    // Add other fields as necessary
  }

const mockGameDetails=
{
  "id": 10,
  "name": "Mystery of the Lost Pyramid",
  "startDate": "2023-11-01",
  "clues": "Follow the ancient hieroglyphs to uncover the secrets.",
  "description": "In the heart of Egypt lies a mystery that has been unsolved for centuries: the Lost Pyramid. Many have tried to uncover its secrets, but none have succeeded. This game will take you on a thrilling adventure through the sands of time. Along the way, you'll encounter challenging puzzles, cryptic clues, and a story that spans millennia. Do you have what it takes to solve the Mystery of the Lost Pyramid? Join the adventure and find out!"
}


  function GameDetails() {
    const { gameId } = useParams<{ gameId: string }>();
    // const [gameDetails, setGameDetails] = useState<GameDetailsProps | null>(null);
    const [gameDetails, setGameDetails] = useState<GameDetailsProps | null>(mockGameDetails);

  
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
  
    return (
      <div className="game-details-container">
        {gameDetails ? (
          <>
            <h2>{gameDetails.name}</h2>
            <h2>{gameId}</h2>
            <p>Start Date: {gameDetails.startDate}</p>
            <p>Clues: {gameDetails.clues}</p>
            <p>Description: {gameDetails.description}</p>
            {/* Display other fields as necessary */}
          </>
        ) : (
          <p>Loading game details...</p>
        )}
      </div>
    );
  }
  
  export default GameDetails;