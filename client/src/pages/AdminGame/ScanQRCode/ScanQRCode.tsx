import "./ScanQRCode.css";
import { useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

const Scan = () => {
  const { gId } = useParams();
  console.log(gId);
  const [step, setStep] = useOutletContext();
  const [clues, setClues] = useState<Array<string>>([
    "Clue 1",
    "Clue 2",
    "Clue 3",
    "Clue 4",
    "Clue 5",
    "Clue 6",
    "Clue 7",
  ]);
  const [disabled, setDisabled] = useState<Array<boolean>>(
    Array.from({ length: clues.length }, () => false)
  );
  // To fix the issue, wrap the boolean value in an array and set it to the corresponding index of the `disabled` state array

  const locationOnClick = (index: number) => {
    alert("Are you sure you want to enter this location?");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        }
      );
      const getelement = document.getElementsByClassName("QRCodes2")[
        index
      ] as HTMLButtonElement;
      getelement.innerHTML = `QR Code ${index + 1} Location Entered`;
      setDisabled((prevDisabled) => {
        const newDisabled = [...prevDisabled];
        newDisabled[index] = true;
        return newDisabled;
      });
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
            <Link
              to={`/mygame/${gId}/scanQRcode`}
              className="QRCodes2"
              key={index}
              onClick={() => locationOnClick(index)}
              disabled={disabled[index]}
            >
              {clue}
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
        <Link to="/" className="nav-btn">
          Create Game
        </Link>
      </div>
    </div>
  );
};

export default Scan;
