import React from "react";
import "./Navbar.css";
import axios from "axios";
import { AuthContextType } from "../../utils/types.ts";
import { useContext } from "react";

interface NavbarProps {
  gameId: number;
  setGameId: (gameId: number) => void;
  authorContext: React.Context<AuthContextType>;
}

const serverUrl = "http://localhost:5000";

const Navbar = ({ gameId, setGameId, authorContext }: NavbarProps) => {
  const { loggedIn, checkLoginState } = useContext(authorContext);

  const handleLogInNOut = async () => {
    if (loggedIn) {
      try {
        await axios.post(`${serverUrl}/auth/logout`);
        // Check login state again
        checkLoginState();
        window.location.assign("/");
      } catch (err) {
        console.error(err);
      }
    } else {
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
      <button className="login" onClick={() => handleLogInNOut()}>
        {loggedIn ? "Logout" : "Login"}
      </button>
    </div>
  );
};

export default Navbar;
