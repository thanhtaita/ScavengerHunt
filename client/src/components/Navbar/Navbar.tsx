import React from "react";
import "./Navbar.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../utils/context";
import NavBar from "../../components/HamButton/HamButton";

interface NavbarProps {
  gameId: number;
  setGameId: (gameId: number) => void;
}

const serverUrl = "https://jkjk-ui9d.onrender.com";

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
      {loggedIn && <NavBar />}
    </div>
  );
};

export default Navbar;
