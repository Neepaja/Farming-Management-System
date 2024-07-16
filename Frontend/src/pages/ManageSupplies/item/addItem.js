import React from "react";

export default function AddNewItem({ handleSubmit, handleCloseForm, newItem, handleInputChange, errors, editingItem }) {

    return (
        <div className="popup active">
            <div className="popup-content">
                <h4>{editingItem ? 'Edit Item' : 'Add New Item'}</h4>
                <form onSubmit={handleSubmit}>         
                    <div className="mb-4"></div> 
                    <h5>Item Description</h5>
                    <div className="mb-3"></div> 
                    <div className="form-group row align-items-center">
                        <label htmlFor="type" className="col-sm-5 col-form-label">Type</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="type"
                                value={newItem.type}
                                onChange={handleInputChange}
                                className={`form-control ${errors.Type && 'is-invalid'}`}
                                placeholder="Type"
                            />
                            {errors.Type && <div className="invalid-feedback">{errors.Type}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="price" className="col-sm-5 col-form-label">Price</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="price"
                                value={newItem.price}
                                onChange={handleInputChange}
                                className={`form-control ${errors.Price && 'is-invalid'}`}
                                placeholder="Price"
                            />
                            {errors.Price && <div className="invalid-feedback">{errors.Price}</div>}
                        </div>
                    </div>
                    <div className="mb-4"></div>
                    <button type="submit" className="btn btn-primary mr-2">{editingItem ? 'Save' : 'Submit'}</button>
                    <button type="button" onClick={handleCloseForm} className="btn btn-secondary">Cancel</button>
                </form>
            </div>
        </div>
    );
};
