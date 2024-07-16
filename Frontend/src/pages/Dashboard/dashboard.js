import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavigationBar from '../../components/NavigationBar';
import { faRibbon } from '@fortawesome/free-solid-svg-icons';
import { Line, Bar, Pie } from 'react-chartjs-2';
import ChartJS from 'chart.js/auto';
import moment from 'moment';
import AppBar from '../../components/Appbar';
import './dashboard.css';

const Dashboard = () => {
  const [ribbonCounts, setRibbonCounts] = useState([]);
  const [startDates, setStartDates] = useState({});
  const [endDates, setEndDates] = useState({});
  const [identifiedIssues, setIdentifiedIssues] = useState({});
  const [incomeExpensesData, setIncomeExpensesData] = useState([]);
  const [exportQuantitiesByAIRange, setExportQuantitiesByAIRange] = useState({});
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  useEffect(() => {
    fetchRibbonCounts();
    fetchRibbonDates();
    fetchIdentifiedIssues();
    fetchIncomeExpensesData();
    renderLineChart();
  }, []);

  const fetchRibbonDates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/ribbonDates');
      setStartDates(response.data.startDates);
      setEndDates(response.data.endDates);
    } catch (error) {
      console.error('Error fetching ribbon dates:', error);
    }
  };

  const fetchRibbonCounts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/ribbonCount');
      setRibbonCounts(response.data);
    } catch (error) {
      console.error('Error fetching ribbon counts:', error);
    }
  };

  const calculateTotalCount = (color) => {
    return ribbonCounts.reduce((total, ribbonCount) => total + (ribbonCount[color] || 0), 0);
  };

  const fetchIdentifiedIssues = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/identifiedIssues');
      setIdentifiedIssues(response.data);
    } catch (error) {
      console.error('Error fetching identified issues:', error);
    }
  };

  const fetchIncomeExpensesData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/income-expenses');
      const data = response.data;
      setIncomeExpensesData(data);

      // Process data for pie chart
      const lastWeekStart = moment().subtract(1, 'weeks').startOf('week');
      const lastWeekEnd = moment().subtract(1, 'weeks').endOf('week');
      const lastWeekData = data.filter(item => moment(item.date).isBetween(lastWeekStart, lastWeekEnd));

      const exportQuantitiesByAIRange = lastWeekData.reduce((acc, item) => {
        if (!acc[item.AIRange]) {
          acc[item.AIRange] = 0;
        }
        acc[item.AIRange] += parseFloat(item.exportQuantity) || 0;
        return acc;
      }, {});

      setExportQuantitiesByAIRange(exportQuantitiesByAIRange);

    } catch (error) {
      console.error('Error fetching income and expenses data:', error);
    }
  };

  const renderBarChart = () => {
    const labels = Object.keys(identifiedIssues);
    const data = Object.values(identifiedIssues);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Number of Farmers',
          backgroundColor: '#1A4D2E',
          borderColor: '#2daa14',
          borderWidth: 1,
          hoverBackgroundColor: '#2daa14',
          hoverBorderColor: '#1A4D2E',
          data: data,
        },
      ],
    };

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
        },
        x: {
          type: 'category',
        },
      },
    };

    return <Bar data={chartData} options={chartOptions} />;
  };

  const processDataForChart = () => {
    const weeklyData = {};
    const twelveWeeksAgo = moment().subtract(12, 'weeks').startOf('week');

    for (let i = 0; i < 12; i++) {
      const weekStart = moment(twelveWeeksAgo).add(i, 'weeks').startOf('week').format('YYYY-MM-DD');
      weeklyData[weekStart] = {
        exportQuantity: 0,
        soldAtEventsQuantity: 0,
        soldLocallyQuantity: 0,
      };
    }

    incomeExpensesData.forEach(item => {
      const weekStart = moment(item.date).startOf('week').format('YYYY-MM-DD');
      if (weeklyData.hasOwnProperty(weekStart)) {
        weeklyData[weekStart].exportQuantity += parseFloat(item.exportQuantity) || 0;
        weeklyData[weekStart].soldAtEventsQuantity += parseFloat(item.soldAtEventsQuantity) || 0;
        weeklyData[weekStart].soldLocallyQuantity += parseFloat(item.soldLocallyQuantity) || 0;
      }
    });

    return weeklyData;
  };

  let lineChart = null;

  const renderLineChart = () => {
    if (lineChart) {
      lineChart.destroy();
    }

    const weeklyData = processDataForChart();
    const labels = Object.keys(weeklyData);
    const exportData = Object.values(weeklyData).map(data => data.exportQuantity);
    const eventsData = Object.values(weeklyData).map(data => data.soldAtEventsQuantity);
    const localData = Object.values(weeklyData).map(data => data.soldLocallyQuantity);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Export Quantity',
          data: exportData,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        },
        {
          label: 'Quantity Sold at Events',
          data: eventsData,
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Quantity Sold Locally',
          data: localData,
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
        },
      ],
    };

    const chartOptions = {
      plugins: {
        title: {
          display: true,
          text: 'Total Quantity by Transaction Type (Last 12 Weeks)',
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Weeks',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Total Quantity',
            },
            ticks: {
              beginAtZero: true,
            },
          },
        },
      },
    };

    const canvas = document.getElementById('line-chart');
    lineChart = new ChartJS(canvas, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
  };

  const renderPieChart = () => {
    const labels = Object.keys(exportQuantitiesByAIRange);
    const data = Object.values(exportQuantitiesByAIRange);

    const chartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#1A4D2E',
            '#2daa14',
          ],
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Export Quantities by AI Range (Last Week)',
        },
      },
    };

    return <Pie data={chartData} options={chartOptions} />;
  };

  const formatDate = (isoDate) => {
    return moment(isoDate).format('DD MMM YYYY');
  };

  return (
    <div className="dashboard-page">
      <AppBar />
      <div className="d-flex">
        <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
        <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
          <div className="top-section">
            <div className="bar-chart-container">
              <h3>Identified Issues</h3>
              {renderBarChart()}
            </div>
            <div className="ribbon-container">
              <h2>Ribbon Count Dashboard</h2>
              <div className="ribbon-counts">
                {['blue', 'red', 'yellow', 'white', 'purple', 'orange', 'black', 'pink'].map((color, index) => (
                  <div className="ribbon-count" key={index}>
                    <div className={`color ${color}`}>
                      <FontAwesomeIcon icon={faRibbon} className="ribbon-icon" />
                    </div>
                    <div className="count">{calculateTotalCount(color)}</div>
                    <div className="dates">
                      <span>Start Date: {formatDate(startDates[color])}</span><br/>
                      <span>End Date: {formatDate(endDates[color])}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="overview-container">
            <div className="line-chart-container">
              <h3>Total Quantity by Transaction Type (Last 12 Weeks)</h3>
              <canvas id="line-chart"></canvas>
            </div>
            <div className="pie-chart-container">
              <h3>Export Quantities by AI Range (Last Week)</h3>
              {renderPieChart()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


