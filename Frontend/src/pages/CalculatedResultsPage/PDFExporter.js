import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PDFExporter = ({ results, farmerId, farmerName, startDate, endDate }) => {
  const { totalCost, totalYield, totalIncome, profitOrLoss, costOfProduction } = results;

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(12); 
    // doc.text("Calculated Results", 14, 15);
    doc.text(`Farmer ID: ${farmerId}`, 14, 25);
    doc.text(`Farmer Name: ${farmerName}`, 14, 35);
    doc.text(`Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, 14, 45);

    doc.autoTable({
      startY: 55,
      head: [['Metric', 'Value']],
      body: [
        ['Total Cost', totalCost],
        ['Total Yield', totalYield],
        ['Total Income', totalIncome],
        ['Profit or Loss', profitOrLoss],
        ['Cost of Production', costOfProduction]
      ],
    });

    doc.save("calculated_results.pdf");
  };

  return (
    <button onClick={exportToPDF}>Export</button>
  );
};

export default PDFExporter;
