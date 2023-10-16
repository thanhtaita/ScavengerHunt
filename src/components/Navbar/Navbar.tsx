import React from "react";
import "./Navbar.css";

interface NavbarProps {
  gameId: number;
  setGameId: (gameId: number) => void;
}

const Navbar = ({ gameId, setGameId }: NavbarProps) => {
  const loginPage = () => {
    // TODO: will change the page of user to login
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
      <button className="login" onClick={() => loginPage()}>
        Login
      </button>
    </div>
  );
};

export default Navbar;
