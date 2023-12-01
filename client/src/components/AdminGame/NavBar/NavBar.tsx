import "./NavBar.css";
import HamButton from "../../HamButton/HamButton";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <div className="admin-nav-bar">
      <Link to="/MainPage" className="nav-btn2">
        Cancel
      </Link>
      <h2 className="title1">ADMIN'S VIEW</h2>
      <HamButton />
    </div>
  );
};

export default NavBar;
