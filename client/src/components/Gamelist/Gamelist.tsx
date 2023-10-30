import { useEffect, useState } from "react";
import { GameRow } from "../../utils/types.ts";
import "./Gamelist.css";

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

  return (
    <div className="container">
      <div className="main-content">
        <table>
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>Clues</th>
            </tr>
          </thead>
          <tbody>
            {gameId ? (
              filteredGame ? (
                <tr>
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
                <tr>
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
