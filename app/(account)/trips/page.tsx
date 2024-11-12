import React from 'react'
import './Purchases.scss';

const purchasesData = [
  { id: 1, name: 'Boat Rides', price: 699, date: '2024-10-15', status: 'Done' },
  { id: 2, name: 'Fishing Adventure', price: 1299, date: '2024-09-30', status: 'Done' },
  { id: 3, name: 'Bahamas Tour', price: 199, date: '2024-08-20', status: 'Happening soon' },
];

const Trips: React.FC = () => {
  return (
    <div className="purchases">
      <h1>Purchase History</h1>
      <div className="purchase-list">
        {purchasesData.map((purchase) => (
          <div key={purchase.id} className="purchase-item">
            <h2>{purchase.name}</h2>
            <div>
              <p>Price: ${purchase.price}</p>
              <p>Date: {purchase.date}</p>
              <p>Status: {purchase.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trips