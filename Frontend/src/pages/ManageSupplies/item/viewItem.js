import React from 'react';
import { useLocation } from 'react-router-dom';
import "./viewItem.css"

const ViewItem = () => {
    const location = useLocation();
    const item = location.state.item; 

    if (!item) {
        return <div>No item data available</div>;
    }

    return (
        <div className="view-container">
            <h2>View Item Details</h2>
            <hr className="my-4" />
            <div className="mb-4"></div>
            <h4 className="heading">Item Details</h4>
            <div className="details-container">
                <div className="detail">
                    <strong>Item ID  :</strong>
                    <span>{item.itemId}</span>
                </div>
                <div className="detail">
                    <strong>Type  :</strong>
                    <span>{item.type}</span>
                </div>
                <div className="detail">
                    <strong>Price  :</strong>
                    <span>{item.price}</span>
                </div>
            </div>
        </div>
    );
};

export default ViewItem;
