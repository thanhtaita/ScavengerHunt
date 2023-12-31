import "./ProcessPage.css";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { GetContext } from "../AdminGame";
// import jsPDF from "jspdf";
import QRCode from "../../../QRCode.png";
import QRCodeGenrator from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { PDFDocument, rgb } from "pdf-lib";
import { ClueInfo } from "../../../utils/types";
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const Process = () => {
  const navigate = useNavigate();
  const { gId } = useParams();
  console.log(gId);
  const { step, setStep } = GetContext();
  let genPDF = false;
  const [clues, setclues] = useState<Array<ClueInfo>>([]);

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

  const fetchGameDetails = async () => {
    try {
      const res = await fetch(`${serverUrl}/mygame/${gId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/authfail");
        return;
      }

      const data = await res.json();
      console.log(data["hints"], data);
      setclues(data["hints"]);
    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };

  useEffect(() => {
    fetchGameDetails();
  }, []);

  useEffect(() => {
    if (clues.length !== 0) {
      if (genPDF === false) {
        console.log("genpdf", genPDF);
        clues.map((clue) => {
          const node = document.getElementById(clue.clueID.toString());
          htmlToImage
            .toPng(node!)
            .then(function (dataUrl) {
              const img = new Image();
              img.src = dataUrl;
              const blobData = dataURLtoBlob(dataUrl);

              console.log("dataUrl: ", QRCode, dataUrl);

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
    saveAs(pdfBlob, "gameId.pdf");
  };
  return (
    <div className="process-page">
      <div className="Header">
        <p className="titlePage">Print The QR Codes</p>
      </div>
      <div className="listOfQR">
        <ul className="allOfClues">
          {clues.map((clue) => (
            <li className="QRCodes" key={clue.clueID}>
              Clue {clue.clueID}{" "}
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
                  value={clue.QR_text}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer">
        <Link
          to={`/mygame/${gId}`}
          className="nav-btn"
          onClick={() => setStep(step - 1)}
        >
          Back
        </Link>

        <button className="PrintQR" onClick={() => pdfOnClick()}>
          Print QR Code
        </button>

        <Link
          to={`/mygame/${gId}/ScanQRCode`}
          className="nav-btn"
          onClick={() => setStep(step + 1)}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default Process;
