import { useEffect, useState } from "react";
import { GameRow } from "../../utils/types.ts";
import "./GameList.css";
import { useNavigate } from "react-router-dom";

interface GameListProps {
  games: GameRow[];
  gameId: number;
  onClick: (row: GameRow) => void;
}

export function GameList({ games, gameId }: GameListProps) {
  const [filteredGame, setFilteredGame] = useState<GameRow>();

  useEffect(() => {
    // find the first match game id so it returns only one game
    const temp = games.find((game) => game.id === gameId);
    setFilteredGame(temp);
  }, [gameId]);
  const navigate = useNavigate();
  const handleRowClick = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="gamelist">
      <div className="main-content">
        <table className="tableHeader">
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Clues</th>
            </tr>
          </thead>
          <tbody className="things">
            {gameId ? (
              filteredGame ? (
                <tr className="data-row">
                  <td>{filteredGame.id}</td>
                  <td>{filteredGame.name}</td>
                  <td>{filteredGame.starttime}</td>
                  <td>{filteredGame.endtime}</td>
                  <td>{filteredGame.clues}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4}>No game found</td>
                </tr>
              )
            ) : (
              games.map((game) => (
                <tr key={game.id} onClick={() => handleRowClick(game.id)}>
                  <td>{game.id}</td>
                  <td>{game.name}</td>
                  <td>{game.starttime}</td>
                  <td>{game.endtime}</td>
                  <td>{game.clues}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
