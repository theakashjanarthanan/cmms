// frontend\src\components\LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [shake, setShake] = useState(false); // State to control shake effect
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset shake effect before making the request
    setShake(false);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',  
        { email, password }
      );
      setMessage(response.data.message || 'Login Successful!');
      // Save token to local storage
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed!');
      setShake(true); // Trigger shake effect when credentials are invalid

      // Reset shake effect after 3 seconds
      setTimeout(() => {
        setShake(false);
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <div className={`login-card ${shake ? 'shake' : ''}`}>
        <h4 className="text-center mb-4 new ">Login</h4>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4 ">
            <h6 class="new" htmlFor="email">Email:</h6>
            <input
              type="email"
              id="email"
              className={`form-control ${shake ? 'invalid-input' : ''}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group mb-4">
            <h6 class="new" htmlFor="password">Password:</h6>
            <input
              type="password"
              id="password"
              className={`form-control ${shake ? 'invalid-input' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn login-btn w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <span>New User?</span> <Link to="/register" className="register-link">Create an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
