import { useRef, useState, useEffect } from "react";
// import { OverlayEventDetail } from "@ionic/core";
import QrScanner from "qr-scanner";

const ScanQR = () => {
  // const modal = useRef<HTMLIonModalElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner>();
  const [scanCode, setScanCode] = useState("");

  function handleScan(result: QrScanner.ScanResult) {
    //Logic with scanned qr code
    setScanCode(result.data);
    console.log(result);
    qrScanner?.destroy();
  }

  // async function close() {
  //   qrScanner?.stop();
  //   qrScanner?.destroy();
  //   setQrScanner(undefined);
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

export default ScanQR;
