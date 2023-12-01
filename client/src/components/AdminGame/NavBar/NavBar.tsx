import "./NavBar.css";
import HamButton from "../../HamButton/HamButton";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <div className="nav-bar">
      <Link to="/MainPage" className="nav-btn2">
        Cancel
      </Link>
      <h2 className="title">Admin's View</h2>
      <HamButton />
    </div>
  );
};

export default NavBar;
