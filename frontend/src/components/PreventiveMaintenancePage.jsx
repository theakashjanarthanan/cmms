    // frontend\src\components\PreventiveMaintenancePage.jsx

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
    
    const PreventiveMaintenancePage = () => {
        const navigate = useNavigate();
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
        const [showEditModal, setShowEditModal] = useState(false);
    
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(5);
    
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
    
            if (!title.trim() || !description.trim()) {
                setMessage('Title and Description cannot be empty.');
                return;
            }
    
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
                setShowEditModal(false);
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
            setShowEditModal(true);
        };
    
        const handleView = (task) => {
            setViewTask(task);
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
    
        const TaskTable = ({ title, tasks }) => {
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
                                    <TableCell>Due Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Frequency</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
                                    <TableRow key={task._id}>
                                        <TableCell>{task.title}</TableCell>
                                        <TableCell>{task.dueDate}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.status}
                                                color={getStatusColor(task.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.priority}
                                                color={getPriorityColor(task.priority)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{task.frequency}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleView(task)}
                                                color="info"
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(task)}
                                                color="warning"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(task._id)}
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
                        count={tasks.length}
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
                    <Typography variant="h4" gutterBottom>Preventive Maintenance & Management</Typography>
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Due Date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Frequency</InputLabel>
                                    <Select
                                        value={frequency}
                                        label="Frequency"
                                        onChange={(e) => setFrequency(e.target.value)}
                                    >
                                        <MenuItem value="Daily">Daily</MenuItem>
                                        <MenuItem value="Weekly">Weekly</MenuItem>
                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                                    {editMode ? 'Update Task' : 'Create Task'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
    
                <TaskTable
                    title="Pending Tasks"
                    tasks={tasks.filter(task => task.status === 'Pending')}
                />
                <TaskTable
                    title="In Progress Tasks"
                    tasks={tasks.filter(task => task.status === 'In Progress')}
                />
                <TaskTable
                    title="Completed Tasks"
                    tasks={tasks.filter(task => task.status === 'Completed')}
                />
    
                <Dialog open={!!viewTask} onClose={() => setViewTask(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Task Details
                        <IconButton
                            onClick={() => setViewTask(null)}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        {viewTask && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Title:</strong> {viewTask.title}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Description:</strong> {viewTask.description}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Due Date:</strong> {viewTask.dueDate}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Frequency:</strong> {viewTask.frequency}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Priority:</strong>{' '}
                                    <Chip
                                        label={viewTask.priority}
                                        color={getPriorityColor(viewTask.priority)}
                                        size="small"
                                    />
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Status:</strong>{' '}
                                    <Chip
                                        label={viewTask.status}
                                        color={getStatusColor(viewTask.status)}
                                        size="small"
                                    />
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewTask(null)}>Close</Button>
                    </DialogActions>
                </Dialog>
    
                <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Edit Task
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
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Due Date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Frequency</InputLabel>
                                        <Select
                                            value={frequency}
                                            label="Frequency"
                                            onChange={(e) => setFrequency(e.target.value)}
                                        >
                                            <MenuItem value="Daily">Daily</MenuItem>
                                            <MenuItem value="Weekly">Weekly</MenuItem>
                                            <MenuItem value="Monthly">Monthly</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
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
                                    Update Task
                                </Button>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Container>
        );
    };
    
    export default PreventiveMaintenancePage;