import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { OverlayEventDetail } from '@ionic/core';
import QrScanner from "qr-scanner";
import "./playerView.css";
import { useContext } from "react";
import { AuthContext } from "../../utils/context";

const Scan = () => {
  const { user } = useContext(AuthContext);
  const { gameId } = useParams<{ gameId: string }>();
  // const modal = useRef<HTMLIonModalElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner>();
  const [scanCode, setScanCode] = useState("");

  // function onDissMiss(_event: CustomEvent<OverlayEventDetail>) {
  //     close();
  // }

  async function handleScan(result: QrScanner.ScanResult) {
    //Logic with scanned qr code
    setScanCode(result.data);
    console.log(result.data);
    console.log("Handling Scan...");

    if (user) {
      const uid = user.email;
      try {
        const response = await fetch(
          "https://shserver-q8el.onrender.com/verifyQR",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: uid,
              result: result.data,
              gameId: gameId,
            }),
          }
        );

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
      } catch (error) {
        console.error("Error making API call:", error);
      }
    }

    qrScanner?.destroy();
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
    <div className="scanContainer">
      {scanCode === "" && <video ref={video}></video>}
      {scanCode !== "" && <h1> {scanCode}</h1>}
    </div>
  );
};

export default Scan;
