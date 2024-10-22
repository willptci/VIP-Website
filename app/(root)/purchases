import React from 'react';

const servicesData = [
  { id: 1, name: 'Fishing Day Out', price: 2000, date: '2024-10-10', status: 'Completed', provider: 'John's Fishing' },
  { id: 2, name: 'Boat Ride', price: 1500, date: '2024-09-25', status: 'In Progress', provider: 'Boat Riders' },
  { id: 3, name: 'Landside Tours', price: 1000, date: '2024-08-18', status: 'Completed', provider: 'Bahama Tours' },
];

const PurchasesPage = () => {
  return (
    <div>
      <h1>Service Purchase History</h1>
      <div style={styles.topBar}>
        <span>Service Name</span>
        <span>Price</span>
        <span>Date</span>
        <span>Status</span>
        <span>Provider</span>
      </div>
      <div>
        {servicesData.map((service) => (
          <div key={service.id} style={styles.serviceRow}>
            <span style={styles.serviceCell}>{service.name}</span>
            <span style={styles.serviceCell}>${service.price}</span>
            <span style={styles.serviceCell}>{service.date}</span>
            <span style={styles.serviceCell}>{service.status}</span>
            <span style={styles.serviceCell}>{service.provider}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderBottom: '2px solid #ccc',
  },
  serviceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  serviceCell: {
    flex: 1,
    textAlign: 'left',
    padding: '0 10px',
  },
};

export default PurchasesPage;
