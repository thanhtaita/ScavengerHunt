import { AuthContext } from "../../utils/context";
import { useContext } from "react";
import axios from "axios";
import "./HamButton.css";

const serverUrl = "http://localhost:9999";
const HamButton = () => {
  const { user, loggedIn } = useContext(AuthContext);
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
          <li onClick={() => window.location.assign("/settings")}>Settings</li>
          <li onClick={() => handleLogout()}>Logout</li>
        </ul>
      </section>
    </div>
  );
};
export default HamButton;
