import Scan from "../../../components/ScanFolder/ScanFile.tsx";
import { Link, useParams } from "react-router-dom";
import { GetContext } from "../AdminGame.tsx";

export function Scanning() {
  const { step, setStep } = GetContext(); // this is the step number
  const { gId } = useParams();

  return (
    <div>
      <Scan />;
      <Link
        to={`/mygame/${gId}/scanQRcode`}
        className="nav-btn"
        onClick={() => {
          setStep(step - 1);
        }}
      >
        Back
      </Link>
    </div>
  );
}
