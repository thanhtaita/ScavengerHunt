import "./NavBar.css";
import HamButton from "../../HamButton/HamButton";
const NavBar = () => {
  return (
    <div className="nav-bar">
      <button>Cancel</button>
      <h2 className="title">Admin View</h2>
      <HamButton />
    </div>
  );
};

export default NavBar;
