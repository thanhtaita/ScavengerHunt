import { useRef, useState, useEffect } from "react";
// import { OverlayEventDetail } from "@ionic/core";
import QrScanner from "qr-scanner";
import { Console } from "console";

interface clues {
  "clueID": number,
  "QR_text": string,
  "clueText": string,
  "imageURL": string,
  "location": string
}

const ScanQR = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const gameId = queryParameters.get("gameId")
  const modal = useRef<HTMLIonModalElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner>();
  const [scanCode, setScanCode] = useState("");
  const [loc, setloc] = useState<Array<number>>();
  const [clues, setclues] = useState<Array<clues>>([]);
  var latitude: number = 0;
  var longitude: number = 0;


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


  const updateLoc = async () => {
    let str: string = ""
    console.log(JSON.stringify(clues))
    clues.map(a => console.log("jkjkjk", a, JSON.stringify(a), a.toString()))

    console.log("str:", str)
    console.log("hjupdateloc", clues, str)
    await fetch("http://localhost:9999/updateloc", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "gid": 2,
        "clues": JSON.stringify(clues)
      })
    }).then(response => response.text())
      .then(result => { console.log(result) })
      .catch(error => console.log('error', error));
  }


  useEffect(() => {
    fectGameDeatils()
    // console.log("navigator.geolocatio: ", navigator.geolocation)
    console.log("kl")
    navigator.geolocation.getCurrentPosition(position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      setloc([latitude, latitude])
      console.log("Latitude, Longitude", latitude, longitude);
      // Show a map centered at latitude / longitude.
    });

  }, [])

  useEffect(() => {
    if (scanCode !== "") {
      console.log("loc, qrcpde", loc, scanCode, JSON.parse(scanCode)["clueId"])
      clues.map((clue) => {
        if (clue.clueID === JSON.parse(scanCode)["clueId"]) {
          clue.location = loc!.toString();
        }
      })
      console.log(clues)
    }
    updateLoc()
  }, [scanCode])


  useEffect(() => {
    if (clues.length !== 0) {
      console.log("clues", clues)
    }

  }, [clues])


  function handleScan(result: QrScanner.ScanResult) {
    //Logic with scanned qr code
    setScanCode(result.data);
    console.log(result);
    qrScanner?.destroy();
  }

  async function close() {
    qrScanner?.stop();
    qrScanner?.destroy();
    setQrScanner(undefined);
  }

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
