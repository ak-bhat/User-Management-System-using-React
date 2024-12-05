import React from 'react';

const ProductCard = ({ title, price, image }) => {
    return (
        <div className="col-12 col-md-3">
            <div className="card p-3 my-2 rounded-lg shadow-lg" style={{ height: "26rem" }}>
                <img 
                    src={image} 
                    className="card-img-top object-cover w-full h-72 rounded-lg" 
                    alt={title} 
                />
                <div className="card-body">
                    <h6 className="card-title text-lg font-semibold">{title}</h6>
                    <h5 className="card-text text-xl font-bold text-gray-700">₹ {price}</h5>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
