import Scan from "../../../components/ScanFolder/ScanFile.tsx";
import { Link } from "react-router-dom";

export function Scanning() {
  return (
    <div>
      <Scan />;
      <Link to="/mygame/scanQRcode" className="nav-btn">
        Back
      </Link>
    </div>
  );
}
