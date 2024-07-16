import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import AppBar from "../../components/Appbar";
import NavigationBar from "../../components/NavigationBar";
import "react-datepicker/dist/react-datepicker.css";
import './IncomeExpenses.css';

const IncomeExpensesPage = () => {
  const [incomeExpensesData, setIncomeExpensesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/income-expenses");
      console.log("API Response:", response.data);

      const data = response.data[0].concat(response.data[1]);

      const validData = data.filter(item => {
        const date = new Date(item.date);
        return !isNaN(date.getTime()); // Filter out invalid dates
      });

      const flattenedData = validData.map(item => ({
        farmerId: item.farmerID,
        farmerName: item.farmerName,
        AIRange: item.AIRange,
        date: new Date(item.date), // Ensure date is a Date object
        inputActivity: item.inputActivity,
        inputUsedQuantity: item.inputUsedQuantity,
        inputUsedCost: item.inputUsedCost,
        machineryHours: item.machineryHours,
        machineryCost: item.machineryCost,
        labourHours: item.labourHours,
        labourCost: item.labourCost,
        soldAtEventsQuantity: item.soldAtEventsQuantity,
        soldAtEventsIncome: item.soldAtEventsIncome,
        destroyedQuantity: item.destroyedQuantity,
        soldLocallyQuantity: item.soldLocallyQuantity,
        soldLocallyIncome: item.soldLocallyIncome,
        exportQuantity: item.exportQuantity,
        exportIncome: item.exportIncome,
        suppliesList: item.suppliesList,
        suppliesCost: item.suppliesCost
      }));

      setIncomeExpensesData(flattenedData);
      setFilteredData(flattenedData);
    } catch (error) {
      console.error("Error fetching income and expenses data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const filtered = incomeExpensesData.filter(item => {
      const farmerIdMatch = typeof item.farmerId === 'string' && item.farmerId.toLowerCase().includes(lowerSearchQuery);
      const farmerNameMatch = typeof item.farmerName === 'string' && item.farmerName.toLowerCase().includes(lowerSearchQuery);
      const AIRangeMatch = typeof item.AIRange === 'string' && item.AIRange.toLowerCase().includes(lowerSearchQuery);
      const dateMatch = item.date instanceof Date && item.date.toLocaleDateString().toLowerCase().includes(lowerSearchQuery);
  
      return (
        (farmerIdMatch || farmerNameMatch || AIRangeMatch || dateMatch) &&
        (!startDate || item.date >= startDate) &&
        (!endDate || item.date <= endDate)
      );
    });
    setFilteredData(filtered);
  };
  
  const handleDateFilter = () => {
    const filtered = incomeExpensesData.filter(item => {
      const itemDate = new Date(item.date);
      const isAfterStartDate = !startDate || itemDate >= startDate;
      const isBeforeEndDate = !endDate || itemDate <= endDate;
  
      return (
        (searchQuery === '' || // No search query or
        (typeof item.farmerId === 'string' && item.farmerId.toLowerCase().includes(searchQuery.toLowerCase())) || // Match farmer ID
        (typeof item.farmerName === 'string' && item.farmerName.toLowerCase().includes(searchQuery.toLowerCase())) || // Match farmer name
        (typeof item.AIRange === 'string' && item.AIRange.toLowerCase().includes(searchQuery.toLowerCase())) || // Match AI Range
        (item.date instanceof Date && item.date.toLocaleDateString().toLowerCase().includes(searchQuery.toLowerCase()))) && // Match date
        (isAfterStartDate && isBeforeEndDate)
      );
    });
    setFilteredData(filtered);
  };
  

  const calculateResults = () => {
    const selectedFarmerData = filteredData;

    if (selectedFarmerData.length === 0) {
      alert('No data available for the selected criteria.');
      return;
    }

    let totalCost = 0;
    let totalYield = 0;
    let totalIncome = 0;

    selectedFarmerData.forEach(item => {
      totalCost += (parseFloat(item.inputUsedCost) || 0) + (parseFloat(item.machineryCost) || 0) + (parseFloat(item.labourCost) || 0) + (parseFloat(item.suppliesCost) || 0);
      totalYield += (parseFloat(item.soldAtEventsQuantity) || 0) + (parseFloat(item.soldLocallyQuantity) || 0) + (parseFloat(item.exportQuantity) || 0);
      totalIncome += (parseFloat(item.soldAtEventsIncome) || 0) + (parseFloat(item.soldLocallyIncome) || 0) + (parseFloat(item.exportIncome) || 0);
    });

    const profitOrLoss = totalIncome - totalCost;
    const costOfProduction = totalCost / (totalYield || 1);

    const { farmerId, farmerName } = selectedFarmerData[0]; // Assuming all records have the same farmerId and farmerName

    navigate('/calculated-results', { state: { totalCost, totalYield, totalIncome, profitOrLoss, costOfProduction, farmerId, farmerName, startDate, endDate } });
  };

  return (
    <div className="incomeexpenses-page">
        <AppBar />
        <div className="d-flex">
            <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
            <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
            <h3 className="income-expenses-title">Income & Expenses</h3>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Farmer ID, Name, AI Range, or Date"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <div className="date-picker">
          <label>From: </label>
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
          <label>To: </label>
          <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
          <button onClick={handleDateFilter}>Filter by Date</button>
        </div>
      </div>
      <button className="button" onClick={calculateResults}>Calculate Results</button>
      <div className="itable-container">
        <table>
          <thead>
            <tr>
              <th>Farmer ID</th>
              <th>Farmer Name</th>
              <th>AI Range</th>
              <th>Date</th>
              <th>Input Activity</th>
              <th>Input Used Quantity</th>
              <th>Input Used Cost</th>
              <th>Machinery Hours</th>
              <th>Machinery Cost</th>
              <th>Labour Hours</th>
              <th>Labour Cost</th>
              <th>Sold at Events Quantity</th>
              <th>Sold at Events Income</th>
              <th>Destroyed Quantity</th>
              <th>Sold Locally Quantity</th>
              <th>Sold Locally Income</th>
              <th>Export Quantity</th>
              <th>Export Income</th>
              <th>Supplies List</th>
              <th>Supplies Cost</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.farmerId}</td>
                <td>{item.farmerName}</td>
                <td>{item.AIRange}</td>
                <td>{item.date.toLocaleDateString()}</td>
                <td>{item.inputActivity}</td>
                <td>{item.inputUsedQuantity}</td>
                <td>{item.inputUsedCost}</td>
                <td>{item.machineryHours}</td>
                <td>{item.machineryCost}</td>
                <td>{item.labourHours}</td>
                <td>{item.labourCost}</td>
                <td>{item.soldAtEventsQuantity}</td>
                <td>{item.soldAtEventsIncome}</td>
                <td>{item.destroyedQuantity}</td>
                <td>{item.soldLocallyQuantity}</td>
                <td>{item.soldLocallyIncome}</td>
                <td>{item.exportQuantity}</td>
                <td>{item.exportIncome}</td>
                <td>{item.suppliesList}</td>
                <td>{item.suppliesCost}</td>
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

export default IncomeExpensesPage;


