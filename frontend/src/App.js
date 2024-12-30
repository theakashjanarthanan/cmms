// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';                                 // LoginPage.jsx
import RegisterPage from './components/RegisterPage';                           // RegisterPage.jsx
import DashboardPage from './components/DashboardPage';                         // DashboardPage.jsx
import WorkOrdersPage from './components/WorkOrdersPage';                       // WorkOrdersPage/jsx
import PreventiveMaintenancePage from './components/PreventiveMaintenancePage'; // PreventiveMaintenancePage.jsx
import AssetManagementPage from './components/AssetManagementPage';             // AssetManagementPage.jsx  
import RequestsPage from './components/RequestsPage';                           // RequestsPage.jsx

function App() {
  return (
    <Router>
      
      <div className="App">

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/work-orders" element={<WorkOrdersPage />} />
          <Route path="/preventive-maintenance" element={<PreventiveMaintenancePage />} />
          <Route path="/asset-management" element={<AssetManagementPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Routes>
        
      </div>
      
    </Router>
  );
}

export default App;
