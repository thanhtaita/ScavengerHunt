import "./ProcessPage.css";
import { useState } from "react";

const Process = () => {
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
        <button
          className="backButton"
          onClick={() => window.location.assign("/mygame")}
        >
          back
        </button>
        <button className="PrintQR">Print QR Code</button>
        <button
          className="nextButton"
          onClick={() => window.location.assign("/scanQRCode")}
        >
          next
        </button>
      </div>
    </>
  );
};

export default Process;
