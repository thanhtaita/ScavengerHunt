import { GameRow } from "../utils/types.ts";

export function Leaderboards(props: {
  gameA: GameRow;
  handleRowClick: (row: GameRow) => void;
}) {
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
            {/* Example rows - you can replace this with data from your backend */}
            <tr onClick={() => props.handleRowClick(props.gameA)}>
              <td>{props.gameA.id}</td>
              <td>{props.gameA.name}</td>
              <td>{props.gameA.startDate}</td>
              <td>{props.gameA.clues}</td>
            </tr>
            <tr onClick={() => props.handleRowClick(props.gameA)}>
              <td>{props.gameA.id}</td>
              <td>{props.gameA.name}</td>
              <td>{props.gameA.startDate}</td>
              <td>{props.gameA.clues}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="add-button">Create Game +</button>
    </div>
  );
}
