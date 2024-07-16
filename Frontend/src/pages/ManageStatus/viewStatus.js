import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './viewStatus.css';
import { Link } from 'react-router-dom';

function ViewStatus() {
  const location = useLocation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (location.state && location.state.status) {
      setStatus(location.state.status);
    }
  }, [location.state]);

  if (!status) {
    return <p>Loading...</p>;
  }

  // Format date to a more readable format
  const formattedDate = new Date(status.date).toLocaleDateString();

  return (
    <div>
    <div className="view-container">
      <h2>View Status</h2>
      <div className="details-container">
        <div className="detail">
          <strong>Farmer ID:</strong>
          <span>{status.farmerId}</span>
        </div>
        <div className="detail">
          <strong>Farmer Name:</strong>
          <span>{status.farmerName}</span>
        </div>
        <div className="detail">
          <strong>AI Range:</strong>
          <span>{status.AIRange}</span>
        </div>
        {/* <div className="detail">
          <strong>Date:</strong>
          <span>{status.date}</span>
        </div> */}
        <div className="detail">
          <strong>Date:</strong>
          <span>{formattedDate}</span>
        </div>
        <div className="detail">
          <strong>Identified Issues:</strong>
          <span>{status.identifiedIssues}</span>
        </div>
        <div className="detail">
          <strong>Extra Issues:</strong>
          <span>{status.extraIssues}</span>
        </div>
        <div className="detail">
          <strong>Needed Resources:</strong>
          <span>{status.neededResources}</span>
        </div>
        <div className="detail">
          <strong>Ribbon Count:</strong>
          <ul>
            {status.ribbonCount && Array.isArray(status.ribbonCount) && status.ribbonCount.length > 0 ? (
              status.ribbonCount.map((ribbon, index) => (
                <li key={index}>
                  {ribbon.color}: {ribbon.count} ({ribbon.action})
                </li>
              ))
            ) : (
              <li>No ribbon count data</li>
            )}
          </ul>
        </div> 
        <div className="detail">
          <strong>Comments:</strong>
          <span>{status.comments}</span>
        </div>
        {status.photos && (
          <div className="detail">
            <strong>Photos:</strong>
            {status.photos.map((photo, index) => (
              <img
                key={index}
                src={`http://localhost:3001/${photo}`}
                alt={`status-${index}`}
              />
            ))}
          </div>
          
        )}
      </div>
      <h3>Income and Cost Details</h3>
      <table className="income-cost-table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Quantity</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Input Used</td>
            <td>{status.inputUsedQuantity}</td>
            <td>{status.inputUsedCost}</td>
          </tr>
          <tr>
            <td>Machinery</td>
            <td>{status.machineryHours}</td>
            <td>{status.machineryCost}</td>
          </tr>
          <tr>
            <td>Labour</td>
            <td>{status.labourHours}</td>
            <td>{status.labourCost}</td>
          </tr>
          <tr>
            <td>Sold at Events</td>
            <td>{status.soldAtEventsQuantity}</td>
            <td>{status.soldAtEventsIncome}</td>
          </tr>
          <tr>
            <td>Sold Locally</td>
            <td>{status.soldLocallyQuantity}</td>
            <td>{status.soldLocallyIncome}</td>
          </tr>
          <tr>
            <td>Destroyed</td>
            <td>{status.destroyedQuantity}</td>
            <td>N/A</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="go-back-button" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
    <Link to="/status" className="btn btn-secondary">Go Back</Link>
</div>
</div>
  );
}

export default ViewStatus;
