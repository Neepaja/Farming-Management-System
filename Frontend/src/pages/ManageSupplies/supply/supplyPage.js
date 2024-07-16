import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { deleteSupplyApi, editSupplyApi, addSupplyApi } from "../../../services/Api";
import { useNavigate } from 'react-router-dom';
import AddNewSupply from "./addSupply";
import NavigationBar from "../../../components/NavigationBar";
import AppBar from "../../../components/Appbar";
import "./supplyPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaEdit, FaTrash } from "react-icons/fa";
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { IoSearch } from "react-icons/io5";

export default function ManageSupplyPage() {
    const [supplies, setSupplies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSupply, setNewSupply] = useState({
        supplyId: "",
        farmerId: "",
        farmerName: "",
        issuedDate: "",
        type: "",
        quantity: "",
        totalPrice: ""
    });
    const [errors, setErrors] = useState({});
    const [editingSupply, setEditingSupply] = useState(null);
    const [items, setItems] = useState([]);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const navigate = useNavigate();
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Fetch supplies from the server
    const fetchSupplies = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/supplies");
            setSupplies(response.data);
        } catch (error) {
            console.error("Error fetching supplies:", error);
        }
    };

    // Fetch items from the server
    const fetchItems = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/items");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchSupplies();
        fetchItems();
    }, [setNewSupply]); // Added setNewSupply as a dependency

    // Filter supplies based on search term
    const filteredSupplies = supplies.filter((supply) => {
        const searchTermLowerCase = searchTerm.toLowerCase();
        return (
            supply.supplyId.toString().includes(searchTermLowerCase) ||
            supply.type.toLowerCase().includes(searchTermLowerCase) ||
            supply.totalPrice.toString().includes(searchTermLowerCase) ||
            supply.farmerName.toLowerCase().includes(searchTermLowerCase)
        );
    });

    // Delete supply by supplyId
    const handleDeleteSupply = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this supply?");
        if (confirmed) {
            deleteSupplyApi(id)
                .then(() => {
                    const updatedSupplies = supplies.filter(supply => supply.supplyId !== id);
                    setSupplies(updatedSupplies);
                })
                .catch(error => console.error(error));
        }
    };

    // Edit supply by supplyId

    const handleEditSupply = async (id) => {    
        try {
            const response = await axios.get(`http://localhost:3001/api/supplies/${id}`);
            const supplyToEdit = response.data[0];
            if (supplyToEdit) {

                setEditingSupply(supplyToEdit);
                setNewSupply({ ...supplyToEdit }); 
                console.log('edit supply', editingSupply);
                console.log('new', newSupply);
                console.log('supplyToEdit', supplyToEdit);
                setShowAddForm(true);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

   

    
    // Handle search term change
    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
    };

    // Handle add new supply
    const handleAddNew = () => {
        setShowAddForm(true);
    };

    // Handle close supply form
    const handleCloseForm = () => {
        setShowAddForm(false);
        setNewSupply({
            supplyId: "",
            farmerId: "",
            farmerName: "",
            issuedDate: "",
            type: "",
            quantity: "",
            totalPrice: ""
        });
        setErrors({});
        setEditingSupply(null);
    };

    // Handle input change in supply form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSupply(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
    };

   
    const handleSubmit = (e, supplyData) => {
        e.preventDefault();
        const errors = {};
        if (!supplyData.farmerId || !supplyData.farmerId.trim()) {
            errors.farmerId = "Farmer ID is required";
        }
        if (!supplyData.issuedDate || !supplyData.issuedDate.trim()) {
            errors.issuedDate = "Issued Date is required";
        }
        if (!supplyData.typeQuantities || supplyData.typeQuantities.length === 0) {
            errors.typeQuantities = "At least one type and quantity is required";
        }
        supplyData.typeQuantities.forEach((tq, index) => {
            if (!tq.type || !tq.type.trim()) {
                errors[`type_${index}`] = "Type is required";
            }
            if (!tq.quantity || !tq.quantity.trim()) {
                errors[`quantity_${index}`] = "Quantity is required";
            }
        });
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
    
        const totalPrice = supplyData.typeQuantities.reduce((acc, tq) => {
            const item = items.find(i => i.type === tq.type);
            return acc + (item ? item.price * tq.quantity : 0);
        }, 0);
    
        const updatedSupplyData = {
            ...supplyData,
            totalPrice: totalPrice.toFixed(2)
        };
        console.log(supplyData);
    console.log(updatedSupplyData);
        if (editingSupply) {
            editSupplyApi(editingSupply.supplyId, updatedSupplyData)
                .then(() => {
                    const updatedSupplies = supplies.map((supply) =>
                        supply.supplyId === editingSupply.supplyId ? updatedSupplyData : supply
                    );
                    setSupplies(updatedSupplies);
                    setEditingSupply(null);
                    setShowAddForm(false);
                    setNewSupply({
                        supplyId: "",
                        farmerId: "",
                        farmerName: "",
                        issuedDate: "",
                        typeQuantities: [{ type: "", quantity: "" }],
                        totalPrice: ""
                    });
                    setErrors({});
                })
                .catch((error) => console.error("Error editing supply: ", error));
        } else {
            addSupplyApi(updatedSupplyData)
                .then(() => {
                    fetchSupplies();
                    setShowAddForm(false);
                    setNewSupply({
                        supplyId: "",
                        farmerId: "",
                        farmerName: "",
                        issuedDate: "",
                        typeQuantities: [{ type: "", quantity: "" }],
                        totalPrice: ""
                    });
                    setErrors({});
                })
                .catch((error) => console.error("Error adding new supply: ", error));
        }
    };
    
    
    // Function to get farmer name based on farmer id
    const getFarmerName = (id) => {
        const supply = supplies.find(supply => supply.farmerId === id);
        return supply ? supply.farmerName : "";
    };

    return (
        <div className="supplies-page">
        <AppBar />
        <div className="d-flex">
            <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
            <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
                <div className="mt-2">
                <h3 className="manage-supplies-title">Supplies</h3>
                <div className="button-container">
                 <div className="search-bar">
                    <div className="search-input-container">
                        <IoSearch  className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by ID or farmer name..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control search-input"
                        />
                         </div>
                         </div>
                        <button className="btn addnew-btn" onClick={handleAddNew}>
                            <FontAwesomeIcon icon={faCartPlus} style={{ marginRight: '5px'}} />Add
                        </button>
                    </div>
                    {showAddForm && (
                        <AddNewSupply
                            handleSubmit={handleSubmit}
                            handleCloseForm={handleCloseForm}
                            newSupply={newSupply}
                            handleInputChange={handleInputChange}
                            errors={errors}
                            editingSupply={editingSupply}
                            items={items}
                        />
                    )}
                    <div className="table-container">
                    <table className="table">
                            <thead>
                                <tr>
                                    {/* <th>Supply ID</th> */}
                                    <th>Farmer ID</th>
                                    <th>Farmer Name</th>
                                    <th>Issued Date</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSupplies.map((supply, index) => (
                                    <tr key={index}>
                                        {/* <td>{supply.supplyId}</td> */}
                                        <td>{supply.farmerId}</td>
                                        <td>{supply.farmerName}</td>
                                        <td>{formatDate(supply.issuedDate)}</td> {/* Format the issuedDate */}
                                        <td>{supply.type}</td>
                                        <td>{supply.quantity}</td>
                                        <td>{supply.totalPrice}</td>
                                        <td>
                                            {/* <FaEdit className="edit-icon" onClick={() => handleEditSupply(supply.supplyId)} />  */}
                                            <FaTrash className="delete-icon" onClick={() => handleDeleteSupply(supply.supplyId)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
        </div>
    );
}
