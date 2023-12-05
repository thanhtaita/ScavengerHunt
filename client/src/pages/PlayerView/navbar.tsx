import { useState } from "react";
import Progress from "./Progress/progress";
import Leaderboards from "./Leaderboards/Leaderboards";
import Map from "../../components/Map/Map";
import Scan from "./Scan/Scan";
import "./playerView.css";
import { useParams } from "react-router-dom";

const Navbar = () => {
  const [basicActive, setBasicActive] = useState("Home");
  const { gameId } = useParams();
  const gId = parseInt(gameId || "", 10);

  return (
    <div className="progress-mainpage">
      <nav className="navbar-player">
        <div className="navbar-whole">
          <ul className="navbar-nav">
            <li className="nav-item1">
              <button
                className="previous-button"
                onClick={() => {
                  window.location.assign(`/game/${gId}`);
                }}
              >
                Exit Game
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
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => {
                  setBasicActive("Map");
                }}
                href="#"
              >
                Map
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="tab">
        {basicActive === "Home" && <Progress />}
        {basicActive === "Leaderboard" && <Leaderboards />}
        {basicActive === "Scan" && <Scan />}
        {basicActive === "Map" && <Map gId={gId} />}
      </div>
    </div>
  );
};

export default Navbar;
