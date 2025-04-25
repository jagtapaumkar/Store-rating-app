import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import './StoreDetails.css';

const StoreDetails = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch store details and user's rating
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`/ratings/store/${storeId}`);
        setStore(response.data);
        setUserRating(response.data.user_rating || 0); // Default to 0 if no rating
      } catch (error) {
        setError('Failed to fetch store details');
        console.error('Error fetching store details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreDetails();
  }, [storeId]);

  // Handle rating submission or update
  const handleSubmitRating = async () => {
    if (newRating === 0) {
      alert('Please select a rating!');
      return;
    }

    try {
      await axios.post('/ratings', { store_id: storeId, rating: newRating });
      setUserRating(newRating);
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating!');
    }
  };

  if (loading) return <div>Loading store details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="store-details">
      <h1 className="store-title">{store.name}</h1>
      <p className="store-address">{store.address}</p>
      <p className="store-rating">
        Average Rating: {store.avg_rating || 'Not rated yet'}
      </p>

      <h3>Your Rating: {userRating || 'Not rated yet'}</h3>

      <div className="rating-section">
        <label htmlFor="rating" className="rating-label">
          Rate this store (1-5): 
        </label>
        <select
          id="rating"
          value={newRating}
          onChange={(e) => setNewRating(Number(e.target.value))}
          className="rating-dropdown"
        >
          <option value="0">Select Rating</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmitRating} className="submit-rating-btn">
        Submit Rating
      </button>
    </div>
  );
};

export default StoreDetails;
