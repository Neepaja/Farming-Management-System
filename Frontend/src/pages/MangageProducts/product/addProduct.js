import React from "react";

export default function AddNewProduct({ handleSubmit, handleCloseForm, newProduct, handleInputChange, errors, editingProduct }) {

    return (
        <div className="popup active">
            <div className="popup-content">
                <h4>{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
                <form onSubmit={handleSubmit}>         
                    <div className="mb-4"></div> 
                    <h5>Product Description</h5>
                    <div className="mb-3"></div> 
                    <div className="form-group row align-items-center">
                        <label htmlFor="productType" className="col-sm-5 col-form-label">Type</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="productType"
                                value={newProduct.productType}
                                onChange={handleInputChange}
                                className={`form-control ${errors.productType && 'is-invalid'}`}
                                placeholder="Type"
                            />
                            {errors.productType && <div className="invalid-feedback">{errors.productType}</div>}
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <label htmlFor="productPrice" className="col-sm-5 col-form-label">Price</label>
                        <div className="col-sm-7">
                            <input
                                type="text"
                                name="productPrice"
                                value={newProduct.productPrice}
                                onChange={handleInputChange}
                                className={`form-control ${errors.productPrice && 'is-invalid'}`}
                                placeholder="Price"
                            />
                            {errors.productPrice && <div className="invalid-feedback">{errors.productPrice}</div>}
                        </div>
                    </div>
                    <div className="mb-4"></div>
                    <button type="submit" className="btn btn-primary mr-2">{editingProduct ? 'Save' : 'Submit'}</button>
                    <button type="button" onClick={handleCloseForm} className="btn btn-secondary">Cancel</button>
                </form>
            </div>
        </div>
    );
};
