import React from "react";
import { useState } from "react";
import Progress from "./pages/PlayerView/progress";
import Leaderboards from "./pages/PlayerView/Leaderboards";
import Scan from "./pages/PlayerView/Scan";
import "./pages/PlayerView/playerView.css";



const Navbar = () => {
    // const { loggedIn, user } = useContext(AuthContext);
    let items = ["Home", "Product", "Service"];
    const [basicActive, setBasicActive] = useState(items[0]);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">
                    Scavenger Hunt
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item active" >
                            <a className="nav-link" onClick={() => setBasicActive("Home")} href="#">
                                Progress <span className="sr-only">(current)</span>

                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => setBasicActive("Leaderboard")} href="#">
                                Leaderboad
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => setBasicActive("Scan")} href="#">
                                Scan
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            {basicActive === 'Home' && <Progress />}
            {basicActive === 'Leaderboard' && <Leaderboards />}
            {basicActive === 'Scan' && <Scan />}


        </div>
    );
};

export default Navbar;