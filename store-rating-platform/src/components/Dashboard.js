// components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { getStoreRatings } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await getStoreRatings(1); // You can replace `1` with dynamic store/user ID
        setRatings(data.ratings);
      } catch (error) {
        console.error('Failed to fetch ratings:', error);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Store Ratings Dashboard</h2>
      {ratings.length === 0 ? (
        <p className="dashboard-empty">No ratings submitted yet.</p>
      ) : (
        <ul className="ratings-list">
          {ratings.map((rating) => (
            <li key={rating.id} className="rating-card">
              <div className="rating-header">
                <span className="user-name">{rating.user.name}</span>
                <span className="rating-value">⭐ {rating.rating}/5</span>
              </div>
              <p className="user-comment">{rating.comment || 'No comment provided.'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
