import React, { useState, useEffect } from "react";
import axios from "axios"; // Add this line to import axios
import { addFarmerApi, editFarmerApi, deleteFarmerApi } from "../services/Api";
import AddNewFarmer from "./AddNewFarmer"; // Import components
import NavigationBar from "../components/NavigationBar";
import { useNavigate } from 'react-router-dom';
import "./View"; // Import any styles or other modules
import './Managefarmerpage.css'; // Import CSS file
import AppBar from "../components/Appbar";
import { FaEdit, FaEye } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FaTrash } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";

function SuccessMessagePopup({ onClose }) {
    return (
        <div className="success-popup">
            <div className="success-message">
                <p>Farmer details submitted successfully!</p>
                <button className="btn btn-close" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

export default function ManageFarmerPage() {
    const [farmers, setFarmers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [newFarmer, setNewFarmer] = useState({
        name: "",
        age: "",
        gender: "",
        address: "",
        phoneNumber: "",
        email: "",
        maxEducation: "", 
        familyMembersMan: "",
        familyMembersWoman: "",
        familyMembersChild: "",
        familyLabourMan: "",
        familyLabourWoman: "",
        familyLabourChild: "",
        province: "",
        district: "",
        dsDivision: "",
        gnDivision: "",
        village: "",
        ascDivision: "",
        aiRange: "",
        extent: "",
        landOwnership: "",
        fencingType: "",
        waterSource: "",
        cropsGrown: [],
        livestock: [],
        farmingAssets: []
    });
    
    const [cropsGrown, setCropsGrown] = useState([]);
    const [livestock, setLivestock] = useState([]);
    const [farmingAssets, setFarmingAssets] = useState([]);
    const [errors, setErrors] = useState({});
    const [editingFarmer, setEditingFarmer] = useState(null);
    const navigate = useNavigate();

    // Function to fetch the list of farmers
    const fetchFarmers = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/farmers");
            setFarmers(response.data);
        } catch (error) {
            console.error("Error fetching farmers:", error);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);


    // // Check if farmers is an array and not null or undefined before using the filter method
    // const filteredFarmers = Array.isArray(farmers)
    // ? searchTerm
    //     ? farmers.filter((farmer) => {
    //         const searchTermLowerCase = searchTerm.toLowerCase();
    //         return (
    //             farmer.FarmerID.toString().includes(searchTermLowerCase) ||
    //             farmer.Name.toLowerCase().includes(searchTermLowerCase) ||
    //             //farmer.Age.toString().includes(searchTermLowerCase) ||
    //             farmer.Gender.toLowerCase().includes(searchTermLowerCase) ||
    //             farmer.Address.toLowerCase().includes(searchTermLowerCase) 
    //             //farmer.PhoneNumber.toLowerCase().includes(searchTermLowerCase) ||
    //             //farmer.Email.toLowerCase().includes(searchTermLowerCase)
    //         );
    //     })
    //     : farmers
    // : [];
    const filteredFarmers = Array.isArray(farmers) && farmers.length > 0
  ? searchTerm
      ? farmers.filter((farmer) => {
          const searchTermLowerCase = searchTerm.toLowerCase();
          return (
              (farmer.FarmerID && farmer.FarmerID.toString().includes(searchTermLowerCase)) ||
              (farmer.Name && farmer.Name.toLowerCase().includes(searchTermLowerCase)) ||
              //(farmer.Age && farmer.Age.toString().includes(searchTermLowerCase)) ||
              (farmer.Gender && farmer.Gender.toLowerCase().includes(searchTermLowerCase)) ||
              (farmer.Address && farmer.Address.toLowerCase().includes(searchTermLowerCase))
              //(farmer.PhoneNumber && farmer.PhoneNumber.toLowerCase().includes(searchTermLowerCase)) ||
              //(farmer.Email && farmer.Email.toLowerCase().includes(searchTermLowerCase))
          );
      })
      : farmers
  : [];


    // Function to delete a farmer
    const handleDeleteFarmer = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this farmer?");
        if (confirmed) {
            deleteFarmerApi(id) // Using deleteFarmerApi function to delete a farmer
                .then(() => {
                    const updatedFarmers = farmers.filter(farmer => farmer.FarmerID !== id);
                    setFarmers(updatedFarmers);
                })
                .catch(error => console.error(error));
        }
    };

    // Function to edit a farmer
    const handleEditFarmer = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/farmers/${id}`);
            const farmerDetails = response.data;

            // Check if the farmer details are retrieved successfully
            if (farmerDetails && farmerDetails.farmer) {
                setEditingFarmer(farmerDetails.farmer);
                // Set newFarmer state with the values of the farmer to be edited
                setNewFarmer({ ...farmerDetails.farmer }); 
                setShowAddForm(true); // Show the form for editing
            } else {
                console.error('Error fetching farmer details:', response);
            }
        } catch (error) {
            console.error('Error editing farmer:', error);
        }
    };

    // view function
    const handleViewFarmer = async (id) => {
        try{
            const response = await axios.get(`http://localhost:3001/api/farmers/${id}`);
            const farmerDetails = response.data;
            console.log(farmerDetails);
        navigate(`/view/${id}`, { state: { farmer: farmerDetails } }); // Pass farmer object as prop
    }catch (error){
        console.error('Error viewing farmer:', error);
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
        setNewFarmer({
            name: "",
            age: "",
            gender: "",
            address: "",
            phoneNumber: "",
            email: "",
            maxEducation: "", 
            familyMembersMan: "",
            familyMembersWoman: "",
            familyMembersChild: "",
            familyLabourMan: "",
            familyLabourWoman: "",
            familyLabourChild: "",
            province: "",
            district: "",
            dsDivision: "",
            gnDivision: "",
            village: "",
            ascDivision: "",
            aiRange: "",
            extent: "",
            landOwnership: "",
            fencingType: "",
            waterSource: "",
            cropsGrown: [],
            livestock: [],
            farmingAssets: []
        });
        setErrors({});
        setEditingFarmer(null); // Reset editing farmer when closing the form
    };


    const handleCropsGrownInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...cropsGrown];
        const part = name.split('_');
        list[index][part[0]] = value;
    
        setCropsGrown(list);  
    
        setNewFarmer(prevState => ({
            ...prevState,
            cropsGrown: list
        }));
    
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
        
        console.log('cropsGrown list:', list);
        console.log('newFarmer cropsGrown:', newFarmer.cropsGrown);
    };

    const handleAddCropsGrown = () => {
        setCropsGrown([...cropsGrown, { cropName: '', extent: '' }]);
    };

    const handleFarmingAssetsInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...farmingAssets];
        const part = name.split('_');
        list[index][part[0]] = value;
    
        setFarmingAssets(list);  
    
        setNewFarmer(prevState => ({
            ...prevState,
            farmingAssets: list
        }));
    
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
        
        console.log('farmingAssets list:', list);
        console.log('newFarmer farmingAssets:', newFarmer.farmingAssets);
    };


    const handleAddFarmingAssets = () => {
        setFarmingAssets([...farmingAssets, { assetName: '', quantity: '' }]);
    };

    const handleLivestockInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...livestock];
        const part = name.split('_');
        list[index][part[0]] = value;
    
        setLivestock(list);  
    
        setNewFarmer(prevState => ({
            ...prevState,
            livestock: list
        }));
    
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ""
        }));
        
        console.log('livestock list:', list);
        console.log('newFarmer livestock:', newFarmer.livestock);
    };
   

    const handleAddLivestock = () => {
        setLivestock([...livestock, { livestockType: '', quantity: '' }]);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Input name:"+ name +", "+ value);
        setNewFarmer(prevState => ({
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
        
      
        if (!newFarmer || !newFarmer.Name || !newFarmer.Name.trim()) {
          errors.Name = "Name is required";
        }
        if (!newFarmer || !newFarmer.PhoneNumber || !newFarmer.PhoneNumber.trim()) {
          errors.phoneNumber = "Phone Number is required";
        }
        if (Object.keys(errors).length > 0) {
          setErrors(errors);
          return;
        }
       console.log(newFarmer);
        const resetForm = () => {
          setNewFarmer({
            name: "",
            age: "",
            gender: "",
            address: "",
            phoneNumber: "",
            email: "",
            maxEducation: "",
            familyMembersMan: "",
            familyMembersWoman: "",
            familyMembersChild: "",
            familyLabourMan: "",
            familyLabourWoman: "",
            familyLabourChild: "",
            province: "",
            district: "",
            dsDivision: "",
            gnDivision: "",
            village: "",
            ascDivision: "",
            aiRange: "",
            extent: "",
            landOwnership: "",
            fencingType: "",
            waterSource: "",
            cropsGrown: [],
            livestock: [],
            farmingAssets: []
          });
          setErrors({});
        };
        
        if (editingFarmer) {
          // Update existing farmer
          editFarmerApi(editingFarmer.FarmerID, newFarmer) // Using editFarmerApi function to edit a farmer
            .then(() => {
              const updatedFarmers = farmers.map((farmer) =>
                farmer.FarmerID === editingFarmer.FarmerID ? { ...newFarmer, FarmerID: editingFarmer.FarmerID } : farmer
              );
              setFarmers(updatedFarmers);
              setEditingFarmer(null); // Clear editing state
              setShowAddForm(false);
              resetForm();
            })
            .catch((error) => console.error("Error editing farmer: ", error));
        } else {
          // Add new farmer
          newFarmer.cropsGrown = cropsGrown;
          newFarmer.farmingAssets = farmingAssets;
          newFarmer.livestock = livestock;
          addFarmerApi(newFarmer) // Using addFarmerApi function to add a new farmer
            .then(() => {
              fetchFarmers(); // Fetch the updated list of farmers
              setShowAddForm(false);
              resetForm();
              handleShowSuccessMessage(); 
            })
            .catch((error) => console.error("Error adding new farmer: ", error));
        }
      };
      

    const handleShowSuccessMessage = () => {
        setShowSuccessMessage(true);
    };
    
    const handleCloseSuccessMessage = () => {
        setShowSuccessMessage(false);
    };

   
    
    return ( 
        <div className="status-analysis-page">
        <AppBar />
        <div className="d-flex">
            <NavigationBar isMinimized={isSidebarMinimized} setIsMinimized={setIsSidebarMinimized} />
            <main role="main" className={`container ${isSidebarMinimized ? 'minimized' : 'expanded'}`}>
                {showSuccessMessage && <SuccessMessagePopup onClose={handleCloseSuccessMessage} />}
                <div className="mt-2">
                    <h2 className="manage-farmers-title">Farmers</h2>
                    <div className="button-container">
                    <div className="search-bar">
                    <div className="search-input-container">
                        {/* <IoSearch  className="search-icon" /> */}
                        <input
                            type="text"
                            placeholder="Search by Name, or address..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control search-input"
                        />
                    </div>
                </div>
                <button 
                    className="btn addnew-btn" 
                    onClick={handleAddNew}
                >
                    <FontAwesomeIcon icon={faUserPlus} /> Add
                </button>
                </div>
                    {showAddForm && (
                        <AddNewFarmer
                            handleSubmit={handleSubmit}
                            handleCloseForm={handleCloseForm}
                            newFarmer={newFarmer}
                            handleInputChange={handleInputChange}
                            errors={errors}
                            editingFarmer={editingFarmer}
                            handleCropsGrownInputChange = {handleCropsGrownInputChange}
                            handleAddCropsGrown = {handleAddCropsGrown}
                            cropsGrown = {cropsGrown}
                        />
                    )}
                    <div className="table-container">
                    <table className="table">
                            <thead>
                                <tr>
                                    <th>Farmer ID</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Address</th> 
                                    <th>Phone Number</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFarmers.map((farmer, index) => (
                                    <tr key={index}>
                                        <td>{farmer.farmerID}</td>
                                        <td>{farmer.Name}</td>
                                        <td>{farmer.Age}</td>
                                        <td>{farmer.Gender}</td>
                                        <td>{farmer.Address}</td>
                                        <td>{farmer.PhoneNumber}</td> 
                                        <td>
                                            <FaEdit className="edit-icon" onClick={() => handleEditFarmer(farmer.farmerID)} /> 
                                            {/* <FaTrash className="delete-icon" onClick={() => handleDeleteFarmer(farmer.farmerID)} /> */}
                                            <FaEye className="view-icon" onClick={() => handleViewFarmer(farmer.farmerID)} /> 
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
