import { Link, Outlet } from "react-router-dom";
import Navbar from "../../components/AdminGame/NavBar/NavBar.tsx";
import ProcessBar from "../../components/ProcessBar/ProcessBar.tsx";

import { useState } from "react";
const AdminGame = () => {
  const [step, setStep] = useState(0);
  const [gameName, setGameName] = useState("");
  const [clues, setClues] = useState<Array<string>>([]);
  return (
    <div>
      <Navbar />
      <ProcessBar step={step} />
      <Outlet clues={setClues} gameName={setGameName} />
    </div>
  );
};

export default AdminGame;
