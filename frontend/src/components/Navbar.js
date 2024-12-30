// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/dashboard">CMMS</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/work-orders">Work Orders</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/preventive-maintenance">Preventive Maintenance</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/asset-management">Asset Management</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/requests">Requests</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
