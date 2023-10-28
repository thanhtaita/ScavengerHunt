import "./ScanQRCode.css";
import { useState } from "react";

const Scan = () => {
  const [clues, setClues] = useState<Array<string>>([
    "Clue 1",
    "Clue 2",
    "Clue 3",
    "Clue 4",
    "Clue 5",
    "Clue 6",
    "Clue 7",
  ]);
  return (
    <div>
      <p className="titlePage2"> Scan The QR Codes </p>
      <p className="bioPage2">
        Scan the QR at the location that you what to place it
      </p>
      <div className="listOfQR2">
        <ul className="allOfClues2">
          {clues.map((clue: string, index: number) => (
            <button className="QRCodes2" key={index}>
              {clue}
            </button>
          ))}
        </ul>
      </div>
      <div className="footer2">
        <button
          className="backButton2"
          onClick={() => window.location.assign("/process")}
        >
          back
        </button>
        <button
          className="Create2"
          onClick={() => window.location.assign("/scanQRCode")}
        >
          Create Game
        </button>
      </div>
    </div>
  );
};

export default Scan;
