import React, { useState, useEffect } from "react";
import axios from "axios"; 
import NavigationBar from "../../../components/NavigationBar";
import AddCollection from "./addCollection";
import { getCollectionsApi, addCollectionApi, editCollectionApi, deleteCollectionApi } from "../../../services/Api"; // Import API functions
import "./collectionPage.css";
import AppBar from "../../../components/Appbar";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';


export default function ManageCollectionPage() {
    const [collections, setCollections] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [newCollection, setNewCollection] = useState({
        collectionId: "",
        farmerId: "",
        farmerName: "",
        collectionDate: "",
        productType: "",
        amount: "",
        totPrice: ""
    });
    const [errors, setErrors] = useState({});
    const [editingCollection, setEditingCollection] = useState(null);
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const fetchCollections = async () => {
        try {
            const collectionsData = await getCollectionsApi(); // Use API function to fetch collections
            setCollections(collectionsData);
        } catch (error) {
            console.error("Error fetching collections:", error);
        }
    };

    const fetchFarmers = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/farmers");
            setFarmers(response.data);
        } catch (error) {
            console.error("Error fetching farmers:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchCollections();
        fetchFarmers();
        fetchProducts();
    }, []);

    const handleDeleteCollection = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this collection?");
        if (confirmed) {
            try {
                await deleteCollectionApi(id); // Use API function to delete collection
                const updatedCollections = collections.filter(collection => collection.collectionId !== id);
                setCollections(updatedCollections);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
    };

    const handleAddNew = () => {
        setShowAddForm(true);
        setEditingCollection(null);
        setNewCollection({
            collectionId: "",
            farmerId: "",
            farmerName: "",
            collectionDate: "",
            productType: "",
            amount: "",
            totPrice: ""
        });
        setErrors({});
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingCollection(null);
        setNewCollection({
            collectionId: "",
            farmerId: "",
            farmerName: "",
            collectionDate: "",
            productType: "",
            amount: "",
            totPrice: ""
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        

        setNewCollection(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'farmerId') {
            const selectedFarmer = farmers.find(farmer => farmer.farmerID === parseInt(value));
            if (selectedFarmer) {
                setNewCollection(prevState => ({
                    ...prevState,
                    farmerName: selectedFarmer.Name
                }));
            } else {
                setNewCollection(prevState => ({
                    ...prevState,
                    farmerName: "" // Clear farmerName if farmerId is not found
                }));
            }
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
    };

    const SuccessModal = ({ message, onClose }) => {
        return (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>{message}</p>
              <button onClick={onClose}>Close</button>
            </div>
          </div>
        );
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        // if (!newCollection.farmerId || !newCollection.farmerId.trim()) {
        //     errors.farmerId = "Farmer ID is required";
        // }
        
        if (!newCollection.collectionDate || !newCollection.collectionDate.trim()) {
            errors.collectionDate = "Collection date is required";
        }
        if (!newCollection.productType || !newCollection.productType.trim()) {
            errors.productType = "Product type is required";
        }
        if (!newCollection.amount || !newCollection.amount.trim()) {
            errors.amount = "Amount is required";
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
    
        try {

            // Format the date to "yyyy-MM-dd"
        newCollection.collectionDate = new Date(newCollection.collectionDate).toISOString().split('T')[0];
            // Calculate totPrice if it's not already calculated
            if (!newCollection.totPrice) {
                const selectedProduct = products.find(product => product.productType === newCollection.productType);
                if (selectedProduct) {
                    const totPrice = parseFloat(selectedProduct.productPrice) * parseFloat(newCollection.amount);
                    newCollection.totPrice = totPrice.toFixed(2);
                } else {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        productType: "Invalid product type"
                    }));
                    return;
                }
            }
    
            // Add or update collection
            if (editingCollection) {
                await editCollectionApi(editingCollection.collectionId, newCollection); // Send newCollection object directly
            } else {
                await addCollectionApi(newCollection); // Send newCollection object directly
            }
    
            fetchCollections();
            handleCloseForm();
            setSubmissionSuccess(true);
        } catch (error) {
            console.error("Error submitting collection: ", error);
        }
    };    

    const handleEditCollection = (id) => {
        const collectionToEdit = collections.find(collection => collection.collectionId === id);
        if (collectionToEdit) {
            setEditingCollection(collectionToEdit);
            setNewCollection({ ...collectionToEdit });
            setShowAddForm(true);
        }
    };

    const filteredCollections = collections.filter(collection =>
        collection.collectionId.toString().includes(searchTerm) ||
        collection.farmerId.toString().includes(searchTerm) ||
        collection.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.collectionDate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (            
        <div className="product-page">
    <AppBar />
        <div className="d-flex">
            <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
            <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
                <div className="mt-2">
                <h3 className="manage-collection-title">Collections</h3>
                <div className="button-container">
                    <div className="search-bar">
                    <div className="search-input-container">
                    <IoSearch  className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by Farmer ID, Farmer Name..."
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
                        <AddCollection
                            handleSubmit={handleSubmit}
                            handleCloseForm={handleCloseForm}
                            newCollection={newCollection}
                            handleInputChange={handleInputChange}
                            errors={errors}
                            farmers={farmers}
                            products={products}
                            editingCollection={editingCollection}
                    //     />
                    // )}
                    />
                )}
                {submissionSuccess && (
                    <SuccessModal
                        message="Collection submitted successfully!"
                        onClose={() => setSubmissionSuccess(false)}
                    />
                )}
                    <div className="table-container">
                    <table className="table">
                            <thead>
                                <tr>
                                    <th>Farmer ID</th>
                                    <th>Farmer Name</th>
                                    <th>Collection Date</th>
                                    <th>Product Type</th>
                                    <th>Amount</th>
                                    <th>Total Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCollections.map((collection, index) => (
                                    <tr key={index}>
                                        <td>{collection.farmerId}</td>
                                        <td>{collection.farmerName}</td>
                                        <td>{formatDate(collection.collectionDate)}</td> 
                                        <td>{collection.productType}</td>
                                        <td>{collection.amount}</td>
                                        <td>{collection.totPrice}</td>
                                        <td>
                                            <FaEdit className="edit-icon" onClick={() => handleEditCollection(collection.collectionId)} /> 
                                            <FaTrash className="delete-icon" onClick={() => handleDeleteCollection(collection.collectionId)} />
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
