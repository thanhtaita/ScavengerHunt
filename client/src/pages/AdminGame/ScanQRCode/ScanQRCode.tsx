import "./ScanQRCode.css";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GetContext } from "../AdminGame";

import { ClueInfo, GameInfo } from "../../../utils/types";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const Scan = () => {
  const navigate = useNavigate();
  const { gId } = useParams();
  console.log(gId);
  const { step, setStep } = GetContext();
  const [clues, setclues] = useState<Array<ClueInfo>>([]);
  const [gameInfo, setGameInfo] = useState<GameInfo>();

  // To fix the issue, wrap the boolean value in an array and set it to the corresponding index of the `disabled` state array
  const fectGameDeatils = async () => {
    try {
      const res = await fetch(`${serverUrl}/mygame/${gId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/authfail");
        return;
      }
      const data = await res.json();
      console.log("data", data);
      setGameInfo(data);
      setclues(data["hints"]);
    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };

  useEffect(() => {
    fectGameDeatils();
  }, []);

  const handlePublished = async () => {
    console.log("handling published");
    try {
      await fetch(
        `${serverUrl}/mygame/${gId}?published=${!gameInfo?.published}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      window.location.assign("/MainPage");
    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };

  return (
    <div className="scanQRCode">
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
              Clue {clue.clueID}{" "}
              {clue.location !== "" && (
                <i className="fas fa-map-marker-alt font-size:36px"></i>
              )}
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
        <button className="nav-btn" onClick={handlePublished}>
          {gameInfo?.published ? "Hide Game" : "Launch Game"}
        </button>
      </div>
    </div>
  );
};

export default Scan;
