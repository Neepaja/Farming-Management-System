import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { addItemApi,editItemApi, deleteItemApi} from "../../../services/Api";
import { useNavigate } from 'react-router-dom';
import AddNewItem from "./addItem";
import NavigationBar from "../../../components/NavigationBar";
import AppBar from "../../../components/Appbar";
import "./viewItem";
import './itemPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FaEdit, FaEye, FaTrash} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function ManageItemPage() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [newItem, setNewItem] = useState({
        type: "",
        price: ""
    });
    
    const [errors, setErrors] = useState({});
    const [editingItem, setEditingItem] = useState(null);
    const navigate = useNavigate();

    const fetchItems = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/items");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const filteredItems = Array.isArray(items)
    ? searchTerm
        ? items.filter((item) => {
            const searchTermLowerCase = searchTerm.toLowerCase();
            return (
                item.itemId.toString().includes(searchTermLowerCase) ||
                item.type.toLowerCase().includes(searchTermLowerCase) ||
                item.price.toString().includes(searchTermLowerCase) 
            );
        })
        : items
    : [];

    const handleDeleteItem = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");
        if (confirmed) {
            deleteItemApi(id)
                .then(() => {
                    const updatedItems = items.filter(item => item.itemId !== id);
                    setItems(updatedItems);
                })
                .catch(error => console.error(error));
        }
    };
    
    const handleEditItem = (id) => {
        const itemToEdit = items.find(item => item.itemId === id);
        if (itemToEdit) {
            setEditingItem(itemToEdit);
            setNewItem({ ...itemToEdit }); 
            setShowAddForm(true);
        }
    };

    const handleViewItem = (id) => {
        const itemToView = items.find(item => item.itemId === id);
        navigate(`/viewItem/${id}`, { state: { item: itemToView } });
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
    };

    const handleAddNew = () => {
        setShowAddForm(true);
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setNewItem({
            type: "",
            price: ""
        });
        setErrors({});
        setEditingItem(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};
        if (!newItem || !newItem.type || !newItem.type.trim()) {
            errors.type = "type is required";
        }
        if (!newItem || !newItem.price || !newItem.price.trim()) {
            errors.price = "price is required";
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        if (editingItem) {
            editItemApi(editingItem.itemId, newItem)
                .then(() => {
                    const updatedItems = items.map((item) =>
                        item.itemId === editingItem.itemId ? newItem : item
                    );
                    setItems(updatedItems);
                    setEditingItem(null);
                    setShowAddForm(false);
                    setNewItem({
                        type: "",
                        price: ""
                    });
                    setErrors({});
                })
                .catch((error) => console.error("Error editing item: ", error));
        } else {
            addItemApi(newItem)
                .then(() => {
                    fetchItems();
                    setShowAddForm(false);
                    setNewItem({
                        type: "",
                        price: ""
                    });
                    setErrors({});
                })
                .catch((error) => console.error("Error adding new item: ", error));
        }
    };
    return (
        <div className="item-page">
        <AppBar />
        <div className="d-flex">
            <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
            <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
            <div className="mt-2">
            <h3 className="manage-items-title">Items</h3>
            <div className="button-container">
            <div className="search-bar">
                    <div className="search-input-container">
                        <IoSearch  className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by ID, type, or price..."
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
                        <AddNewItem
                            handleSubmit={handleSubmit}
                            handleCloseForm={handleCloseForm}
                            newItem={newItem}
                            handleInputChange={handleInputChange}
                            errors={errors}
                            editingItem={editingItem}
                        />
                    )}
                    <div className="table-container">
                    <table className="table">
                            <thead>
                                <tr>
                                    {/* <th>Item ID</th> */}
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item, index) => (
                                    
                                    <tr key={index}>
                                        {/* <td>{item.itemId}</td> */}
                                        <td>{item.type}</td>
                                        <td>{item.price}</td>
                                        <td>
                                            <FaEdit className="edit-icon" onClick={() => handleEditItem(item.itemId)} /> 
                                            <FaTrash className="delete-icon" onClick={() => handleDeleteItem(item.itemId)} />
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
