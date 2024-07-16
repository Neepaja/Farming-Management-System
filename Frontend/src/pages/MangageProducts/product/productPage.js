import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../../../components/NavigationBar";
import { addProductApi, editProductApi, deleteProductApi } from "../../../services/Api"; 
import AddNewProduct from "./addProduct"; 
import './productPage.css'; 
import AppBar from "../../../components/Appbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function ManageProductPage() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [newProduct, setNewProduct] = useState({
        productType: "",
        productPrice: ""
    });

    const [errors, setErrors] = useState({});
    const [editingProduct, setEditingProduct] = useState(null);
    

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = Array.isArray(products)
        ? searchTerm
            ? products.filter((product) => {
                const searchTermLowerCase = searchTerm.toLowerCase();
                return (
                    product.productId.toString().includes(searchTermLowerCase) ||
                    product.productType.toLowerCase().includes(searchTermLowerCase) ||
                    product.productPrice.toString().includes(searchTermLowerCase)
                );
            })
            : products
        : [];

    const handleDeleteProduct = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            deleteProductApi(id)
                .then(() => {
                    const updatedProducts = products.filter(product => product.productId !== id);
                    setProducts(updatedProducts);
                })
                .catch(error => console.error(error));
        }
    };

    const handleEditProduct = (id) => {
        const productToEdit = products.find(product => product.productId === id);
        if (productToEdit) {
            setEditingProduct(productToEdit);
            setNewProduct({ ...productToEdit });
            setShowAddForm(true);
        }
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
        setNewProduct({
            productType: "",
            productPrice: ""
        });
        setErrors({});
        setEditingProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
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
        if (!newProduct || !newProduct.productType || !newProduct.productType.trim()) {
            errors.productType = "Type is required";
        }
        if (!newProduct || !newProduct.productPrice || !newProduct.productPrice.trim()) {
            errors.productPrice = "Price is required";
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        if (editingProduct) {
            editProductApi(editingProduct.productId, newProduct)
                .then(() => {
                    const updatedProducts = products.map((product) =>
                        product.productId === editingProduct.productId ? newProduct : product
                    );
                    setProducts(updatedProducts);
                    setEditingProduct(null);
                    setShowAddForm(false);
                    setNewProduct({
                        productType: "",
                        productPrice: ""
                    });
                    setErrors({});
                })
                .catch((error) => console.error("Error editing product: ", error));
        } else {
            addProductApi(newProduct)
                .then(() => {
                    fetchProducts();
                    setShowAddForm(false);
                    setNewProduct({
                        productType: "",
                        productPrice: ""
                    });
                    setErrors({});
                })
                .catch((error) => console.error("Error adding new product: ", error));
        }
    };

    return (
        <div className="product-page">
    <AppBar />
        <div className="d-flex">
            <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
            <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
                <div className="mt-2">
                <h3 className="manage-product-title">Products</h3>
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
                            <FontAwesomeIcon icon={faCartPlus} style={{ marginRight: '5px' }} /> Add
                        </button>
                    </div>
                    {showAddForm && (
                        <AddNewProduct
                            handleSubmit={handleSubmit}
                            handleCloseForm={handleCloseForm}
                            newProduct={newProduct}
                            handleInputChange={handleInputChange}
                            errors={errors}
                            editingProduct={editingProduct}
                        />
                    )}
                    <div className="table-container">
                    <table className="table">
                            <thead>
                                <tr>
                                    {/* <th>Product ID</th> */}
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (

                                    <tr key={index}>
                                        {/* <td>{product.productId}</td> */}
                                        <td>{product.productType}</td>
                                        <td>{product.productPrice}</td>
                                        <td>
                                            <FaEdit className="edit-icon" onClick={() => handleEditProduct(product.productId)} />
                                            <FaTrash className="delete-icon" onClick={() => handleDeleteProduct(product.productId)} />
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
