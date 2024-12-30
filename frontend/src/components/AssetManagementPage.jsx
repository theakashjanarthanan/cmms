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

function AssetManagementPage() {
  const [assets, setAssets] = useState([]);
  const [assetName, setAssetName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [assetStatus, setAssetStatus] = useState('Available');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const navigate = useNavigate();

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

  const deleteAsset = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/assets/${id}`);
      setAssets(assets.filter((asset) => asset._id !== id));
      setMessage('Asset deleted successfully!');
    } catch (error) {
      setMessage('Error deleting asset.');
    }
  };

  const viewAsset = (asset) => {
    setSelectedAsset(asset);
    setAssetName(asset.assetName);
    setAssetCode(asset.assetCode);
    setAssetStatus(asset.assetStatus);
    setEditMode(false);
    setShowModal(true);
  };

  const editAsset = (asset) => {
    setSelectedAsset(asset);
    setAssetName(asset.assetName);
    setAssetCode(asset.assetCode);
    setAssetStatus(asset.assetStatus);
    setEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setAssetName('');
    setAssetCode('');
    setAssetStatus('Available');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'In Use':
        return 'warning';
      case 'Under Maintenance':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
       <button className="btn btn-secondary mb-4" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-arrow-left rounded-circle back-icon mr-2"></i> Go Back to Dashboard
        </button>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Asset Management</Typography>
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Asset Name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Asset Code"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={assetStatus}
                label="Status"
                onChange={(e) => setAssetStatus(e.target.value)}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="In Use">In Use</MenuItem>
                <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addAsset}
            >
              Add Asset
            </Button>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset Name</TableCell>
                <TableCell>Asset Code</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asset) => (
                  <TableRow key={asset._id}>
                    <TableCell>{asset.assetName}</TableCell>
                    <TableCell>{asset.assetCode}</TableCell>
                    <TableCell>
                      <Chip
                        label={asset.assetStatus}
                        color={getStatusColor(asset.assetStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => viewAsset(asset)}
                        color="info"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => editAsset(asset)}
                        color="warning"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteAsset(asset._id)}
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
          count={assets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Asset' : 'Asset Details'}
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Asset Name"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  disabled={!editMode}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Asset Code"
                  value={assetCode}
                  onChange={(e) => setAssetCode(e.target.value)}
                  disabled={!editMode}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={assetStatus}
                    label="Status"
                    onChange={(e) => setAssetStatus(e.target.value)}
                    disabled={!editMode}
                  >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="In Use">In Use</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          {editMode && (
            <Button onClick={updateAsset} variant="contained">
              Save Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AssetManagementPage;