// frontend\src\components\WorkOrdersPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Alert,
    Box,
    Chip,
    Grid,
    TablePagination
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Close as CloseIcon
} from '@mui/icons-material';

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

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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

    const handleSave = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setMessage('Title and Description cannot be empty.');
            return;
        }

        const workOrder = { title, description, priority, status };

        try {
            if (editMode) {
                await axios.put(`http://localhost:5000/api/workorders/${currentWorkOrderId}`, workOrder);
                setMessage('Work Order Updated Successfully!');
            } else {
                await axios.post('http://localhost:5000/api/workorders', workOrder);
                setMessage('Work Order Created Successfully!');
            }

            setTitle('');
            setDescription('');
            setPriority('Low');
            setStatus('Pending');
            setEditMode(false);
            setCurrentWorkOrderId(null);

            const response = await axios.get('http://localhost:5000/api/workorders');
            setWorkOrders(response.data);
            setShowEditModal(false);
        } catch (error) {
            setMessage('Failed to save work order.');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/workorders/${id}`);
            setMessage('Work Order Deleted Successfully!');
            const response = await axios.get('http://localhost:5000/api/workorders');
            setWorkOrders(response.data);
        } catch (error) {
            setMessage('Failed to delete work order.');
            console.error(error);
        }
    };

    const handleEdit = (workOrder) => {
        setEditMode(true);
        setCurrentWorkOrderId(workOrder._id);
        setTitle(workOrder.title);
        setDescription(workOrder.description);
        setPriority(workOrder.priority);
        setStatus(workOrder.status);
        setShowEditModal(true);
    };

    const handleView = (workOrder) => {
        setSelectedWorkOrder(workOrder);
    };

    const closePopup = () => {
        setSelectedWorkOrder(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'error';
            case 'Medium':
                return 'warning';
            default:
                return 'success';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'warning';
            case 'In Progress':
                return 'info';
            case 'Completed':
                return 'success';
            default:
                return 'default';
        }
    };

    const WorkOrderTable = ({ title, orders }) => {
        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        return (
            <Paper sx={{ mb: 3, p: 2 }} elevation={3}>
                <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((workOrder) => (
                                <TableRow key={workOrder._id}>
                                    <TableCell>{workOrder.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={workOrder.status}
                                            color={getStatusColor(workOrder.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={workOrder.priority}
                                            color={getPriorityColor(workOrder.priority)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleView(workOrder)}
                                            color="info"
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(workOrder)}
                                            color="warning"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(workOrder._id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-arrow-left rounded-circle back-icon mr-2"></i> Go Back to Dashboard
           </button>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" gutterBottom>Work Orders Management</Typography>
                {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

                <form onSubmit={handleSave}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={priority}
                                    label="Priority"
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={status}
                                    label="Status"
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={editMode ? <EditIcon /> : <AddIcon />}
                            >
                                {editMode ? 'Update Work Order' : 'Create Work Order'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <WorkOrderTable
                title="Pending Work Orders"
                orders={workOrders.filter(wo => wo.status === 'Pending')}
            />
            <WorkOrderTable
                title="In Progress Work Orders"
                orders={workOrders.filter(wo => wo.status === 'In Progress')}
            />
            <WorkOrderTable
                title="Completed Work Orders"
                orders={workOrders.filter(wo => wo.status === 'Completed')}
            />

            <Dialog open={!!selectedWorkOrder} onClose={closePopup} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Work Order Details
                    <IconButton
                        onClick={closePopup}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedWorkOrder && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Title:</strong> {selectedWorkOrder.title}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Description:</strong> {selectedWorkOrder.description}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Priority:</strong>{' '}
                                <Chip
                                    label={selectedWorkOrder.priority}
                                    color={getPriorityColor(selectedWorkOrder.priority)}
                                    size="small"
                                />
                            </Typography>
                            <Typography variant="body1">
                                <strong>Status:</strong>{' '}
                                <Chip
                                    label={selectedWorkOrder.status}
                                    color={getStatusColor(selectedWorkOrder.status)}
                                    size="small"
                                />
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePopup}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Edit Work Order
                    <IconButton
                        onClick={() => setShowEditModal(false)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSave} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={priority}
                                        label="Priority"
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <MenuItem value="Low">Low</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="High">High</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={status}
                                        label="Status"
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setShowEditModal(false)} sx={{ mr: 1 }}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                Update Work Order
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default WorkOrdersPage;
