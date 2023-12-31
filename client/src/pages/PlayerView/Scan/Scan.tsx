import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { OverlayEventDetail } from '@ionic/core';
import QrScanner from "qr-scanner";
import "./Scan.css";
import { useContext } from "react";
import { AuthContext } from "../../../utils/context";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const Scan = () => {
  const { user } = useContext(AuthContext);
  let counter = 0;

  const { gameId } = useParams<{ gameId: string }>();
  // const modal = useRef<HTMLIonModalElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner>();
  const [scanCode, setScanCode] = useState("");

  // function onDissMiss(_event: CustomEvent<OverlayEventDetail>) {
  //     close();
  // }

  async function handleScan(result: QrScanner.ScanResult) {
    counter = counter + 1;
    console.log(counter);
    //Logic with scanned qr code
    setScanCode(result.data);
    console.log(result.data);
    console.log("Handling Scan...");
    qrScanner?.destroy();

    if (user && counter === 1) {
      const uid = user.email;
      try {
        const response = await fetch(`${serverUrl}/verifyQR`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid,
            result: result.data,
            gameId: gameId,
          }),
        });

        if (response.status === 401) {
          // navigate("/authfail");
          return;
        }
        if (!response.ok) {
          window.alert("Error happens. Please try again.");
          return;
        }

        const data = await response.json();

        if (data.success) {
          console.log("API call was successful");

          window.alert(
            "QR verification was successful! The progress page should reflect the same"
          );
        } else {
          console.log("API call failed");
          window.alert("Wrong QR code scanned");
        }

        window.location.reload();
      } catch (error) {
        console.error("Error making API call:", error);
      }
    }
  }

  // async function close() {
  //     qrScanner?.stop();
  //     qrScanner?.destroy();
  //     setQrScanner(undefined);
  // }

  useEffect(() => {
    if (video.current) {
      const qrScanner = new QrScanner(
        video.current,
        (result) => handleScan(result),
        {
          highlightScanRegion: true,
        }
      );
      qrScanner.start();
      setQrScanner(qrScanner);
    }
    // Dependency array missing handleScan, since it should not set Scanner on handleScan change
    // eslint-disable-next-line
  }, [video.current]);

  return (
    <div className="scanContainer2">
      <p className="ScanTitle">Scan QR Code</p>
      <div className="scanContainer">
        {scanCode === "" && <video ref={video}></video>}
        {scanCode !== "" && <h1> {scanCode}</h1>}
      </div>
    </div>
  );
};

export default Scan;
