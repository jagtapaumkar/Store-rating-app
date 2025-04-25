import React, { useEffect, useState } from 'react';
import { getStores } from '../services/api';
import './StoreList.css'; // Add styling

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await getStores();
        setStores(data);
      } catch (err) {
        setError('Failed to fetch stores.');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) return <div className="loading">Loading stores...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="store-list-container">
      <h2 className="store-list-title">Store Listings</h2>
      <div className="store-cards">
        {stores.map((store) => (
          <div className="store-card" key={store.id}>
            <h3 className="store-name">{store.name}</h3>
            <p className="store-address">{store.address}</p>
            <p className="store-rating">Rating: {store.rating}</p>
            <button className="view-details-btn">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
