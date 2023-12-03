import { AuthContext } from "../../utils/context";
import { useContext } from "react";
import axios from "axios";
import "./HamButton.css";
import { useNavigate } from "react-router-dom";

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Ensures cookie is sent
axios.defaults.withCredentials = true;

const HamButton = () => {
  const navigate = useNavigate();
  const { user, loggedIn } = useContext(AuthContext);
  const handleLogout = async () => {
    if (loggedIn) {
      try {
        await fetch(`${serverUrl}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleMyGame = async () => {
    const res = await fetch(`${serverUrl}/mygame`, {
      credentials: "include",
    });
    if (res.status === 401) {
      navigate("/authfail");
      return;
    }
    if (!res.ok) {
      window.alert("Error happens. Please try again.");
      return;
    }
    const data = await res.json();
    console.log(data);
    const redirectURL = data.url;
    window.location.assign(redirectURL);
  };
  return (
    <div>
      <section className="top-nav profile">
        <label className="user-name">Hi, {user?.name}</label>
        <input id="menu-toggle" type="checkbox" />
        <label className="menu-button-container" htmlFor="menu-toggle">
          <div className="menu-button"></div>
        </label>
        <ul className="menu">
          <li onClick={() => handleMyGame()}>My Game</li>
          <li onClick={() => window.location.assign("/tutorials")}>
            Tutorials
          </li>
          <li onClick={() => window.location.assign("/settings")}>Settings</li>
          <li onClick={() => handleLogout()}>Logout</li>
        </ul>
      </section>
    </div>
  );
};
export default HamButton;
