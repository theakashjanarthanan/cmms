// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fs-3" to="/dashboard">
          <strong>CMMS</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Item>
              <Link className="nav-link text-white fs-5" to="/work-orders">
                Work Orders
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link text-white fs-5" to="/preventive-maintenance">
                Preventive Maintenance
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link text-white fs-5" to="/asset-management">
                Asset Management
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link className="nav-link text-white fs-5" to="/requests">
                Requests
              </Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
