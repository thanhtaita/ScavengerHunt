import { Outlet, useOutletContext } from "react-router-dom";
import Navbar from "../../components/AdminGame/NavBar/NavBar.tsx";
import ProcessBar from "../../components/ProcessBar/ProcessBar.tsx";
import { AuthContext } from "../../utils/context.ts";
import {} from "react-router-dom";
import "./AdminGame.css";

import { useState, useContext } from "react";

type ContextType = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const AdminGame = () => {
  const { loggedIn } = useContext(AuthContext);
  const [step, setStep] = useState(0);
  console.log(step);

  if (loggedIn === null) return null;
  if (loggedIn === false) window.location.assign("/authfail");

  return (
    <div className="fullPage">
      {loggedIn && (
        <div className="admin-game">
          <Navbar />
          <ProcessBar step={step} />
          <Outlet context={{ step, setStep }} />
        </div>
      )}
    </div>
  );
};

export default AdminGame;

export function GetContext() {
  return useOutletContext<ContextType>();
}
