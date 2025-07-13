import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // if using styles

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Job Portal</h1>

      <div style={{ marginTop: '30px' }}>
        <Link to="/register">
          <button className="home-button" style={{ marginRight: '10px' }}>
            Register
          </button>
        </Link>

        <Link to="/login">
          <button className="home-button" style={{ backgroundColor: '#28a745' }}>
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
