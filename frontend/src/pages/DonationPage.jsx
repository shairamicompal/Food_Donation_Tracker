// src/pages/DonationPage.jsx
import React, { useState } from 'react';

const DonationPage = () => {
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // You would add API call here to submit the food donation
    console.log(`Donating ${foodItem} (${quantity})`);
  };

  return (
    <div className="donation-page">
      <h1>Donate Food</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="foodItem">Food Item</label>
          <input
            type="text"
            id="foodItem"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            placeholder="e.g., Rice, Bread"
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="text"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 5 kg"
          />
        </div>
        <button type="submit">Submit Donation</button>
      </form>
    </div>
  );
};

export default DonationPage;
