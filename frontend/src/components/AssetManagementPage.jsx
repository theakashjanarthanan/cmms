// frontend\src\components\AssetManagementPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  

function AssetManagementPage() {
  const [assets, setAssets] = useState([]);
  const [assetName, setAssetName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [assetStatus, setAssetStatus] = useState('Available');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  const navigate = useNavigate(); 

  // Fetch all assets from the database
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/assets');
        setAssets(response.data);
      } catch (error) {
        setMessage('Error fetching assets');
      }
    };
    fetchAssets();
  }, [message]);

  // Handle Add Asset
  const addAsset = async () => {
    if (!assetName || !assetCode) {
      setMessage('Both Asset Name and Asset Code are required.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/assets', {
        assetName,
        assetCode,
        assetStatus
      });
      setAssets([...assets, response.data]);
      setAssetName('');
      setAssetCode('');
      setAssetStatus('Available');
      setMessage('Asset added successfully!');
    } catch (error) {
      setMessage('Error adding asset.');
    }
  };

  // Handle Update Asset
  const updateAsset = async () => {
    if (!assetName || !assetCode) {
      setMessage('Both Asset Name and Asset Code are required.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/assets/${selectedAsset._id}`, {
        assetName,
        assetCode,
        assetStatus
      });
      const updatedAssets = assets.map(asset =>
        asset._id === selectedAsset._id ? response.data : asset
      );
      setAssets(updatedAssets);
      setMessage('Asset updated successfully!');
      setShowModal(false);
      setEditMode(false);
      setAssetName('');
      setAssetCode('');
      setAssetStatus('Available');
    } catch (error) {
      setMessage('Error updating asset.');
    }
  };

  // Handle Delete Asset
  const deleteAsset = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/assets/${id}`);
      setAssets(assets.filter((asset) => asset._id !== id));
      setMessage('Asset deleted successfully!');
    } catch (error) {
      setMessage('Error deleting asset.');
    }
  };

  // View Asset Modal
  const viewAsset = (asset) => {
    setSelectedAsset(asset);
    setAssetName(asset.assetName);
    setAssetCode(asset.assetCode);
    setAssetStatus(asset.assetStatus);
    setEditMode(false);
    setShowModal(true);
  };

  // Edit Asset Modal
  const editAsset = () => {
    setEditMode(true);
    setShowModal(true);
  };

  // Hide Modal
  const handleCloseModal = () => setShowModal(false);

  // Function to get row color based on asset status
  const getRowBackgroundColor = (status) => {
    switch (status) {
      case 'Available':
        return 'rgba(0, 128, 0, 0.2)'; // Transparent Green
      case 'In Use':
        return 'rgba(255, 255, 0, 0.2)'; // Transparent Yellow
      case 'Under Maintenance':
        return 'rgba(255, 0, 0, 0.2)'; // Transparent Red
      default:
        return '';
    }
  };

  // Handle Go Back to Dashboard
  const goBack = () => {
    navigate('/dashboard'); // Use navigate() to go back to the dashboard
  };

  return (
    <div className="container mt-5">
      {/* Go Back Button */}
      <button className="btn btn-secondary mb-4" onClick={goBack}>
          <i className="fas fa-arrow-left rounded-circle back-icon mr-2"></i> Go Back to Dashboard
      </button>

      <div className="card p-4">
        <h3>Asset Management</h3>
        
        {/* Display success/error messages */}
        {message && (
          <div className={`alert alert-info mt-2`}>{message}</div>
        )}

        {/* Add Asset Form */}
        <div className="row mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Asset Name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Asset Code"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-control"
              value={assetStatus}
              onChange={(e) => setAssetStatus(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-success"
              onClick={addAsset}
              style={{ width: '100%' }}
            >
              Add Asset
            </button>
          </div>
        </div>

        {/* Display Assets in Table */}
        <div className="mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Asset Code</th>
                <th>Asset Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset._id}
                  style={{ backgroundColor: getRowBackgroundColor(asset.assetStatus) }}
                >
                  <td>{asset.assetName}</td>
                  <td>{asset.assetCode}</td>
                  <td>
                    <span className={`badge ${
                      asset.assetStatus === 'Available' ? 'bg-success' :
                      asset.assetStatus === 'In Use' ? 'bg-warning' : 'bg-danger'
                    }`}>
                      {asset.assetStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info mr-2"
                      onClick={() => viewAsset(asset)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning mr-2"
                      onClick={() => editAsset(asset)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteAsset(asset._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View/Edit Asset Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Asset' : 'Asset Details'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <input
                type="text"
                className="form-control mb-2"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                disabled={!editMode}
              />
              <input
                type="text"
                className="form-control mb-2"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                disabled={!editMode}
              />
              <select
                className="form-control mb-2"
                value={assetStatus}
                onChange={(e) => setAssetStatus(e.target.value)}
                disabled={!editMode}
              >
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            {editMode && (
              <Button variant="primary" onClick={updateAsset}>
                Save Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default AssetManagementPage;
