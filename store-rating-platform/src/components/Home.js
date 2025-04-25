// components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Store Rating Platform!</h1>
          <p>Your one-stop platform for discovering and rating your favorite stores.</p>
          <div className="button-container">
            <Link to="/register" className="cta-button">Sign Up</Link>
            <Link to="/explore" className="explore-button">Explore Stores</Link>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="home-intro">
        <h2>Why Choose Us?</h2>
        <p>We help you find the best stores in your area and make informed decisions with ratings and reviews from real customers.</p>
      </div>

      {/* Featured Stores */}
      <div className="home-featured">
        <h2>Featured Stores</h2>
        <div className="store-featured-list">
          <div className="featured-store">
            <h3>Store 1</h3>
            <p>Category: Food & Beverage</p>
            <button><Link to="/store-details/1">View Details</Link></button>
          </div>
          <div className="featured-store">
            <h3>Store 2</h3>
            <p>Category: Electronics</p>
            <button><Link to="/store-details/2">View Details</Link></button>
          </div>
          <div className="featured-store">
            <h3>Store 3</h3>
            <p>Category: Clothing</p>
            <button><Link to="/store-details/3">View Details</Link></button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="home-testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-list">
          <div className="testimonial">
            <p>"This platform helped me discover the best local restaurants, and the ratings were spot on!"</p>
            <h4>- Jane Doe</h4>
          </div>
          <div className="testimonial">
            <p>"I love the ease of rating stores! It's so simple and fun to use."</p>
            <h4>- John Smith</h4>
          </div>
        </div>
      </div>

      {/* Explore Popular Categories Section */}
      <div className="home-categories">
        <h2>Explore Popular Categories</h2>
        <div className="categories-list">
          <div className="category">
            <h3>Restaurants</h3>
            <p>Discover the best dining spots in town.</p>
            <button><Link to="/stores?category=restaurants">Explore</Link></button>
          </div>
          <div className="category">
            <h3>Electronics</h3>
            <p>Find top-rated electronic stores near you.</p>
            <button><Link to="/stores?category=electronics">Explore</Link></button>
          </div>
          <div className="category">
            <h3>Clothing</h3>
            <p>Shop for the latest fashion at the best stores.</p>
            <button><Link to="/stores?category=clothing">Explore</Link></button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="home-cta">
        <h2>Ready to Explore?</h2>
        <p>Join us today to start rating and discovering stores!</p>
        <button><Link to="/register">Sign Up</Link></button>
      </div>

      {/* Footer */}
      <footer>
        <p>© 2025 Store Rating Platform</p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
