import { useRef, useState, useEffect } from "react";
// import { OverlayEventDetail } from "@ionic/core";
import QrScanner from "qr-scanner";
import { useParams } from "react-router-dom";
import { ClueInfo } from "../../utils/types";
const serverUrl = import.meta.env.VITE_SERVER_URL;
import "./ScanFile.css";
const ScanQR = () => {
  const { gId } = useParams();
  let counter = 0;
  const video = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner>();
  const [redirect, setRedirect] = useState(false);
  const [clues, setclues] = useState<Array<ClueInfo>>([]);
  const [scanCode, setScanCode] = useState({ QrText: "", location: "" });
  const [scanResults, setScanResults] = useState("");
  console.log(gId);

  const updateLocation = async (currentClueNum: number, qrText: string) => {
    const tempClues = clues.map((clue) => {
      if (clue.QR_text === qrText) {
        clue.location = scanCode.location;
      }
      return clue;
    });
    console.log(tempClues, currentClueNum, gId);

    fetch(`${serverUrl}/mygame/${gId}/${currentClueNum}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempClues),
    })
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setRedirect(true);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    if (redirect) {
      window.location.assign(`/mygame/${gId}/ScanQRCode`);
      // navigate(`/mygame/${gId}/ScanQRCode`);
    }
  }, [redirect]);

  const fectGameDeatils = async () => {
    try {
      const res = await fetch(`${serverUrl}/mygame/${gId}`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data["hints"], data);
      setclues(data["hints"]);
    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };
  const getLocation = () => {
    alert("Are you sure you want to enter this location?");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(
            `{"Latitude": "${latitude}", "Longitude": "${longitude}"}`,
            scanResults,
            scanCode
          );
          // setScanCode((prev) => {
          //   const data = prev;
          //   data.location = `{"Latitude": "${latitude}", "Longitude": "${longitude}"}`
          //   return data
          // })
          setScanCode({
            QrText: scanCode.QrText,
            location: `{"Latitude": "${latitude}", "Longitude": "${longitude}"}`,
          });
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  };
  useEffect(() => {
    console.log(scanCode);
    if (scanCode.location !== "") {
      updateLocation(0, scanCode.QrText);
    }
  }, [scanCode]);

  useEffect(() => {
    console.log(clues);
  }, [clues]);

  useEffect(() => {
    console.log(scanCode);
    fectGameDeatils();
  }, []);

  function handleScan(result: QrScanner.ScanResult) {
    console.log(counter);
    counter = counter + 1;
    if (counter === 1) {
      const res = result.data;
      console.log(res);
      setScanResults(res);
      // setScanCode({ "QrText": res, "location": scanCode.QrText })

      setScanCode((prev) => {
        const data = prev;
        data.QrText = res;
        return data;
      });
      // qrScanner?.destroy();
      getLocation();
      qrScanner?.destroy();
    }
  }
  // Function to stop the webcam

  useEffect(() => {
    if (video.current) {
      const qrScanner = new QrScanner(
        video.current,
        (result) => {
          handleScan(result);
        },
        {
          highlightScanRegion: true,
        }
      );
      qrScanner.start();
      setQrScanner(qrScanner);
    }
  }, [video.current]);

  return (
    <div className="div">
      {scanCode?.QrText !== "" && (
        <h1 className="scanfile">
          <p>
            {" "}
            Loading please wait fetching your location.....
            <br></br>
            <br></br>
            <br></br>
            Do not close the screen
          </p>
        </h1>
      )}
      {scanCode?.QrText === "" && (
        <div>
          <video ref={video}></video>
        </div>
      )}
    </div>
  );
};

export default ScanQR;
