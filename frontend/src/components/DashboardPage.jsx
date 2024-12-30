// frontend\src\components\DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DashboardPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button } from '@mui/material'; // Import Material UI components
 

const DashboardPage = () => {
  const [totalWorkOrders, setTotalWorkOrders] = useState(0);
  const [pendingWorkOrders, setPendingWorkOrders] = useState(0);
  const [inProgressWorkOrders, setInProgressWorkOrders] = useState(0);
  const [completedWorkOrders, setCompletedWorkOrders] = useState(0);
  
  // Preventive Maintenance State
  const [taskCount, setTaskCount] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  // Asset State
  const [assetCount, setAssetCount] = useState({
    total: 0,
    inUse: 0,
    underMaintenance: 0,
  });

  // Request State
  const [requestsData, setRequestsData] = useState({
    assigned: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  // Counting animation function for work orders
  const countUp = (start, end, duration, callback) => {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const count = Math.min(Math.floor(progress / duration * (end - start) + start), end);
      callback(count);
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };


// WokOrderPage Data Fetching for Realtime Data
  useEffect(() => {
    async function fetchWorkOrders() {
      try {
        const response = await axios.get('http://localhost:5000/api/workorders'); // Update API endpoint if necessary
        const data = response.data;

        // Update the work order counts with animation
        countUp(0, data.length, 1000, setTotalWorkOrders);
        countUp(0, data.filter((workOrder) => workOrder.status === 'Pending').length, 1000, setPendingWorkOrders);
        countUp(0, data.filter((workOrder) => workOrder.status === 'In Progress').length, 1000, setInProgressWorkOrders);
        countUp(0, data.filter((workOrder) => workOrder.status === 'Completed').length, 1000, setCompletedWorkOrders);
      } catch (error) {
        console.error('Error fetching work orders', error);
      }
    }

    fetchWorkOrders();
  }, []);


// PreventiveMaintenancePage Data Fetching for Realtime Data
  useEffect(() => {
    const fetchPreventiveMaintenanceTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/preventivemaintenance'); // Update API endpoint if necessary
        const tasks = response.data;
  
        // Calculate the count of tasks by status
        const pending = tasks.filter(task => task.status === 'Pending').length;
        const inProgress = tasks.filter(task => task.status === 'In Progress').length;
        const completed = tasks.filter(task => task.status === 'Completed').length;
  
        // Apply the countUp animation for each status
        countUp(0, pending, 1000, (count) => setTaskCount((prev) => ({ ...prev, pending: count })));
        countUp(0, inProgress, 1000, (count) => setTaskCount((prev) => ({ ...prev, inProgress: count })));
        countUp(0, completed, 1000, (count) => setTaskCount((prev) => ({ ...prev, completed: count })));
      } catch (error) {
        console.error('Error fetching Preventive Maintenance tasks:', error);
      }
    };
  
    // Fetch tasks initially
    fetchPreventiveMaintenanceTasks();
  
    // Polling every 10 seconds for real-time updates
    const intervalId = setInterval(fetchPreventiveMaintenanceTasks, 10000);
  
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);
  


// AssetManagementPage Data Fetching for Realtime Data
  useEffect(() => {
    // Fetch asset data
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/assets'); // Update with your correct endpoint
        const assets = response.data;

        // Calculate asset counts
        const total = assets.length;
        const inUse = assets.filter(asset => asset.assetStatus === 'In Use').length;
        const underMaintenance = assets.filter(asset => asset.assetStatus === 'Under Maintenance').length;
        const available = assets.filter(asset => asset.assetStatus === 'Available').length;

        // Update asset counts with animation
        countUp(0, total, 1000, (count) => setAssetCount(prev => ({ ...prev, total: count })));
        countUp(0, inUse, 1000, (count) => setAssetCount(prev => ({ ...prev, inUse: count })));
        countUp(0, underMaintenance, 1000, (count) => setAssetCount(prev => ({ ...prev, underMaintenance: count })));
        countUp(0, available, 1000, (count) => setAssetCount(prev => ({ ...prev, available: count })));
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
    const intervalId = setInterval(fetchAssets, 10000); // Polling every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/login"; // Redirect to login after logout
  };

   // RequestPage Data Fetching for Realtime Data
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/requests');
        const { data } = response;
  
        // Log the data response for debugging
        console.log('Requests Data:', data);
  
        // Calculate counts for each status
        const assigned = data.filter(task => task.status === 'Assigned').length;
        const pending = data.filter(task => task.status === 'Pending').length;
        const inProgress = data.filter(task => task.status === 'In Progress').length;
        const completed = data.filter(task => task.status === 'Completed').length;
  
        // Display the sum of assigned tasks
        const summary = {
          assigned: assigned + pending + inProgress + completed, // Sum of assigned tasks
          pending,
          inProgress,
          completed,
        };
  
        // Apply countUp animation to the request counts
        countUp(0, summary.assigned, 1000, (count) => setRequestsData((prev) => ({ ...prev, assigned: count })));
        countUp(0, summary.pending, 1000, (count) => setRequestsData((prev) => ({ ...prev, pending: count })));
        countUp(0, summary.inProgress, 1000, (count) => setRequestsData((prev) => ({ ...prev, inProgress: count })));
        countUp(0, summary.completed, 1000, (count) => setRequestsData((prev) => ({ ...prev, completed: count })));
      } catch (error) {
        console.error('Error fetching requests data:', error);
      }
    };
  
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Polling every 10 seconds
  
    return () => clearInterval(intervalId); // Cleanup
  }, []);


  return (
    <div className="container mt-5">
      <div className="card p-4" style={{ borderRadius: '15px' }}>
        <h2 className="text-center py-3">
          Welcome to the CMMS Dashboard ..!
        </h2>

        <p className="text-center" style={{ animation: 'fadeOut 2s forwards' }}>
          You're successfully logged in!
        </p>

        <h4 className="text-center py-2">
          Navigate to your modules:
        </h4>

        {/* Navigation Links */}
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <Link to="/work-orders" className="btn btn-primary m-2 " >
            Work Orders Management
          </Link>
          <Link to="/preventive-maintenance" className="btn btn-primary m-2 ">
            Preventive Maintenance & Management
          </Link>
          <Link to="/asset-management" className="btn btn-primary m-2 ">
            Asset & Inventory Management
          </Link>
          <Link to="/requests" className="btn btn-primary m-2 ">
            Requests Management
          </Link>
        </div>

        {/* Boxes for Modules */}
        <div className="module-row mt-5">
          {/* Work Orders Box */}
          <div className="module-box">
            <div className="icon-text">
              <i className="fas fa-cogs work-orders-icon"></i>
              <h5 className="module-title">Work Orders</h5>
            </div>
            <p className="module-description">Manage your work orders effectively.</p>
            <div className="work-order-stats mb-3">
              {/* Displaying Work Order Counts */}
              <p><strong>Total Work Orders:</strong> <span className="count">{totalWorkOrders}</span></p>
              <p><strong>Pending Work Orders:</strong> <span className="count">{pendingWorkOrders}</span></p>
              <p><strong>In Progress Work Orders:</strong> <span className="count">{inProgressWorkOrders}</span></p>
              <p><strong>Completed Work Orders:</strong> <span className="count">{completedWorkOrders}</span></p>
            </div>
            <Link to="/work-orders" className="btn btn-success">
              Go to Work Orders 
            </Link>
          </div>

          {/* Preventive Maintenance Box */}
          <div className="module-box">
            <div className="icon-text">
              <i className="fas fa-calendar-check maintenance-icon"></i>
              <h5 className="module-title">Preventive Maintenance</h5>
            </div>
            <p className="module-description">Schedule and track preventive maintenance tasks.</p>

            {/* Display Preventive Maintenance Task Counts */}
            <div>
              <p><strong>Pending Tasks:</strong> <span className="count">{taskCount.pending}</span> </p>
              <p><strong>In Progress Tasks:</strong> <span className="count">{taskCount.inProgress}</span> </p>
              <p><strong>Completed Tasks:</strong> <span className="count">{taskCount.completed}</span> </p>
            </div>

            <Link to="/preventive-maintenance" className="btn btn-success">
              Go to Preventive Maintenance
            </Link>
          </div>
        </div>

          {/* Additional Modules */}
          <div className="module-row">
          {/* Asset & Inventory Management Box */}
            <div className="module-box">
            <div className="icon-text">
              <i className="fas fa-box-open assets-icon"></i>
              <h5 className="module-title">Asset & Inventory Management</h5>
            </div>
            <p className="module-description">Track and manage your assets and inventory.</p>
            
            {/* Display Asset Counts */}
            <div className="asset-stats mb-3">
            <p><strong>Total Assets:</strong> <span className="count">{assetCount.total}</span></p>
            <p><strong>Assets Available:</strong> <span className="count">{assetCount.available}</span></p>
            <p><strong>Assets In Use:</strong> <span className="count">{assetCount.inUse}</span></p>
            <p><strong>Assets Under Maintenance:</strong> <span className="count">{assetCount.underMaintenance}</span></p>
            </div>

            <Link to="/asset-management" className="btn btn-success">
              Go to Asset Management
            </Link>
          </div>

          {/* Requests Management Box */}
          <div className="module-box">
            <div className="icon-text">
              <i className="fas fa-bell requests-icon"></i>
              <h5 className="module-title">Requests Management</h5>
            </div>
            <p className="module-description">Handle and manage service requests from users.</p>

                {/* Display Request Counts */}
              <div className="request-stats mb-3">
              <p><strong>Assigned Requests:</strong> <span className="count">{requestsData.assigned}</span></p>
                <p><strong>Pending Requests:</strong> <span className="count">{requestsData.pending}</span></p>
                <p><strong>In Progress Requests:</strong> <span className="count">{requestsData.inProgress}</span></p>
                <p><strong>Completed Requests:</strong> <span className="count">{requestsData.completed}</span></p>
              </div>

            <Link to="/requests" className="btn btn-success">
              Go to Requests Management
            </Link>
          </div>
        </div>
        
           {/* Logout Button */}
          <div className="text-center">
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            className="mt-3 logout-btn"
            sx={{
              fontSize: '1rem',  
              padding: '8px 16px',  
              textTransform: 'none', 
              borderRadius: '20px',  
              transition: 'all 0.3s ease-in-out',  
              boxShadow: '0px 0px 8px rgba(211, 47, 47, 0)', 
              '&:hover': {
                color:'white',
                backgroundColor: '#d32f2f', 
                borderColor: '#9a0007', 
                transform: 'scale(1.05)', 
                boxShadow: '0px 0px 20px rgba(211, 47, 47, 0.8)', 
              },
              '&:focus': {
                outline: 'none', // Remove default focus outline
              },
            }}
          >
                  Logout
            </Button>
            </div>
            
          </div>
        </div>
  );
};

export default DashboardPage;
