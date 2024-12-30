// frontend\src\components\WorkOrdersPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';   

const WorkOrdersPage = () => {
    const navigate = useNavigate();  
    const [workOrders, setWorkOrders] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [status, setStatus] = useState('Pending');
    const [message, setMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentWorkOrderId, setCurrentWorkOrderId] = useState(null);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);  

    // Fetch all work orders
    useEffect(() => {
        async function fetchWorkOrders() {
            try {
                const response = await axios.get('http://localhost:5000/api/workorders');
                setWorkOrders(response.data);
            } catch (error) {
                console.error('Error fetching work orders', error);
            }
        }
        fetchWorkOrders();
    }, []);

    // Handle Create or Edit Work Order
    const handleSave = async (e) => {
        e.preventDefault();

//  prevent accidental submission of incomplete or invalid data.
        if (!title.trim() || !description.trim()) {
            setMessage('Title and Description cannot be empty.');
            return;
        }

        const workOrder = { title, description, priority, status };

        try {
            if (editMode) {
                // Edit existing work order
                await axios.put(`http://localhost:5000/api/workorders/${currentWorkOrderId}`, workOrder);
                setMessage('Work Order Updated Successfully!');
            } else {
                // Create new work order
                await axios.post('http://localhost:5000/api/workorders', workOrder);
                setMessage('Work Order Created Successfully!');
            }

            // Reset form and refresh the list
            setTitle('');
            setDescription('');
            setPriority('Low');
            setStatus('Pending');
            setEditMode(false);
            setCurrentWorkOrderId(null);

            const response = await axios.get('http://localhost:5000/api/workorders');
            setWorkOrders(response.data);
            setShowEditModal(false); // Close the edit modal after save
        } catch (error) {
            setMessage('Failed to save work order.');
            console.error(error);
        }
    };

    // Handle Delete Work Order
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/workorders/${id}`);
            setMessage('Work Order Deleted Successfully!');
            // Refresh list after deletion
            const response = await axios.get('http://localhost:5000/api/workorders');
            setWorkOrders(response.data);
        } catch (error) {
            setMessage('Failed to delete work order.');
            console.error(error);
        }
    };

    // Handle Edit Click
    const handleEdit = (workOrder) => {
        setEditMode(true);
        setCurrentWorkOrderId(workOrder._id);
        setTitle(workOrder.title);
        setDescription(workOrder.description);
        setPriority(workOrder.priority);
        setStatus(workOrder.status);
        setShowEditModal(true); // Show the edit modal
    };

    


 // Handle View Popup Click
    const handleView = (workOrder) => {
        setSelectedWorkOrder(workOrder); // set the work order to view in popup
    };

    const closePopup = () => {
        setSelectedWorkOrder(null); // Close the popup
    };

    // Conditional styling for priority and status
    const getPriorityClass = (priority) => {
        if (priority === 'High') return 'list-group-item-danger';
        if (priority === 'Medium') return 'list-group-item-warning';
        return 'list-group-item-success'; // Low priority
    };

    const getStatusClass = (status) => {
        if (status === 'Pending') return 'badge bg-primary';
        if (status === 'In Progress') return 'badge bg-info';
        return 'badge bg-success'; // Completed
    };

    // Conditional Background color based on the status
    const getStatusBackgroundColor = (status) => {
        if (status === 'Pending') return 'rgba(255, 0, 0, 0.2)'; // Red transparent
        if (status === 'In Progress') return 'rgba(255, 255, 0, 0.2)'; // Yellow transparent
        return 'rgba(0, 255, 0, 0.2)'; // Green transparent
    };

  

    return (
        
        <div className="container mt-5">
           {/* Go Back Button */}
           <button className="btn btn-secondary mb-4" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-arrow-left rounded-circle back-icon mr-2"></i> Go Back to Dashboard
           </button>

            {/* Work Orders Page Content Inside a Card */}
            <div className="card p-4  ">
                <h2>Work Orders</h2>
                {message && <div className="alert alert-info">{message}</div>}

                {/* Work Order Form */}
                <form onSubmit={handleSave} className="mb-4">
                <label className="me-3" style={{ minWidth: '80px' }}>Title:</label>
                    <input
                        type="text"
                       className="form-control mb-2"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label className="me-3" style={{ minWidth: '80px' }}>Description:</label>
                    <textarea
                        className="form-control mb-2"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>

                    <label className="me-3" style={{ minWidth: '80px' }}>Priority:</label>
                    <div className="form-row">
                        <div className="col">
                            <select
                                className="form-control mb-2"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                
                            >
                                 <option  value="" disabled >
                                    Select Priority
                                </option>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                        <label className="me-3" style={{ minWidth: '80px' }}>Status:</label>
                        <div className="col">
                            <select
                                className="form-control mb-2"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                 <option  value="" disabled >
                                    Select Status
                                </option>
                                <option>Pending </option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                        {editMode ? 'Update Work Order' : 'Create Work Order'}
                    </button>
                </form>

                {/* Display Work Orders in Tables */}

                {/* Pending Work Orders Table */}
                <div className="my-4">
                    <h4>Pending Work Orders</h4>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workOrders
                                .filter((workOrder) => workOrder.status === 'Pending')
                                .map((workOrder) => (
                                    <tr
                                        key={workOrder._id}
                                        style={{ backgroundColor: getStatusBackgroundColor(workOrder.status) }} // Apply background color here
                                    >
                                        <td>{workOrder.title}</td>
                                        <td><span className={getStatusClass(workOrder.status)}>{workOrder.status}</span></td>
                                        <td><span className={getPriorityClass(workOrder.priority)}>{workOrder.priority}</span></td>
                                        <td>
                                            <button
                                                onClick={() => handleView(workOrder)}
                                                className="btn btn-info btn-sm me-2"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEdit(workOrder)}
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(workOrder._id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* In Progress Work Orders Table */}
                <div className="my-4">
                    <h4>In Progress Work Orders</h4>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workOrders
                                .filter((workOrder) => workOrder.status === 'In Progress')
                                .map((workOrder) => (
                                    <tr
                                        key={workOrder._id}
                                        style={{ backgroundColor: getStatusBackgroundColor(workOrder.status) }}
                                    >
                                        <td>{workOrder.title}</td>
                                        <td><span className={getStatusClass(workOrder.status)}>{workOrder.status}</span></td>
                                        <td><span className={getPriorityClass(workOrder.priority)}>{workOrder.priority}</span></td>
                                        <td>
                                            <button
                                                onClick={() => handleView(workOrder)}
                                                className="btn btn-info btn-sm me-2"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEdit(workOrder)}
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(workOrder._id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Completed Work Orders Table */}
                <div className="my-4">
                    <h4>Completed  Work Orders</h4>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workOrders
                                .filter((workOrder) => workOrder.status === 'Completed')
                                .map((workOrder) => (
                                    <tr
                                        key={workOrder._id}
                                        style={{ backgroundColor: getStatusBackgroundColor(workOrder.status) }}
                                    >
                                        <td>{workOrder.title}</td>
                                        <td><span className={getStatusClass(workOrder.status)}>{workOrder.status}</span></td>
                                        <td><span className={getPriorityClass(workOrder.priority)}>{workOrder.priority}</span></td>
                                        <td>
                                            <button
                                                onClick={() => handleView(workOrder)}
                                                className="btn btn-info btn-sm me-2"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEdit(workOrder)}
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(workOrder._id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Work Order View Modal */}
                            {selectedWorkOrder && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Work Order Details</h5>
                                    <button type="button" className="close" onClick={closePopup}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Title:</strong> {selectedWorkOrder.title}</p>
                                    <p><strong>Description:</strong> {selectedWorkOrder.description}</p>
                                    <p><strong>Priority:</strong> {selectedWorkOrder.priority}</p>
                                    <p><strong>Status:</strong> {selectedWorkOrder.status}</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={closePopup}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* Edit Modal */}
            {showEditModal && (
                                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Edit Work Order</h5>
                                                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowEditModal(false)}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={handleSave}>
                                                    <input
                                                        type="text"
                                                        className="form-control mb-2"
                                                        placeholder="Title"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        required
                                                    />
                                                    <textarea
                                                        className="form-control mb-2"
                                                        placeholder="Description"
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        required
                                                    ></textarea>
                                                    <div className="form-row">
                                                        <div className="col">
                                                            <select
                                                                className="form-control mb-2"
                                                                value={priority}
                                                                onChange={(e) => setPriority(e.target.value)}
                                                            >
                                                                <option>Low</option>
                                                                <option>Medium</option>
                                                                <option>High</option>
                                                            </select>
                                                        </div>
                                                        <div className="col">
                                                            <select
                                                                className="form-control mb-2"
                                                                value={status}
                                                                onChange={(e) => setStatus(e.target.value)}
                                                            >
                                                                <option>Pending </option>
                                                                <option>In Progress</option>
                                                                <option>Completed</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <button type="submit" className="btn btn-primary">
                                                        Update Work Order
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

        </div>
    );
};

export default WorkOrdersPage;
