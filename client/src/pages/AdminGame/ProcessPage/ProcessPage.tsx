import "./ProcessPage.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "../../../../public/QRCode.png";
import QRCodeGenrator from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { PDFDocument, rgb } from "pdf-lib";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import axios from "axios";
import { RequestOptions } from "http";

interface clues {
  "clueID": number,
  "QR_text": string,
  "clueText": string,
  "imageURL": string,
  "location": string
}

const Process = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const gameId = queryParameters.get("gameId")
  var game_details = "";
  const [clues, setclues] = useState<Array<clues>>([]);
  console.log(gameId)
  let genPDF = false;

  // const clues = [
  //   "Clue 1",
  //   "Clue 2",
  //   "Clue 3",
  //   "Clue 4",
  //   "Clue 5",
  //   "Clue 6 ",
  //   "Clue 7",
  //   "Clue 8",
  //   "Clue 9",
  //   "Clue 10",
  // ];
  console.log("game_details: ", game_details)
  function dataURLtoBlob(dataUrl: string) {
    // Decode the dataURL
    const binary = atob(dataUrl.split(",")[1]);

    // Create 8-bit unsigned array
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    // Return our Blob object
    return new Blob([new Uint8Array(array)], {
      type: "image/png",
    });
  }
  const pdfDoc = PDFDocument.create();
  let pdfBlob: Blob;
  const convertBlobToPDF = async (blobData: Blob) => {
    try {
      // Convert the blob data to an array buffer
      const arrayBuffer = await blobData.arrayBuffer();

      // Create a new PDF document
      // const pdfDoc = await PDFDocument.create();

      // Add a new page to the document
      const page = (await pdfDoc).addPage([600, 400]);

      // Set the background color of the page
      page.drawRectangle({
        x: 0,
        y: 0,
        width: 600,
        height: 400,
        color: rgb(1, 1, 1),
      });

      // Embed the blob data in the PDF
      const image = await (await pdfDoc).embedPng(arrayBuffer);

      // Draw the embedded image on the page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: 600,
        height: 400,
      });

      // Serialize the PDF to bytes
      const pdfBytes = await (await pdfDoc).save();

      // Create a Blob from the PDF bytes
      pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // Save the PDF as a file
    } catch (error) {
      console.error("Error converting blob to PDF:", error);
    }
  };

  // get game details

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


  useEffect(() => {
    console.log("cluesHema: ", clues)
    if (clues.length !== 0) {
      if (genPDF === false) {
        console.log("genpdf", genPDF);
        clues.map((clue) => {
          console.log(" clue clue", clue)
          const node = document.getElementById(clue.clueID.toString());
          htmlToImage
            .toPng(node!)
            .then(function (dataUrl) {
              const img = new Image();
              img.src = dataUrl;
              const blobData = dataURLtoBlob(dataUrl);

              // console.log("dataUrl: ", QRCode, dataUrl);

              convertBlobToPDF(blobData);
            })
            .catch(function (error) {
              console.error("oops, something went wrong!", error);
            });
        });
        genPDF = true;
      }
    }

  }, [clues]);

  const pdfOnClick = () => {
    saveAs(pdfBlob, "gameId_" + gameId + ".pdf");
  };
  return (
    <>
      <div className="Header">
        <p className="titlePage">Print The QR Codes</p>
        <p className="bioPage">
          click the PrintQR Code button to generate a PDF of all the QR
        </p>
      </div>
      <div className="listOfQR">
        <ul className="allOfClues">
          {clues.map((clue: clues, index: number) => (
            <li className="QRCodes" key={index}>
              {clue.clueText}{" "}
              <div
                style={{
                  height: "auto",
                  margin: "0 auto",
                  maxWidth: 64,
                  width: "100%",
                }}
              >
                <QRCodeGenrator
                  size={256}
                  id={clue.clueID.toString()}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={"{\"gid\":" + gameId + ",\"clueId\":" + clue.clueID + "}"}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer">
        <Link to="/mygame" className="nav-btn">
          Back
        </Link>

        <button className="PrintQR" onClick={() => pdfOnClick()}>
          Print QR Code
        </button>

        <Link to="/mygame/scanQRCode?gameId=2" className="nav-btn">
          next
        </Link>
      </div>
    </>
  );
};

export default Process;
