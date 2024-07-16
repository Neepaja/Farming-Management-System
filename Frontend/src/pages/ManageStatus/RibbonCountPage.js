import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../../components/NavigationBar';
import { Modal, Button, Form } from 'react-bootstrap';
import './RibbonCountPage.css';
import { IoSearch } from "react-icons/io5";
import AppBar from '../../components/Appbar';

const RibbonCountPage = () => {
    const [ribbonCounts, setRibbonCounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [canReset, setCanReset] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [resetStartDate, setResetStartDate] = useState('');
    const [resetEndDates, setResetEndDates] = useState({
        blue: '',
        red: '',
        yellow: '',
        white: '',
        purple: '',
        orange: '',
        black: '',
        pink: '',
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

    useEffect(() => {
        fetchRibbonCounts();
        checkCanReset(); // Check if 8 weeks have passed
    }, []);
    

    const fetchRibbonCounts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/ribbonCount');
            setRibbonCounts(response.data);
        } catch (error) {
            console.error('Error fetching ribbon counts:', error);
        }
    };

    const checkCanReset = () => {
        // Logic to check if 8 weeks have passed
        const eightWeeksAgo = new Date(); // Get the current date
        eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56); // Subtract 8 weeks (56 days)
        const currentDate = new Date(); // Get the current date
        if (currentDate >= eightWeeksAgo) {
            setCanReset(true); // Enable reset after 8 weeks
        }
    };

    const handleResetColumn = (color) => {
        setSelectedColor(color);
        setShowResetModal(true);
    };

    const handleConfirmReset = async (startDate, endDate) => {
        try {
            // Calculate end date
            const endDateObj = new Date(startDate);
            endDateObj.setDate(endDateObj.getDate() + 56); // Add 56 days (8 weeks)
            const endDate = endDateObj.toISOString();

            // Update values in the corresponding column to zero
            const updatedRibbonCounts = ribbonCounts.map(ribbonCount => {
                if (ribbonCount[selectedColor.toLowerCase()]) {
                    ribbonCount[selectedColor.toLowerCase()] = 0;
                }
                return ribbonCount;
            });
console.log("End Date",endDate);
            // Update start and end dates in the ribbon calendar
            setResetStartDate(startDate);
            setResetEndDates(prevState => ({
                ...prevState,
                [selectedColor.toLowerCase()]: endDate,
            }));
console.log(selectedColor, startDate, endDate);
            // Update ribbon counts in the backend
            const response = await axios.post('http://localhost:3001/api/resetRibbonCount', { color: selectedColor, resetStartDate: startDate, resetEndDate: endDate });
            if (response.status === 200) {
                setRibbonCounts(updatedRibbonCounts); // Update ribbon counts in the frontend
            } else {
                console.error('Error resetting ribbon count:', response.statusText);
            }
        } catch (error) {
            console.error('Error resetting ribbon count:', error);
        }
        setShowResetModal(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredRibbonCounts = ribbonCounts.filter((ribbonCount) => {
        const { farmerId, Name, AIRange } = ribbonCount;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            farmerId.toString().includes(lowerCaseQuery) ||
            Name.toLowerCase().includes(lowerCaseQuery) ||
            AIRange.toLowerCase().includes(lowerCaseQuery)
        );
    });

    // Function to calculate the end date based on the start date
    const calculateEndDate = (startDate) => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 56); // Add 56 days (8 weeks)
        return endDate.toDateString();
    };

    return (
        <div className="ribbon-count-page">
            <AppBar />
        <div className="d-flex">
            <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
            <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
                <div className="mt-2">
                <h2 className="manage-farmers-title">Ribbon Count</h2>
                    <div className="search-bar">
                        <div className="search-input-container">
                            <IoSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by farmerId, farmerName, or aiRange"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="form-control search-input"
                            />
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Farmer ID</th>
                                    <th>Farmer Name</th>
                                    <th>AI Range</th>
                                    <th>Blue <button className="reset-button" onClick={() => handleResetColumn('blue')} disabled={!canReset}>Reset</button></th>
                                    <th>Red <button className="reset-button" onClick={() => handleResetColumn('red')} disabled={!canReset}>Reset</button></th>
                                    <th>Yellow <button className="reset-button" onClick={() => handleResetColumn('yellow')} disabled={!canReset}>Reset</button></th>
                                    <th>White <button className="reset-button" onClick={() => handleResetColumn('white')} disabled={!canReset}>Reset</button></th>
                                    <th>Purple <button className="reset-button" onClick={() => handleResetColumn('purple')} disabled={!canReset}>Reset</button></th>
                                    <th>Orange <button className="reset-button" onClick={() => handleResetColumn('orange')} disabled={!canReset}>Reset</button></th>
                                    <th>Black <button className="reset-button" onClick={() => handleResetColumn('black')} disabled={!canReset}>Reset</button></th>
                                    <th>Pink <button className="reset-button" onClick={() => handleResetColumn('pink')} disabled={!canReset}>Reset</button></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRibbonCounts.map((ribbonCount) => (
                                    <tr key={ribbonCount.farmerId}>
                                        <td>{ribbonCount.farmerId}</td>
                                        <td>{ribbonCount.Name}</td>
                                        <td>{ribbonCount.AIRange}</td>
                                        <td>{ribbonCount.blue}</td>
                                        <td>{ribbonCount.red}</td>
                                        <td>{ribbonCount.yellow}</td>
                                        <td>{ribbonCount.white}</td>
                                        <td>{ribbonCount.purple}</td>
                                        <td>{ribbonCount.orange}</td>
                                        <td>{ribbonCount.black}</td>
                                        <td>{ribbonCount.pink}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formResetStartDate">
                        <Form.Label>Enter Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={resetStartDate}
                            onChange={(e) => setResetStartDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formResetEndDate">
                        <Form.Label>End Date (Automatically Calculated)</Form.Label>
                        <Form.Control
                            type="text"
                            value={resetStartDate ? calculateEndDate(resetStartDate) : ''}
                            readOnly
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResetModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirmReset(resetStartDate, resetEndDates[selectedColor.toLowerCase()])}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Ribbon Calendar */}
            {/* <div className="ribbon-calendar-container">
                <h4>Ribbon Calendar</h4>
                <div className="ribbon-calendar">
                    {Object.entries(resetEndDates).map(([color, endDate]) => (
                        <div key={color} className={`ribbon-color ${color}`}>
                            <p>{color.toUpperCase()} Ribbon:</p>
                            <p>Start Date: {resetStartDate}</p>
                            <p>End Date: {endDate ? new Date(endDate).toDateString() : '-'}</p>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
        </div>
    );
};

export default RibbonCountPage;

