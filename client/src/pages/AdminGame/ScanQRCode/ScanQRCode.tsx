import "./ScanQRCode.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Scan from "../../../components/ScanFolder/ScanFile";
import { Scanning } from "./ScanningQR";

const ScanQR = () => {
  const [clues, setClues] = useState<Array<string>>([
    "Clue 1",
    "Clue 2",
    "Clue 3",
    "Clue 4",
    "Clue 5",
    "Clue 6",
    "Clue 7",
  ]);
  const [disabled, setDisabled] = useState<Array<boolean>>([]);

  const locationOnClick = (index: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        }
      );
      const getelement = document.getElementsByClassName("")[
        index
      ] as HTMLButtonElement;
      getelement.innerHTML = `QR Code ${index + 1} Location Entered`;
      setDisabled((prevDisabled) => {
        const newDisabled = [...prevDisabled];
        newDisabled[index] = true;
        return newDisabled;
      });
      // return <Scanning />;
    } else {
      console.log("Geolocation not supported");
    }
  };

  return (
    <div>
      <p className="titlePage2"> Scan The QR Codes </p>
      <p className="bioPage2">
        Scan the QR at the location that you what to place it
      </p>
      <div className="listOfQR2">
        <ul className="allOfClues2">
          {clues.map((clue: string, index: number) => (
            <button
              className="QRCodes2"
              key={index}
              onClick={() => locationOnClick(index)}
              disabled={disabled[index]}
            >
              {clue}
            </button>
          ))}
        </ul>
      </div>
      <div className="footer2">
        <Link to="/mygame/process" className="nav-btn">
          Back
        </Link>
        <Link to="/mygame" className="nav-btn">
          Create Game
        </Link>
      </div>
    </div>
  );
};

export default ScanQR;
