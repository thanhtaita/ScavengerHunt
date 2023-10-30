import React from "react";
import jsPDF from "jspdf";

export function generateBlankPDF() {
  const doc = new jsPDF();
  doc.text("Hello world!", 10, 10);
  doc.save("blank.pdf");

  return (
    <div>
      <button onClick={generateBlankPDF}>Generate blank PDF</button>
    </div>
  );
}
