import { useEffect, useState } from "react";
import { GameRow } from "../../utils/types.ts";
import "./Gamelist.css";
import { useNavigate } from "react-router-dom";

interface LeaderboardsProps {
  games: GameRow[];
  gameId: number;
  onClick: (row: GameRow) => void;
}

export function Leaderboards({ games, gameId }: LeaderboardsProps) {
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
              <th>Start Date</th>
              <th>Clues</th>
            </tr>
          </thead>
          <tbody className="things">
            {gameId ? (
              filteredGame ? (
                <tr className="data-row">
                  <td>{filteredGame.id}</td>
                  <td>{filteredGame.name}</td>
                  <td>{filteredGame.startDate}</td>
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
                  <td>{game.startDate}</td>
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
