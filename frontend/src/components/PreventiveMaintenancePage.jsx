// frontend\src\components\PreventiveMaintenancePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PreventiveMaintenancePage = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Low');
    const [status, setStatus] = useState('Pending');
    const [frequency, setFrequency] = useState('Monthly');
    const [message, setMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [viewTask, setViewTask] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await axios.get('http://localhost:5000/api/preventivemaintenance');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks', error);
            }
        }
        fetchTasks();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        const task = { title, description, dueDate, priority, status, frequency };

        try {
            if (editMode) {
                await axios.put(`http://localhost:5000/api/preventivemaintenance/${currentTaskId}`, task);
                setMessage('Task Updated Successfully!');
            } else {
                await axios.post('http://localhost:5000/api/preventivemaintenance', task);
                setMessage('Task Created Successfully!');
            }

            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('Low');
            setStatus('Pending');
            setFrequency('Monthly');
            setEditMode(false);
            setCurrentTaskId(null);

            const response = await axios.get('http://localhost:5000/api/preventivemaintenance');
            setTasks(response.data);
        } catch (error) {
            setMessage('Failed to save task.');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/preventivemaintenance/${id}`);
            setMessage('Task Deleted Successfully!');
            const response = await axios.get('http://localhost:5000/api/preventivemaintenance');
            setTasks(response.data);
        } catch (error) {
            setMessage('Failed to delete task.');
            console.error(error);
        }
    };

    const handleEdit = (task) => {
        setEditMode(true);
        setCurrentTaskId(task._id);
        setTitle(task.title);
        setDescription(task.description);
        setDueDate(task.dueDate);
        setPriority(task.priority);
        setStatus(task.status);
        setFrequency(task.frequency);
    };

    const handleView = (task) => {
        setViewTask(task);
    };

    const renderPriorityBadge = (priority) => {
        if (priority === 'Low') {
            return <span className="badge bg-success">Low</span>;
        } else if (priority === 'Medium') {
            return <span className="badge bg-warning">Medium</span>;
        } else {
            return <span className="badge bg-danger">High</span>;
        }
    };

    const groupedTasks = {
        pending: tasks.filter(task => task.status === 'Pending'),
        inProgress: tasks.filter(task => task.status === 'In Progress'),
        completed: tasks.filter(task => task.status === 'Completed'),
    };

    return (
        <div className="container my-4">
                 {/* Go Back Button */}
                    <div className="container mt-5">
           <button className="btn btn-secondary mb-4" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-arrow-left rounded-circle back-icon mr-2"></i> Go Back to Dashboard
           </button>
                </div>

            <div className="card p-4">
                <h2 className="card-title mb-4">Preventive Maintenance</h2>

                {message && <div className="alert alert-info">{message}</div>}

              

                {/* Form */}
                <label className="me-3" style={{ minWidth: '80px' }}>Title:</label>
                <form onSubmit={handleSave} className="mb-4">
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

                    <label className="me-3" style={{ minWidth: '80px' }}>Due Date:</label>
                    <input
                        type="date"
                        className="form-control mb-2"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />

                <label className="me-3" style={{ minWidth: '80px' }}>Select Priority:</label>
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
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                        </div>

                        <label className="me-3" style={{ minWidth: '80px' }}>Frequency:</label>
                        <div className="col">
                            <select
                                className="form-control mb-2"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                            >
                                 <option  value="" disabled >
                                    Select Frequency
                                </option>
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {editMode ? 'Update Task' : 'Create Task'}
                    </button>
                </form>

                {/* View Task Modal */}
                {viewTask && (
                    <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Task Details</h5>
                                    <button type="button" className="close" onClick={() => setViewTask(null)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Title:</strong> {viewTask.title}</p>
                                    <p><strong>Description:</strong> {viewTask.description}</p>
                                    <p><strong>Due Date:</strong> {viewTask.dueDate}</p>
                                    <p><strong>Priority:</strong> {renderPriorityBadge(viewTask.priority)}</p>
                                    <p><strong>Status:</strong> {viewTask.status}</p>
                                    <p><strong>Frequency:</strong> {viewTask.frequency}</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setViewTask(null)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Task Tables */}
                <div>
                    <h3>Pending Tasks</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Frequency</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedTasks.pending.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{task.dueDate}</td>
                                    <td>{renderPriorityBadge(task.priority)}</td>
                                    <td>{task.status}</td>
                                    <td>{task.frequency}</td>
                                    <td>
                                        <button className="btn btn-info" onClick={() => handleView(task)}>View</button>
                                        <button className="btn btn-warning" onClick={() => handleEdit(task)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h3>In Progress Tasks</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Frequency</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedTasks.inProgress.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{task.dueDate}</td>
                                    <td>{renderPriorityBadge(task.priority)}</td>
                                    <td>{task.status}</td>
                                    <td>{task.frequency}</td>
                                    <td>
                                        <button className="btn btn-info" onClick={() => handleView(task)}>View</button>
                                        <button className="btn btn-warning" onClick={() => handleEdit(task)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h3>Completed Tasks</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Frequency</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedTasks.completed.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{task.dueDate}</td>
                                    <td>{renderPriorityBadge(task.priority)}</td>
                                    <td>{task.status}</td>
                                    <td>{task.frequency}</td>
                                    <td>
                                        <button className="btn btn-info" onClick={() => handleView(task)}>View</button>
                                        <button className="btn btn-warning" onClick={() => handleEdit(task)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PreventiveMaintenancePage;
