import "./ProcessPage.css";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

const Process = () => {
  const [step, setStep] = useOutletContext();
  const [clues, setClues] = useState<Array<string>>([
    "Clue 1",
    "Clue 2",
    "Clue 3",
    "Clue 4",
    "Clue 5",
    "Clue 6 ",
    "Clue 7",
  ]);
  return (
    <>
      <div className="Header">
        <button className="fillLater">fill later</button>
        <p className="titlePage">Print The QR Codes</p>
        <p className="bioPage">
          click the PrintQR Code button to generate a PDF of all the QR
        </p>
      </div>
      <div className="listOfQR">
        <ul className="allOfClues">
          {clues.map((clue: string, index: number) => (
            <li className="QRCodes" key={index}>
              {clue}
            </li>
          ))}
        </ul>
      </div>

      <div className="footer">
        <Link
          to="/mygame"
          className="nav-btn"
          onClick={() => setStep(step - 1)}
        >
          Back
        </Link>
        <button className="PrintQR">Print QR Code</button>
        <Link
          to="/mygame/scanQRCode"
          className="nav-btn"
          onClick={() => setStep(step + 1)}
        >
          next
        </Link>
      </div>
    </>
  );
};

export default Process;
