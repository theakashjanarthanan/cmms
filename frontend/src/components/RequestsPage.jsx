//frontend\src\components\RequestsPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestForm = () => {
  const navigate = useNavigate();  

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Pending');
  const [assignedTo, setAssignedTo] = useState('Unassigned');
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRequests, setShowRequests] = useState(false);  

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests');
      setRequests(response.data);
    } catch (error) {
      setError('Error fetching requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/requests', {
        title,
        description,
        priority,
        status,
        assignedTo,
      });

      setTitle('');
      setDescription('');
      setPriority('Low');
      setStatus('Pending');
      setAssignedTo('Unassigned');
      fetchRequests();
    } catch (error) {
      setError('Error submitting the request');
    }
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/requests/${selectedRequest._id}`, {
        title,
        description,
        priority,
        status,
        assignedTo,
      });

      setShowEditModal(false);
      fetchRequests();
    } catch (error) {
      setError('Error updating the request');
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setTitle(request.title);
    setDescription(request.description);
    setPriority(request.priority);
    setStatus(request.status);
    setAssignedTo(request.assignedTo);
    setShowEditModal(true);
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/${requestId}`);
      // Remove the deleted request from the state to update the UI
      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (error) {
      setError('Error deleting the request');
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Low':
        return <span className="badge bg-success">{priority}</span>;
      case 'Medium':
        return <span className="badge bg-warning">{priority}</span>;
      case 'High':
        return <span className="badge bg-danger">{priority}</span>;
      default:
        return <span className="badge bg-secondary">{priority}</span>;
    }
  };

  return (
    <div className="container mt-5">
      {/* Go Back Button */}
       <button className="btn btn-secondary mb-4" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-arrow-left rounded-circle back-icon mr-2"></i> Go Back to Dashboard
       </button>

      {/* Request Submission Form */}
      <div className="card p-4">
        <h2 className="text-center mb-4">Request Management</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          
          {/* Form Fields */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Request Title</label>
            <input
              placeholder='Enter the title'
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              placeholder='Enter the description'
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              id="priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="assignedTo" className="form-label">Assigned To</label>
            <input
              type="text"
              id="assignedTo"
              className="form-control"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Submit Request</button>
        </form>
      </div>

      {/* Button to Toggle Table Visibility */}
      <button
        className="btn btn-secondary mt-4 d-flex mx-auto"
        onClick={() => setShowRequests((prev) => !prev)}  // Toggle visibility of table
      >
        {showRequests ? 'Hide Requests' : 'Show Requests'}
      </button>

      {/* Requests List Table */}
      {showRequests && (
        <div className="table-responsive mt-4">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Request Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.title}</td>
                    <td>{request.description}</td>
                    <td>{getPriorityBadge(request.priority)}</td>
                    <td>{request.status}</td>
                    <td>{request.assignedTo}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(request)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-info ms-2"
                        onClick={() => handleViewRequest(request)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => handleDeleteRequest(request._id)} // Delete request
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedRequest && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Summary</h5>
                <button type="button" className="close" onClick={() => setShowViewModal(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <h4>{selectedRequest.title}</h4>
                <p><strong>Description:</strong> {selectedRequest.description}</p>
                <p><strong>Priority:</strong> {selectedRequest.priority}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Assigned To:</strong> {selectedRequest.assignedTo}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRequest && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Request</h5>
                <button type="button" className="close" onClick={() => setShowEditModal(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateRequest}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Request Title</label>
                    <input
                      type="text"
                      id="title"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      id="description"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="priority" className="form-label">Priority</label>
                    <select
                      id="priority"
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      id="status"
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="assignedTo" className="form-label">Assigned To</label>
                    <input
                      type="text"
                      id="assignedTo"
                      className="form-control"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Update Request</button>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestForm;
