import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  TextField,
  IconButton,  // Add this import
  InputAdornment 
} from '@mui/material';
import { informationApi } from '../api/informationApi';
import { Search as SearchIcon } from '@mui/icons-material';

const AccountManagement = () => {
  const [informations, setInformations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const filteredData = informations.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(searchLower) ||
      item.cic?.toLowerCase().includes(searchLower) ||
      item.phoneNumber?.includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { field: 'idInfo', headerName: 'ID', width: 70 },
    { field: 'cic', headerName: 'CIC', width: 130 },
    { field: 'fullName', headerName: 'Họ và tên', width: 200 },
    { field: 'dateOfBirth', headerName: 'Ngày sinh', width: 120 },
    { 
      field: 'sex', 
      headerName: 'Giới tính', 
      width: 100,
      valueGetter: (params) => params.row.sex ? 'Nam' : 'Nữ'
    },
    { field: 'permanentAddress', headerName: 'Địa chỉ', width: 250 },
    { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'updateAt', headerName: 'Cập nhật', width: 180 }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await informationApi.getAllInformation();
        
        // Debug: Verify data structure matches grid columns
        console.log('Received Data Structure:', {
          sampleItem: data[0] ? {
            idInfo: data[0].idInfo,
            fullName: data[0].fullName,
            dateOfBirth: data[0].dateOfBirth,
            sex: data[0].sex
          } : null
        });

        setInformations(data);
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Add search input above DataGrid
  return (
    <div style={{ height: 600, width: '100%' }}>
      <div style={{ padding: '16px 0' }}>
        <TextField
          fullWidth
          label="Tìm kiếm theo tên, CIC, SĐT, Email"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          style={{ marginBottom: 16 }}
        />
      </div>
      
      <DataGrid
        rows={filteredData}  // Changed from informations to filteredData
        columns={columns}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        getRowId={(row) => row.idInfo}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
};

export default AccountManagement;