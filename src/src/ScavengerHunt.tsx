import { useState, ChangeEvent } from "react";
import "./ScavengerHunt.css";
import { Navbar } from "./components/Navbar.tsx";
import { Leaderboards } from "./components/Leaderboards.tsx";
import { GameRow } from "./utils/types.ts";

function ScavengerHunt() {
  const [gameId, setGameId] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGameId(event.target.value);
  };

  const handleRowClick = (row: GameRow) => {
    // Handle what should happen when a row is clicked
    console.log(`Row clicked: ${row}`);
  };
  const gameA: GameRow = {
    id: 1,
    name: "Game A",
    startDate: "2023-10-13",
    clues: 4,
  };

  return (
    <>
      <Navbar gameId={gameId} handleSearchChange={handleSearchChange} />

      <div className="titleHeader">
        <div className="title">Welcome to Scavenger Hunt!</div>
        <p className="bio">
          a web application crafted to bring the excitement of scavenger hunts
          into the digital realm. Our mission is to offer users an immersive and
          interactive experience suitable for individuals, families, and groups
          of all sizes. In general, our web app serves as your premier
          destination for crafting and engaging in captivating scavenger hunts.
        </p>
      </div>

      <Leaderboards gameA={gameA} handleRowClick={handleRowClick} />
    </>
  );
}

export default ScavengerHunt;
