import Scan from "../../../components/ScanFolder/ScanFile.tsx";
import { Link, useParams, useOutletContext } from "react-router-dom";

export function Scanning() {
  const [step, setStep] = useOutletContext(); // this is the step number
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
