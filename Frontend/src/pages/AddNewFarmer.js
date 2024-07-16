import React from "react";


export default function AddNewFarmer({ handleSubmit, handleCloseForm, newFarmer, handleInputChange,  errors, editingFarmer, handleCropsGrownInputChange, handleAddCropsGrown, cropsGrown , handleFarmingAssetsInputChange, handleAddFarmingAssets, farmingAssets, handleLivestockInputChange, handleAddLivestock, livestock }) {
  
    return (
    <div className="modal-overlay-add">
            <div className="modal-content-add">
                <h4>{editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}</h4>
                <form onSubmit={handleSubmit}>         
                    <div className="mb-4"></div> 
                    <h5>Personal Description</h5>
                    <div className="mb-3"></div> 
                    <div className="form-group row align-items-center">
                        <label htmlFor="name" className="col-sm-5 col-form-label">Name</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="Name"
                                value={newFarmer.Name}
                                onChange={handleInputChange}
                                className={`form-control ${errors.Name && 'is-invalid'}`}
                                placeholder="Name"
                            />
                            {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="age" className="col-sm-5 col-form-label">Age</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="Age"
                                value={newFarmer.Age}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Age"
                            />
                        </div>
                    </div>                                              
                    <div className="form-group row align-items-center">
                        <label htmlFor="gender" className="col-sm-5 col-form-label">Gender</label>
                        <div className="col-sm-7">
                            <select
                                name="Gender"
                                value={newFarmer.Gender}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="address" className="col-sm-5 col-form-label">Address</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="Address"
                                value={newFarmer.Address}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Address"
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="phoneNumber" className="col-sm-5 col-form-label">Phone Number</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="PhoneNumber"
                                value={newFarmer.PhoneNumber}
                                onChange={handleInputChange}
                                className={`form-control ${errors.phoneNumber && 'is-invalid'}`}
                                placeholder="Phone Number"
                            />
                            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="email" className="col-sm-5 col-form-label">Email</label>
                        <div className="col-sm-7">
                            <input
                                type="email"
                                name="Email"
                                value={newFarmer.Email}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Email"
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="maxEducation" className="col-sm-5 col-form-label">Education Level</label>
                        <div className="col-sm-7">
                            <select
                                name="MaxEducation"
                                value={newFarmer.MaxEducation}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select education level</option>
                                <option value="School level">School level</option>
                                <option value="G.C.E(O/L)">G.C.E(O/L)</option>
                                <option value="G.C.E(A/L)">G.C.E(A/L)</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Graduates">Graduates</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4"></div>
                    <h6>No. of Family Members</h6>
                    <div className="mb-3"></div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="familyMembersMale" className="col-sm-5 col-form-label">Male</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="FamilyMembersMale"
                                value={newFarmer.FamilyMembersMale}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Male"
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="familyMembersFemale" className="col-sm-5 col-form-label">Female</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="FamilyMembersFemale"
                                value={newFarmer.FamilyMembersFemale}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Female"
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="familyMembersChild" className="col-sm-5 col-form-label">Children</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="FamilyMembersChild"
                                value={newFarmer.FamilyMembersChild}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Children"
                            />
                        </div>
                    </div>
                    <div className="mb-4"></div>
                    <h6>Family Labour availability</h6>
                    <div className="mb-3"></div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="familyLabourMan" className="col-sm-5 col-form-label">Male</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="FamilyLabourMan"
                                value={newFarmer.FamilyLabourMan}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Male"
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="FamilyLabourWoman" className="col-sm-5 col-form-label">Female</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="FamilyLabourWoman"
                                value={newFarmer.FamilyLabourWoman}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Female"
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="familyLabourChild" className="col-sm-5 col-form-label">Child</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="FamilyLabourChild"
                                value={newFarmer.FamilyLabourChild}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Child"
                            />
                        </div>
                    </div>
                    <div className="mb-4"></div>
                <h5>Location Description</h5>
                <div className="mb-3"></div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="province" className="col-sm-5 col-form-label">Province</label>
                        <div className="col-sm-7">
                            <select
                                name="Province"
                                value={newFarmer.Province}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select Province</option>
                                <option value="Northern">Northern</option>
                                <option value="North Western">North Western</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="district" className="col-sm-5 col-form-label">District</label>
                        <div className="col-sm-7">
                            <select
                                name="District"
                                value={newFarmer.District}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select District</option>
                                <option value="Jaffna">Jaffna</option>
                                <option value="Kilinochchi">Kilinochchi</option>
                                <option value="Vavuniya">Vavuniya</option>
                                <option value="Mullaitivu">Mullaitivu</option>
                                <option value="Mannar">Mannar</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="dsDivision" className="col-sm-5 col-form-label">DS Division</label>
                        <div className="col-sm-7">
                            <select
                                name="DSDivision"
                                value={newFarmer.DSDivision}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select DS Division</option>
                                <option value="Vali-East-Tellipalai">Vali-East-Tellipalai</option>
                                <option value="Vali-East-Kopay">Vali-East-Kopay</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="gnDivision" className="col-sm-5 col-form-label">GN Division</label>
                        <div className="col-sm-7">
                            <select
                                name="GNDivision"
                                value={newFarmer.GNDivision}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select GN Division</option>
                                <option value="J/260">J/260</option>
                                <option value="J/270">J/270</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="village" className="col-sm-5 col-form-label">Village</label>
                        <div className="col-sm-7">
                            <select
                                name="Village"
                                value={newFarmer.Village}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select Village</option>
                                <option value="Irupalai">Irupalai</option>
                                <option value="Siruppiddi">Siruppiddi</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="ascDivision" className="col-sm-5 col-form-label">ASC Division</label>
                        <div className="col-sm-7">
                            <select
                                name="ASCDivision"
                                value={newFarmer.ASCDivision}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select ASC Division</option>
                                <option value="Vali-East">Vali-East</option>
                                <option value="Vali-North">Vali-North</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="aiRange" className="col-sm-5 col-form-label">AI Range</label>
                        <div className="col-sm-7">
                            <select
                                name="AIRange"
                                value={newFarmer.AIRange}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select AI Range</option>
                                <option value="Urumpirai">Urumpirai</option>
                                <option value="Neervely">Neervely</option>
                                <option value="Kopay">Kopay</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4"></div>
                    <h5>Farm Description</h5>
                    <div className="mb-3"></div>              
                    <div className="form-group row align-items-center">
                        <label htmlFor="extent" className="col-sm-5 col-form-label">Extent (in acres)</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="Extent"
                                value={newFarmer.Extent}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="in acres"
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="landOwnership" className="col-sm-5 col-form-label">Land Ownership</label>
                        <div className="col-sm-7">
                            <select
                                name="LandOwnership"
                                value={newFarmer.LandOwnership}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select land ownership</option>
                                <option value="Owner">Owner</option>
                                <option value="Lease">Lease</option>
                                <option value="Rent">Rent</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="fencingType" className="col-sm-5 col-form-label">Fencing Type</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="FencingType"
                                value={newFarmer.FencingType}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Enter fencing type"
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="waterSource" className="col-sm-5 col-form-label">Water Source</label>
                        <div className="col-sm-7">
                            <select
                                name="WaterSource"
                                value={newFarmer.WaterSource}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Select water source</option>
                                <option value="well">Well</option>
                                <option value="borewell">Borewell</option>
                                <option value="pond">Pond</option>
                                <option value="other">Ditch</option>
                            </select>
                        </div>
                    </div>
            <div>
                <h6>Crops Grown</h6>
                {cropsGrown.map((crop, index) => (
                    <div key={index} className="form-row mb-3">
                        <div className="col">
                            <input
                                type="text"
                                name={`CropName_${index}`}
                                value={crop.CropName}
                                onChange={(e) => handleCropsGrownInputChange(index, e)}
                                className="form-control"
                                placeholder="Crop Name"
                            />
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                name={`Extent_${index}`}
                                value={crop.Extent}
                                onChange={(e) => handleCropsGrownInputChange(index, e)}
                                className="form-control"
                                placeholder="Extent"
                            />
                        </div>
                    </div>
                ))}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ 
                                backgroundColor: 'lightgray', // Transparent background
                                color: 'black', // Text color
                                padding: '5px 10px', // Adjust padding
                                borderRadius: '5px', // Rounded corners
                                fontSize: '14px', // Font size
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={handleAddCropsGrown}
                        >
                            Add Crop
                        </button>
                    </div>
                {/* <div>
                <div className="mb-4"></div>
                <h6>Livestock</h6>
                {livestock.map((animal, index) => (
                    <div key={index} className="form-row mb-3">
                        <div className="col">
                            <input
                                type="text"
                                name={`LivestockType_${index}`}
                                value={animal.LivestockType}
                                onChange={(e) => handleLivestockInputChange(index, e)}
                                className="form-control"
                                placeholder="Livestock Type"
                            />
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                name={`Quantity_${index}`}
                                value={animal.Quantity}
                                onChange={(e) => handleLivestockInputChange(index, e)}
                                className="form-control"
                                placeholder="Quantity"
                            />
                        </div>
                    </div>
                ))}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ 
                                backgroundColor: 'lightgray', // Transparent background
                                color: 'black', // Text color
                                padding: '5px 10px', // Adjust padding
                                borderRadius: '5px', // Rounded corners
                                fontSize: '14px', // Font size
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={handleAddLivestock}
                        >
                            Add Livestock
                        </button>
                    </div> */}
                {/* <div>
                <div className="mb-4"></div>
                <h6>Farming Assets</h6>
                {farmingAssets.map((asset, index) => (
                    <div key={index} className="form-row mb-3">
                        <div className="col">
                            <input
                                type="text"
                                name={`AssetName_${index}`}
                                value={asset.AssetName}
                                onChange={(e) => handleFarmingAssetsInputChange(index, e)}
                                className="form-control"
                                placeholder="Asset Name"
                            />
                        </div>
                        <div className="col">
                            <input
                                type="text"
                                name={`AssetQuantity_${index}`}
                                value={asset.Quantity}
                                onChange={(e) => handleFarmingAssetsInputChange(index, e)}
                                className="form-control"
                                placeholder="Quantity"
                            />
                        </div>
                    </div>
                ))}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ 
                                backgroundColor: 'lightgray', // Transparent background
                                color: 'black', // Text color
                                padding: '5px 10px', // Adjust padding
                                borderRadius: '5px', // Rounded corners
                                fontSize: '14px', // Font size
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={handleAddFarmingAssets}
                        >
                            Add Farming Asset
                        </button>
                                </div> */}
                    <div className="mb-4"></div>
                    <button type="submit" className="btn btn-primary mr-2">{editingFarmer ? 'Save' : 'Submit'}</button>
                    <button type="button" onClick={handleCloseForm} className="btn btn-secondary">Cancel</button>
                </form>
            </div>
        </div>
        
    );
};

