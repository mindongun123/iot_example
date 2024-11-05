
//components
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

//styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './sidebar.css';

//icons
import { MdDashboard } from 'react-icons/md';
import { FaDatabase } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import { IoMdPerson } from "react-icons/io";
import { FaNoteSticky } from "react-icons/fa6";



function Sidebar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <nav className='navbar'>
      <div className='logo'>
        <h2>IoT</h2>
      </div>
      <div className='navbar-item-container'>

        <Link to="/" className={`item-link ${activeLink === '/' ? 'active' : ''}`} onClick={() => handleLinkClick('/')}>
          <MdDashboard className='icon-link' />
          <span className='link-text'>Dashboard</span>
        </Link>

        <Link to="/datasensor" className={`item-link ${activeLink === '/datasensor' ? 'active' : ''}`} onClick={() => handleLinkClick('/datasensor')}>
          <FaDatabase className='icon-link' />
          <span className='link-text'>DataSensor</span>
        </Link>

        <Link to="/history" className={`item-link ${activeLink === '/history' ? 'active' : ''}`} onClick={() => handleLinkClick('/history')}>
          <GoClockFill className='icon-link' />
          <span className='link-text'>History</span>
        </Link>

        <Link to="/test" className={`item-link ${activeLink === '/test' ? 'active' : ''}`} onClick={() => handleLinkClick('/test')}>
          <FaNoteSticky className='icon-link' />
          <span className='link-text'>Test</span>
        </Link>

        <Link to="/profile" className={`item-link ${activeLink === '/profile' ? 'active' : ''}`} onClick={() => handleLinkClick('/profile')}>
          <IoMdPerson className='icon-link' />
          <span className='link-text'>Profile</span>
        </Link>



      </div>
    </nav>
  );
}

export default Sidebar;
