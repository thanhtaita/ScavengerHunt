import React from "react";
import { useState } from "react";
import Progress from "./pages/PlayerView/progress";
import Leaderboards from "./pages/PlayerView/Leaderboards";
import Scan from "./pages/PlayerView/Scan";
import "./pages/PlayerView/playerView.css";



const Navbar = () => {
    const [basicActive, setBasicActive] = useState("Home");

    const [navTabToggle, setNavTab] = useState(false);

    return (
        <div>

            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Scavenger Hunt</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" onClick={() => { setNavTab(true), console.log("klklkl", navTabToggle) }} data-target="#navbarsExample03" aria-controls="navbarsExample03" aria-expanded={navTabToggle} aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarsExample03">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" onClick={() => { setBasicActive("Home"), setNavTab(false) }} href="#">
                                Progress
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => { setBasicActive("Leaderboard"), setNavTab(true), console.log("klklkl", navTabToggle) }} href="#">
                                Leaderboad
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => { setBasicActive("Scan"), setNavTab(true) }} href="#">
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