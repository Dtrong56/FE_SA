import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  Typography, Paper, IconButton,
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete, Info } from '@mui/icons-material';
import { busStopApi } from '../api/busStopApi';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function StationManagement() {
  const [busStops, setBusStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [routeInfoDialog, setRouteInfoDialog] = useState({
    open: false,
    info: null
  });

  const handleShowRouteInfo = (busRoute) => {
    setRouteInfoDialog({
      open: true,
      info: busRoute
    });
  };

  const columns = [
    { field: 'idBusStop', headerName: 'ID', width: 70 },
    { field: 'busStopName', headerName: 'Tên trạm', width: 200 },
    { field: 'address', headerName: 'Địa chỉ', width: 250 },
    { 
      field: 'busRoute.busRouteName', 
      headerName: 'Tuyến xe', 
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {params.row.busRoute?.busRouteName || ''}
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              handleShowRouteInfo(params.row.busRoute);
            }}
            size="small"
          >
            <Info fontSize="small" />
          </IconButton>
        </div>
      ),
    },
    { 
      field: 'isAvailable', 
      headerName: 'Trạng thái', 
      width: 120,
      valueGetter: (params) => params.row.isAvailable ? 'Hoạt động' : 'Tạm dừng'
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <Delete />
          </IconButton>
        </>
      ),
    }
  ];

  const loadBusStops = async () => {
    setLoading(true);
    try {
      const response = await busStopApi.getAllBusStops();
      setBusStops(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Lỗi khi tải dữ liệu trạm dừng',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBusStops();
  }, []);

  const handleEdit = (busStop) => {
    // Implement edit functionality
    console.log('Edit:', busStop);
  };

  const handleDelete = (busStop) => {
    // Implement delete functionality
    console.log('Delete:', busStop);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBusStops, setFilteredBusStops] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBusStops(busStops);
    } else {
      const filtered = busStops.filter(stop => 
        stop.busStopName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBusStops(filtered);
    }
  }, [searchTerm, busStops]);

  return (
    <Paper elevation={3} sx={{ 
      p: 3,
      height: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h5" gutterBottom>
        Quản lý trạm dừng
      </Typography>

      {/* Add search field */}
      <div style={{ padding: '16px 0' }}>
        <TextField
          fullWidth
          label="Tìm kiếm theo tên trạm"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div style={{ flex: 1, width: '100%' }}>
        <DataGrid
          rows={searchTerm ? filteredBusStops : busStops}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          getRowId={(row) => row.idBusStop}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>

      {/* Add Route Info Dialog */}
      <Dialog open={routeInfoDialog.open} onClose={() => setRouteInfoDialog({...routeInfoDialog, open: false})} maxWidth="md" fullWidth>
        <DialogTitle>Thông tin tuyến xe</DialogTitle>
        <DialogContent>
          {routeInfoDialog.info && (
            <div style={{ marginTop: '16px' }}>
              <Typography variant="h6" gutterBottom>{routeInfoDialog.info.busRouteName}</Typography>
              <Typography paragraph><strong>Tổng quan:</strong> {routeInfoDialog.info.overview}</Typography>
              <Typography paragraph><strong>Mô tả:</strong> {routeInfoDialog.info.description}</Typography>
              <Typography paragraph><strong>Điểm nổi bật:</strong> {routeInfoDialog.info.highlights}</Typography>
              <Typography paragraph><strong>Bao gồm:</strong> {routeInfoDialog.info.included}</Typography>
              <Typography paragraph><strong>Không bao gồm:</strong> {routeInfoDialog.info.excluded}</Typography>
              <Typography paragraph><strong>Mang theo:</strong> {routeInfoDialog.info.whatToBring}</Typography>
              <Typography paragraph><strong>Trước khi đi:</strong> {routeInfoDialog.info.beforeYouGo}</Typography>
              <Typography paragraph><strong>Trạng thái:</strong> {routeInfoDialog.info.isAvailable ? 'Hoạt động' : 'Tạm dừng'}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRouteInfoDialog({...routeInfoDialog, open: false})}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );    
}