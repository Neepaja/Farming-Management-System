import React, { useState, useEffect } from "react";

export default function AddNewSupply({ handleSubmit, handleCloseForm, newSupply, handleInputChange, errors, editingSupply, items }) {
    const [typeQuantities, setTypeQuantities] = useState([{ type: "", quantity: "" }]);

    useEffect(() => {
        if (editingSupply && editingSupply.typeQuantities) {
            setTypeQuantities(editingSupply.typeQuantities);
        }
    }, [editingSupply]);

    const handleAddTypeQuantity = () => {
        setTypeQuantities([...typeQuantities, { type: "", quantity: "" }]);
    };

    const handleRemoveTypeQuantity = (index) => {
        const updatedTypeQuantities = [...typeQuantities];
        updatedTypeQuantities.splice(index, 1);
        setTypeQuantities(updatedTypeQuantities);
    };

    const handleTypeQuantityChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTypeQuantities = [...typeQuantities];
        updatedTypeQuantities[index] = { ...updatedTypeQuantities[index], [name]: value };
        setTypeQuantities(updatedTypeQuantities);
        // newSupply.quantity = value;
        // newSupply.type = name;
    };

    const calculateUnitTotalPrice = (type, quantity) => {
        const item = items.find((item) => item.type === type);
        if (item) {
            return (item.price * parseInt(quantity)).toFixed(2);
        }
        return "0.00";
    };


    const calculateTotalPrice = () => {
        let totalPrice = 0;
        typeQuantities.forEach(({ type, quantity }) => {
            const item = items.find((item) => item.type === type);
            if (item) {
                totalPrice += item.price * parseInt(quantity);
            }
        });
        return totalPrice.toFixed(2);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const supplyData = {
            ...newSupply,
            typeQuantities,
            totalPrice: calculateTotalPrice()
        };
        console.log(supplyData);
        handleSubmit(e, supplyData);
        
    };

    return (
            <div className="modal-overlay-add">
            <div className="modal-content-add">
                <h4>{editingSupply ? 'Edit Supply' : 'Add New Supply'}</h4>
                <form onSubmit={handleFormSubmit}> {/* Use handleFormSubmit to handle submission */}
                    <div className="mb-4"></div>
                    <h5>Supply Description</h5>
                    <div className="mb-3"></div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="farmerId" className="col-sm-5 col-form-label">Farmer ID</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="farmerId"
                                value={newSupply.farmerId}
                                onChange={handleInputChange}
                                className={`form-control ${errors.farmerId && 'is-invalid'}`}
                                placeholder="Farmer ID"
                            />
                            {errors.farmerId && <div className="invalid-feedback">{errors.farmerId}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="issuedDate" className="col-sm-5 col-form-label">Issued Date</label>
                        <div className="col-sm-7">
                            <input
                                type="date"
                                name="issuedDate"
                                value={newSupply.IssuedDate}
                                onChange={handleInputChange}
                                className={`form-control ${errors.issuedDate && 'is-invalid'}`}
                                placeholder="Issued Date"
                            />
                            {errors.issuedDate && <div className="invalid-feedback">{errors.issuedDate}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="type" className="col-sm-5 col-form-label">Type</label>
                        <div className="col-sm-7">
                            {typeQuantities.map((typeQuantity, index) => (
                                <div key={index} className="d-flex align-items-center">
                                    <select
                                        type="text"
                                        name="type"
                                        value={typeQuantity.type}
                                        onChange={(e) => handleTypeQuantityChange(index, e)}
                                        className={`form-control ${errors.type && 'is-invalid'}`}
                                    >
                                        <option value="">Select Type</option>
                                        {items.map((item, index) => (
                                            <option key={index} value={item.type}>{item.type}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={typeQuantity.quantity}
                                        onChange={(e) => handleTypeQuantityChange(index, e)}
                                        className={`form-control ml-2 ${errors.quantity && 'is-invalid'}`}
                                        placeholder="Quantity"
                                    />
                                    <input
                                        type="text"
                                        name="unittotalPrice"
                                        value={calculateUnitTotalPrice(typeQuantity.type, typeQuantity.quantity) }
                                        readOnly
                                        className={`form-control`}
                                    />
                                    {typeQuantities.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTypeQuantity(index)}
                                            className="btn btn-danger ml-2"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={handleAddTypeQuantity} className="btn btn-secondary mt-2">Add Type</button>
                            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="totalPrice" className="col-sm-5 col-form-label">Total Price</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="totalPrice"
                                value={calculateTotalPrice() == 0?newSupply.totalPrice:calculateTotalPrice() }
                                readOnly
                                className={`form-control`}
                            />
                        </div>
                    </div>
                    <div className="mb-4"></div>
                    <button type="submit" className="btn btn-primary mr-2">{editingSupply ? 'Save' : 'Submit'}</button>
                    <button type="button" onClick={handleCloseForm} className="btn btn-secondary">Cancel</button>
                </form>
            </div>
        </div>
    );
}
