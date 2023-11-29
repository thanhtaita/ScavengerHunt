import { useState } from "react";
import Progress from "./Progress/progress";
import Leaderboards from "./Leaderboards/Leaderboards";
import Scan from "./Scan/Scan";
import "./playerView.css";
import { useParams } from "react-router-dom";

const Navbar = () => {
  const [basicActive, setBasicActive] = useState("Home");
  const { gameId } = useParams();
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="collapse navbar-collapse" id="navbarsExample03">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <button
                className="previous-button"
                onClick={() => {
                  window.location.assign(`/game/${gameId}`);
                }}
              >
                Back
              </button>
            </li>
            <li className="nav-item active">
              <a
                className="nav-link"
                onClick={() => {
                  setBasicActive("Home");
                }}
                href="#"
              >
                Progress
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => {
                  setBasicActive("Leaderboard");
                }}
                href="#"
              >
                Leaderboad
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => {
                  setBasicActive("Scan");
                }}
                href="#"
              >
                Scan
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {basicActive === "Home" && <Progress />}
      {basicActive === "Leaderboard" && <Leaderboards />}
      {basicActive === "Scan" && <Scan />}
    </div>
  );
};

export default Navbar;