import React, { useEffect } from "react";

export default function AddCollection({
    handleSubmit,
    handleCloseForm,
    newCollection,
    handleInputChange,
    errors,
    farmers,
    editingCollection,
    products
}) {

    useEffect(() => {
        const selectedFarmer = farmers.find(farmer => farmer.farmerID === parseInt(newCollection.farmerId));
        if (selectedFarmer) {
            if (newCollection.farmerName !== selectedFarmer.Name) {
                handleInputChange({ target: { name: "farmerName", value: selectedFarmer.Name } });
            }
        }
    }, [newCollection.farmerId, farmers, handleInputChange, newCollection.farmerName]);
    
    return (
        // <div className="popup active">
        //     <div className="popup-content">
        <div className="modal-overlay-add">
            <div className="modal-content-add">
                <h4>{editingCollection ? 'Edit Collection' : 'Add New Collection'}</h4>
                <form onSubmit={handleSubmit}>         
                    <div className="mb-4"></div> 
                    <h5>Collection Details</h5>
                    <div className="mb-3"></div> 
                    <div className="form-group row align-items-center">
                        <label htmlFor="farmerId" className="col-sm-5 col-form-label">Farmer ID</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="farmerId"
                                value={newCollection.farmerId}
                                onChange={handleInputChange}
                                className={`form-control ${errors.farmerId && 'is-invalid'}`}
                                placeholder="Farmer ID"
                            />
                            {errors.farmerId && <div className="invalid-feedback">{errors.farmerId}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="farmerName" className="col-sm-5 col-form-label">Farmer Name</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="farmerName"
                                value={newCollection.farmerName}
                                onChange={handleInputChange}
                                className="form-control"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="collectionDate" className="col-sm-5 col-form-label">Collection Date</label>
                        <div className="col-sm-7">
                            <input
                                type="date"
                                name="collectionDate"
                                value={newCollection.collectionDate}
                                onChange={handleInputChange}
                                className={`form-control ${errors.collectionDate && 'is-invalid'}`}
                                placeholder="Collection Date"
                            />
                            {errors.collectionDate && <div className="invalid-feedback">{errors.collectionDate}</div>}
                        </div>
                    </div>
                    <h5>Product Details</h5>
                    <div className="form-group row align-items-center">
                        <label htmlFor="productType" className="col-sm-5 col-form-label">Product Type</label>
                        <div className="col-sm-7">
                            <select
                                name="productType"
                                value={newCollection.productType}
                                onChange={handleInputChange}
                                className={`form-control ${errors.productType && 'is-invalid'}`}
                            >
                                <option value="">Select Product Type</option>
                                {products.map((product, index) => (
                                    <option key={index} value={product.productType}>{product.productType}</option>
                                ))}
                            </select>
                            {errors.productType && <div className="invalid-feedback">{errors.productType}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="amount" className="col-sm-5 col-form-label">Amount</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="amount"
                                value={newCollection.amount}
                                onChange={handleInputChange}
                                className={`form-control ${errors.amount && 'is-invalid'}`}
                                placeholder="Amount"
                            />
                            {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="totPrice" className="col-sm-5 col-form-label">Total Price</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="totPrice"
                                value={newCollection.totPrice}
                                onChange={handleInputChange}
                                className="form-control"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="mb-4"></div>
                    <button type="submit" className="btn btn-primary mr-2">{editingCollection ? 'Save' : 'Submit'}</button>
                    <button type="button" onClick={handleCloseForm} className="btn btn-secondary">Cancel</button>
                </form>
            </div>
        </div>
    );
}
