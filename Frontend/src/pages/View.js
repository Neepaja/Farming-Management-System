import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import "./View.css"

const View = () => {

    const Location = useLocation();
    const farmer = Location.state.farmer.farmer; 
    


    if (!farmer) {
        return <div>No farmer data available</div>;
    }

    return (
        <div className="view-container">
            <div className="details-wrapper">
                <div>
                    <h2>View Farmer Details</h2>
                    <hr className="my-4" />

                    {/* Personal Details */}
                    <h4 className="heading">Personal Details</h4>
                    <div className="details-container">
                        <div className="detail">
                            <strong>Farmer ID:</strong>
                            <span>{farmer.FarmerID}</span>
                        </div>
                        <div className="detail">
                            <strong>Name:</strong>
                            <span>{farmer.Name}</span>
                        </div>
                        <div className="detail">
                            <strong>Phone Number:</strong>
                            <span>{farmer.PhoneNumber}</span>
                        </div>
                        <div className="detail">
                            <strong>Age:</strong>
                            <span>{farmer.Age}</span>
                        </div>
                        <div className="detail">
                            <strong>Gender:</strong>
                            <span>{farmer.Gender}</span>
                        </div>
                        <div className="detail">
                            <strong>Address:</strong>
                            <span>{farmer.Address}</span>
                        </div>
                        <div className="detail">
                            <strong>Email:</strong>
                            <span>{farmer.Email}</span>
                        </div>
                        <div className="detail">
                            <strong>Education Level:</strong>
                            <span>{farmer.MaxEducation}</span>
                        </div>
                    </div>

                    {/* Family Details */}
                    <hr className="my-4" />
                    <h4 className="heading">Family Details</h4>
                    <div className="details-container">
                        <div className="detail">
                            <strong>No. of Male:</strong>
                            <span>{farmer.FamilyMembersMan}</span>
                        </div>
                        <div className="detail">
                            <strong>No. of Female:</strong>
                            <span>{farmer.FamilyMembersWoman}</span>
                        </div>
                        <div className="detail">
                            <strong>No. of Children:</strong>
                            <span>{farmer.FamilyMembersChild}</span>
                        </div>
                        <div className="detail">
                            <strong>Family Labour Availability (Male):</strong>
                            <span>{farmer.FamilyLabourMan}</span>
                        </div>
                        <div className="detail">
                            <strong>Family Labour Availability (Female):</strong>
                            <span>{farmer.FamilyLabourWoman}</span>
                        </div>
                        <div className="detail">
                            <strong>Family Labour Availability (Child):</strong>
                            <span>{farmer.FamilyLabourChild}</span>
                        </div>
                    </div>

                    {/* Location Details */}
                    <hr className="my-4" />
                    <h4 className="heading">Location Details</h4>
                    <div className="details-container">
                        <div className="detail">
                            <strong>Province:</strong>
                            <span>{farmer.Province}</span>
                        </div>
                        <div className="detail">
                            <strong>District:</strong>
                            <span>{farmer.District}</span>
                        </div>
                        <div className="detail">
                            <strong>DS Division:</strong>
                            <span>{farmer.DSDivision}</span>
                        </div>
                        <div className="detail">
                            <strong>GN Division:</strong>
                            <span>{farmer.GNDivision}</span>
                        </div>
                        <div className="detail">
                            <strong>Village:</strong>
                            <span>{farmer.Village}</span>
                        </div>
                        <div className="detail">
                            <strong>ASC Division:</strong>
                            <span>{farmer.ASCDivision}</span>
                        </div>
                        <div className="detail">
                            <strong>AI Range:</strong>
                            <span>{farmer.AIRange}</span>
                        </div>
                    </div>

                    {/* Farming Information */}
                    <hr className="my-4" />
                    <h4 className="heading">Farming Information</h4>
                    <div className="details-container">
                        <div className="detail">
                            <strong>Extent (in acres):</strong>
                            <span>{farmer.Extent}</span>
                        </div>
                        <div className="detail">
                            <strong>Land Ownership:</strong>
                            <span>{farmer.LandOwnership}</span>
                        </div>
                        <div className="detail">
                            <strong>Fencing Type:</strong>
                            <span>{farmer.FencingType}</span>
                        </div>
                        <div className="detail">
                            <strong>Water Source:</strong>
                            <span>{farmer.WaterSource}</span>
                        </div>
                    </div>

                    {/* Crops Grown */}
                    {farmer.CropsGrown && farmer.CropsGrown.length > 0 && (
                        <>
                            <hr className="my-4" />
                            <h4 className="heading">Crops Grown</h4>
                            <div className="details-container">
                                {farmer.CropsGrown.map((crop, index) => (
                                    <div key={index} className="detail">
                                        <strong>{crop.CropName}:</strong>
                                        <span>{crop.Extent}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Livestock */}
                    {farmer.Livestock && farmer.Livestock.length > 0 && (
                        <>
                            <hr className="my-4" />
                            <h4 className="heading">Livestock</h4>
                            <div className="details-container">
                                {farmer.Livestock.map((livestock, index) => (
                                    <div key={index} className="detail">
                                        <strong>{livestock.LivestockType}:</strong>
                                        <span>{livestock.Quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Farming Assets */}
                    {farmer.FarmingAssets && farmer.FarmingAssets.length > 0 && (
                        <>
                            <hr className="my-4" />
                            <h4 className="heading">Farming Assets</h4>
                            <div className="details-container">
                                {farmer.FarmingAssets.map((asset, index) => (
                                    <div key={index} className="detail">
                                        <strong>{asset.AssetName}:</strong>
                                        <span>{asset.Quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Go Back Button */}
                <div className="go-back-button">
                    <Link to="/manage-farmer" className="btn btn-secondary">Go Back</Link>
                </div>
            </div>
        </div>
    );

};

export default View;
