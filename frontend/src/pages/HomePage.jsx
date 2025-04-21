// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css'; // Don't forget to include the CSS file for styles

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="/path/to/logo.png" alt="Logo" />
        </div>
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        <div className="image-container">
          <img src="/path/to/image.jpg" alt="Food Donation" />
        </div>
        <div className="welcome-message">
          <h1>Welcome to the Food Donation & Waste Tracker</h1>
          <p>Track your surplus food and donate to local organizations.</p>
          <div className="buttons">
            <Link to="/register">
              <button>Register</button>
            </Link>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
