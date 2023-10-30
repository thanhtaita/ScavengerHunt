import { useRef, useState, useEffect } from 'react';
import { IonModal, IonPage, IonTitle } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core';
import QrScanner from 'qr-scanner';
import "./playerView.css";



const Scan = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const video = useRef<HTMLVideoElement>(null);
    const [qrScanner, setQrScanner] = useState<QrScanner>();
    const [scanCode, setScanCode] = useState("");

    function onDissMiss(_event: CustomEvent<OverlayEventDetail>) {
        close();
    }

    function handleScan(result: QrScanner.ScanResult) {
        //Logic with scanned qr code
        setScanCode(result.data)
        console.log(result)
        qrScanner?.destroy();
    }

    async function close() {
        qrScanner?.stop();
        qrScanner?.destroy();
        setQrScanner(undefined);
    }

    useEffect(() => {
        if (video.current) {
            const qrScanner = new QrScanner(video.current, (result) => handleScan(result), {
                highlightScanRegion: true,
            });
            qrScanner.start();
            setQrScanner(qrScanner);
        }
        // Dependency array missing handleScan, since it should not set Scanner on handleScan change
        // eslint-disable-next-line
    }, [video.current]);


    return (
        <div className="leaderboardsContainer">
            {scanCode === "" &&

                <video ref={video}></video>
            }{scanCode !== "" &&
                < h1 > {scanCode}</h1 >
            }


        </div>

    );
};

export default Scan;