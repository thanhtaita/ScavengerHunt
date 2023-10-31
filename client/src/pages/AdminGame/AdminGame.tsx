import { Link, Outlet } from "react-router-dom";
import Navbar from "../../components/AdminGame/NavBar/NavBar.tsx";
import ProcessBar from "../../components/ProcessBar/ProcessBar.tsx";
import { AuthContext } from "../../utils/context.ts";

import { useState, useContext, useEffect } from "react";

const AdminGame = () => {
  const { loggedIn } = useContext(AuthContext);
  const [step, setStep] = useState(0);

  if (loggedIn === null) return null;
  if (loggedIn === false) window.location.assign("/authfail");

  return (
    loggedIn && (
      <div>
        <Navbar />
        <ProcessBar step={step} />
        <Outlet context={[step, setStep]} />
      </div>
    )
  );
};

export default AdminGame;
