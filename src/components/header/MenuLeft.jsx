import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './menuleft.css'; // Import CSS tùy chỉnh

function MenuLeft() {
  return (
    <nav className='navbar'>
      <div className='logo'>
        <h2>IoT</h2>
      </div>
      <div className='navbar-item-container'>
        <Link to="/" className='item-link'>
          Dashboard
        </Link>
        <Link to="/datasensor" className='item-link' >
          DataSensor
        </Link>
        <Link to="/history" className='item-link'>
          History
        </Link>
        <Link to="/profile" className='item-link'>
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default MenuLeft;
