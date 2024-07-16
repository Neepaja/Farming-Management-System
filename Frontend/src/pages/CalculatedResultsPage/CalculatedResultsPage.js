import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PDFExporter from './PDFExporter';
import './CalculatedResultsPage.css';

const CalculatedResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCost, totalYield, totalIncome, profitOrLoss, costOfProduction, farmerId, farmerName, startDate, endDate } = location.state || {};

  if (!location.state) {
    return <div>No data available</div>;
  }

  return (
    <div>
      
    <div className="calculated-container mt-5 flex-grow-1">
      <h3>Calculated Results</h3>
      <table>
        <tbody>
          <tr>
            <th>Farmer ID</th>
            <td>{farmerId}</td>
          </tr>
          <tr>
            <th>Farmer Name</th>
            <td>{farmerName}</td>
          </tr>
          <tr>
            <th>Period</th>
            <td>{`${startDate ? new Date(startDate).toLocaleDateString() : 'N/A'} - ${endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}`}</td>
          </tr>
          <tr>
            <th>Total Cost</th>
            <td>{totalCost}</td>
          </tr>
          <tr>
            <th>Total Yield</th>
            <td>{totalYield}</td>
          </tr>
          <tr>
            <th>Total Income</th>
            <td>{totalIncome}</td>
          </tr>
          <tr>
            <th>Profit or Loss</th>
            <td>{profitOrLoss}</td>
          </tr>
          <tr>
            <th>Cost of Production</th>
            <td>{costOfProduction}</td>
          </tr>
        </tbody>
      </table>
    </div>
   
     <div className="button-container-export">
    <button onClick={() => navigate('/income-expenses')}>Go Back</button>
    <div className="pdf-exporter">
        <PDFExporter results={{ totalCost, totalYield, totalIncome, profitOrLoss, costOfProduction }} farmerId={farmerId} farmerName={farmerName} startDate={startDate} endDate={endDate} />
    </div>
</div>

    </div>
  );
};

export default CalculatedResultsPage;


