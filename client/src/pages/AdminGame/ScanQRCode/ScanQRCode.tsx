import "./ScanQRCode.css";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
interface clues {
  "clueID": number,
  "QR_text": string,
  "clueText": string,
  "imageURL": string,
  "location": string
}
const Scan = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const gameId = queryParameters.get("gameId")
  const [step, setStep] = useOutletContext();
  const [clues, setclues] = useState<Array<clues>>([]);

  const fectGameDeatils = async () => {

    await fetch("http://localhost:9999/adminGetgameDetails", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "gid": 2
      })
    }).then(response => response.text())
      .then(result => { console.log("result: ", JSON.parse(result)[0]["hints"]), setclues(JSON.parse(result)[0]["hints"]) })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    fectGameDeatils()
    // setclues([1, 2, 3])
  }, [])
  const [disabled, setDisabled] = useState<Array<boolean>>(
    Array.from({ length: clues.length }, () => false)
  );
  // To fix the issue, wrap the boolean value in an array and set it to the corresponding index of the `disabled` state array

  const locationOnClick = (index: number) => {

    alert("Are you sure you want to enter this location?");
    if (navigator.geolocation) {
      let latitude: string = "";
      let longitude: string = "";
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          latitude = position.coords.latitude.toString();
          longitude = position.coords.longitude.toString();
          console.log("Latitude: ${latitude}, Longitude: ${longitude}", latitude, longitude);
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
      window.location.assign("/scanQr?gameId=2&latitude=" + clues.toString());
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
          {clues.map((clue: clues, index: number) => (
            <button
              className="QRCodes2"
              key={index}
              onClick={() => locationOnClick(index)}
              disabled={disabled[index]}
            >
              {clue.clueText}
            </button>
          ))}
        </ul>
      </div>
      <div className="footer2">
        <Link
          to="/mygame/process"
          className="nav-btn"
          onClick={() => setStep(step - 1)}
        >
          Back
        </Link>
        <Link to="/mygame" className="nav-btn">
          Create Game
        </Link>
      </div>
    </div>
  );
};

export default Scan;
