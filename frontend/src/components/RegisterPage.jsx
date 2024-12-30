// frontend\src\components\RegisterPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegisterPage.css'; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [shake, setShake] = useState(false); // For shake animation
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset shake effect before making the request
    setShake(false);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',  
        formData
      );
      setMessage(response.data.message || 'Registration Successful!');
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed!');
      setShake(true); // Trigger shake effect on failure

       // Reset shake effect after 3 seconds
      setTimeout(() => setShake(false), 3000);  
    }
  };

  return (
    <div className="register-container">
      <div className={`register-card ${shake ? 'shake' : ''}`}>
        <h4 className="text-center mb-4 new-1">Register</h4>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              className={`form-control ${shake ? 'invalid-input' : ''}`}
              placeholder="Enter your full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className={`form-control ${shake ? 'invalid-input' : ''}`}
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className={`form-control ${shake ? 'invalid-input' : ''}`}
              placeholder="Create a strong password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn register-btn w-100">
            Register
          </button>

        </form>

        <div className="text-center mt-4">
          <span class="msg">Already have an account?</span> <Link to="/login" className="login-link ">Login Here</Link>
        </div>
        
      </div>
    </div>
  );
};

export default RegisterPage;
