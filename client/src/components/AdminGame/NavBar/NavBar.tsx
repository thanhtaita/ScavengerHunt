import "./NavBar.css";
import HamButton from "../../HamButton/HamButton";
const NavBar = () => {
  return (
    <div className="nav-bar">
      <button className="nav-btn">Cancel</button>
      <h2 className="title">Admin's View</h2>
      <HamButton />
    </div>
  );
};

export default NavBar;
