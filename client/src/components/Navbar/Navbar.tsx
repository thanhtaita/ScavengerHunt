import React from "react";
import "./Navbar.css";
import axios from "axios";
import { AuthContextType } from "../../utils/types.ts";
import { useContext } from "react";
import { AuthContext } from "../../utils/context";

interface NavbarProps {
  gameId: number;
  setGameId: (gameId: number) => void;
}

const serverUrl = "http://localhost:9999";

const Navbar = ({ gameId, setGameId }: NavbarProps) => {
  const { loggedIn, user } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      // Gets authentication url from backend server
      const {
        data: { url },
      } = await axios.get(`${serverUrl}/auth/url`);
      // Navigate to consent screen
      window.location.assign(url);
    } catch (err) {
      console.error(err);
    }
  };
  const handleLogout = async () => {
    if (loggedIn) {
      try {
        await axios.post(`${serverUrl}/auth/logout`);
        window.location.assign("/");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="search">
        <input
          type="number"
          placeholder="Search with Game ID (only number)"
          value={gameId ? gameId : ""}
          onChange={(e) => setGameId(parseInt(e.target.value))}
        />
      </div>
      {!loggedIn && (
        <button className="login" onClick={() => handleLogin()}>
          Login
        </button>
      )}
      {loggedIn && (
        <div>
          <section className="top-nav profile">
            <label className="user-name">Hi, {user?.name}</label>
            <input id="menu-toggle" type="checkbox" />
            <label className="menu-button-container" htmlFor="menu-toggle">
              <div className="menu-button"></div>
            </label>
            <ul className="menu">
              <li onClick={() => window.location.assign("/mygame")}>My Game</li>
              <li onClick={() => window.location.assign("/tutorials")}>
                Tutorials
              </li>
              <li onClick={() => window.location.assign("/settings")}>
                Settings
              </li>
              <li onClick={() => handleLogout()}>Logout</li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default Navbar;
