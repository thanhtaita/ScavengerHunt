import "./ScanQRCode.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GetContext } from "../AdminGame";
import { ClueInfo } from "../../../utils/types";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const Scan = () => {
  const { gId } = useParams();
  console.log(gId);
  const { step, setStep } = GetContext();
  const [clues, setclues] = useState<Array<ClueInfo>>([]);
  const [, setDisabled] = useState<Array<boolean>>(
    Array.from({ length: clues.length }, () => false)
  );
  // To fix the issue, wrap the boolean value in an array and set it to the corresponding index of the `disabled` state array
  const fectGameDeatils = async () => {
    const url = "http://localhost:9999/mygame/" + gId
    console.log(
      url
    )

    try {
      const res = await fetch(`${serverUrl}/mygame/${gId}`);
      const data = await res.json();
      console.log(data["hints"], data); setclues(data["hints"])
    } catch (error) {
      console.error("Error fetching game:", error);
    }


  }

  useEffect(() => {
    fectGameDeatils()

  }, [])

  return (
    <div>
      <p className="titlePage2"> Scan The QR Codes </p>
      <p className="bioPage2">
        Scan the QR at the location that you what to place it
      </p>
      <div className="listOfQR2">
        <ul className="allOfClues2">
          {clues.map((clue) => (
            <Link
              to={`/mygame/${gId}/scanQR`}
              className="QRCodes2"
              key={clue.clueID}
            >
              Clue {clue.clueID}
            </Link>
          ))}
        </ul>
      </div>
      <div className="footer2">
        <Link
          to={`/mygame/${gId}/process`}
          className="nav-btn"
          onClick={() => setStep(step - 1)}
        >
          Back
        </Link>
        <Link to="/MainPage" className="nav-btn">
          Create Game
        </Link>
      </div>
    </div>
  );
};

export default Scan;
