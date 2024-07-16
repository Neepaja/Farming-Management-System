import React, { useState, useEffect } from "react";
import axios from "axios";
import AppBar from "../../components/Appbar";
import { useNavigate } from 'react-router-dom';
import NavigationBar from "../../components/NavigationBar";
import { FaEye } from "react-icons/fa";
import "./statusAnalysisPage.css";


const StatusAnalysisPage = () => {
  const [statusList, setStatusList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const navigate = useNavigate();

 

//   const fetchStatuses = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/status");
//       console.log(response.data);
// ;      setStatusList(response.data);
//     } catch (error) {
//       console.error("Error fetching status entries:", error);
//     }
//   };

const fetchStatuses = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/status');
    setStatusList(response.data);
  } catch (error) {
    console.error('Error fetching status entries:', error);
  }
}; 
  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleViewStatus = (id) => {
    const statusToView = statusList.find(status => status.statusId === id);
    navigate(`/viewStatus/${id}`, { state: { status: statusToView } });
  };

  const filterStatuses = (statuses) => {
    return statuses.filter(status => {
      const matchesSearchTerm = (
        (status.farmerId && status.farmerId.toString().includes(searchTerm)) ||
        (status.farmerName && status.farmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (status.date && status.date.includes(searchTerm)) ||
        (status.AIRange && status.AIRange.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      const statusDate = new Date(status.date);
      const matchesDateRange = (
        (!dateFrom || statusDate >= new Date(dateFrom)) &&
        (!dateTo || statusDate <= new Date(dateTo))
      );

      return matchesSearchTerm && matchesDateRange;
    });
  };

  const filteredStatusList = filterStatuses(statusList);

  return (
      <div className="status-analysis-page">
        <AppBar />
        <div className="d-flex">
            <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
            <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
            <h2 className="manage-items-title">Status Analysis</h2>
      <div className="filters">
  <input
    type="text"
    placeholder="Search by Farmer ID, Name or AI Range"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-bar"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      width: 'calc(30% - 5px)',
      marginRight: 'auto',
      borderRadius: '30px'
    }}
  />
  <div className="date-filters">
    <label>
      From:
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="date-input"
      />
    </label>
    <label>
      To:
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="date-input"
      />
    </label>
  </div>
</div>
<div className="table-container">
                    <table className="table">
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Farmer Name</th>
            <th>AI Range</th>
            <th>Date</th>
            <th>Identified Issues</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStatusList.map((status) => (
            <tr key={status.statusId}>
              <td>{status.farmerId}</td>
              <td>{status.farmerName}</td>
              <td>{status.AIRange}</td>
              <td>{new Date(status.date).toLocaleDateString()}</td>
              {/* <td>{status.identifiedIssues}</td> */}
              <td>
                {Array.isArray(status.identifiedIssues) ? (
                  status.identifiedIssues.map((issue, index) => (
                    <span key={index}>{issue.issue}</span>
                  ))
                ) : (
                  <span>{status.identifiedIssues}</span>
                )}
              </td>
              {/* <td>{status.neededResources}</td> */}
              {/* <td>
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
              </td> */}
              {/* <td>{status.photos}</td> */}
              <td>
                <FaEye className="view-icon" onClick={() => handleViewStatus(status.statusId)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </main>
    </div>
    </div>
    
  );
};

export default StatusAnalysisPage;
