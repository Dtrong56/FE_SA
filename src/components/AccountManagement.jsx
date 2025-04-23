import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { informationApi } from '../api/informationApi';
import { accountApi } from '../api/accountApi';
import { Search as SearchIcon, Edit, Delete } from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';

const AccountManagement = () => {
  const navigate = useNavigate(); // Add this line
  const [informations, setInformations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Add form state
  const [formData, setFormData] = useState({
    cic: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    sex: true,
    permanentAddress: '',
    phoneNumber: '',
    email: ''
  });

  // Add this state with the others
  const [accountDialog, setAccountDialog] = useState({
    open: false,
    idInfo: null,
    formData: {
      accountName: '',
      password: ''
    },
    errors: {}
  });

  const handleAddNew = () => {
    setCurrentRecord(null);
    setFormData({
      cic: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      sex: true,
      permanentAddress: '',
      phoneNumber: '',
      email: ''
    });
    setErrors({});
    setOpenDialog(true);
  };

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

  const handleAddAccount = (row) => {
    setAccountDialog({
      open: true,
      idInfo: row.idInfo,
      formData: {
        accountName: '',
        password: ''
      },
      errors: {}
    });
  };

  // Update columns to add the Add icon
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
    { field: 'updateAt', headerName: 'Cập nhật', width: 180 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)} title="Sửa">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)} title="Xóa">
            <Delete />
          </IconButton>
          <IconButton onClick={() => handleAddAccount(params.row)} title="Thêm tài khoản">
            <AddIcon />
          </IconButton>
        </>
      ),
    }
  ];
  
  

  const handleEdit = (row) => {
    // Split full name into parts
    const nameParts = row.fullName.split(' ');
    const lastName = nameParts.pop();
    const firstName = nameParts.shift();
    const middleName = nameParts.join(' ');

    // Format date from dd-MM-yyyy to yyyy-MM-dd for the date input
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return dateString;
    };

    setCurrentRecord(row);
    setFormData({
      ...row,
      firstName,
      middleName,
      lastName,
      dateOfBirth: formatDateForInput(row.dateOfBirth) // Format the date for input
    });
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    setRecordToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await informationApi.deleteInformation(recordToDelete.idInfo);
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
      
      // Refresh data
      const data = await informationApi.getAllInformation();
      setInformations(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  const validateForm = () => {
    const newErrors = {};
    
    // CIC validation
    if (!formData.cic) newErrors.cic = 'CIC không được để trống';
    else if (!/^\d{12}$/.test(formData.cic)) newErrors.cic = 'CIC phải có 12 chữ số';
    
    // Name validation
    if (!formData.firstName) newErrors.firstName = 'Họ không được để trống';
    if (!formData.lastName) newErrors.lastName = 'Tên không được để trống';
    
    // Phone validation
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Số điện thoại không được để trống';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Số điện thoại phải có 10 chữ số';
    
    // Email validation
    if (!formData.email) newErrors.email = 'Email không được để trống';
    else if (!/^[a-zA-Z0-9._-]+@gmail\.com$/.test(formData.email)) newErrors.email = 'Email phải có định dạng example@gmail.com';

    // Age validation (must be at least 18 years old)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        newErrors.dateOfBirth = 'Phải đủ 18 tuổi trở lên';
      }
    }

    // Check for duplicates
    const duplicateCIC = informations.find(item => 
      item.cic === formData.cic && item.idInfo !== (currentRecord?.idInfo || 0)
    );
    const duplicatePhone = informations.find(item => 
      item.phoneNumber === formData.phoneNumber && item.idInfo !== (currentRecord?.idInfo || 0)
    );
    const duplicateEmail = informations.find(item => 
      item.email === formData.email && item.idInfo !== (currentRecord?.idInfo || 0)
    );

    if (duplicateCIC) newErrors.cic = 'CIC đã tồn tại';
    if (duplicatePhone) newErrors.phoneNumber = 'Số điện thoại đã tồn tại';
    if (duplicateEmail) newErrors.email = 'Email đã tồn tại';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Format date from yyyy-MM-dd to dd-MM-yyyy
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const parts = dateString.split('-');
          if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          return dateString;
        };

        const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`;
        const dataToSubmit = {
          cic: formData.cic,
          fullName: fullName.trim(),
          dateOfBirth: formatDate(formData.dateOfBirth),
          sex: formData.sex,
          permanentAddress: formData.permanentAddress,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          firstName: formData.firstName,  // Include individual name fields
          middleName: formData.middleName,
          lastName: formData.lastName
        };

        console.log('Data being submitted:', dataToSubmit); // Debug log

        if (currentRecord) {
          await informationApi.updateInformation(currentRecord.idInfo, dataToSubmit);
        } else {
          await informationApi.createInformation(dataToSubmit);
        }

        // Refresh data
        const data = await informationApi.getAllInformation();
        setInformations(data);
        setOpenDialog(false);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  const handleCreateAccount = async () => {
    // Simple validation
    const newErrors = {};
    if (!accountDialog.formData.accountName) {
      newErrors.accountName = 'Tên tài khoản không được để trống';
    }
    if (!accountDialog.formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setAccountDialog({...accountDialog, errors: newErrors});
      return;
    }
  
    try {
      const accountData = {
        accountName: accountDialog.formData.accountName,
        password: accountDialog.formData.password,
        isLocked: false
      };
  
      await accountApi.createAccount(accountDialog.idInfo, accountData);
      
      setSnackbar({
        open: true,
        message: 'Tạo tài khoản thành công',
        severity: 'success'
      });
      setAccountDialog({...accountDialog, open: false});
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Tạo tài khoản thất bại',
        severity: 'error'
      });
    }
  };

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
      <div style={{ padding: '16px 0', display: 'flex', gap: '16px' }}>
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
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddNew}
          style={{ height: '56px' }}
        >
          Thêm
        </Button>
      </div>
      
      <DataGrid
        rows={filteredData}
        columns={columns}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        getRowId={(row) => row.idInfo}
        components={{
          Toolbar: GridToolbar,
        }}
      />

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentRecord ? 'Cập nhật thông tin' : 'Thêm mới'}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
            <TextField
              label="CIC (12 số)"
              value={formData.cic}
              onChange={(e) => setFormData({...formData, cic: e.target.value})}
              error={!!errors.cic}
              helperText={errors.cic}
              inputProps={{ maxLength: 12 }}
              fullWidth
            />
            <TextField
              label="Họ"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              error={!!errors.firstName}
              helperText={errors.firstName}
              fullWidth
            />
            <TextField
              label="Tên lót"
              value={formData.middleName}
              onChange={(e) => setFormData({...formData, middleName: e.target.value})}
              fullWidth
            />
            <TextField
              label="Tên"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              error={!!errors.lastName}
              helperText={errors.lastName}
              fullWidth
            />
            <TextField
              label="Ngày sinh"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Select
                value={formData.sex}
                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                label="Giới tính"
              >
                <MenuItem value={true}>Nam</MenuItem>
                <MenuItem value={false}>Nữ</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Địa chỉ"
              value={formData.permanentAddress}
              onChange={(e) => setFormData({...formData, permanentAddress: e.target.value})}
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              inputProps={{ maxLength: 10 }}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Cân nhắc xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn xóa người này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>

      {/* Create Account Dialog */}
      <Dialog open={accountDialog.open} onClose={() => setAccountDialog({...accountDialog, open: false})}>
        <DialogTitle>Thêm tài khoản mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên tài khoản"
            value={accountDialog.formData.accountName}
            onChange={(e) => setAccountDialog({
              ...accountDialog,
              formData: {
                ...accountDialog.formData,
                accountName: e.target.value
              }
            })}
            error={!!accountDialog.errors.accountName}
            helperText={accountDialog.errors.accountName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mật khẩu"
            type="password"
            value={accountDialog.formData.password}
            onChange={(e) => setAccountDialog({
              ...accountDialog,
              formData: {
                ...accountDialog.formData,
                password: e.target.value
              }
            })}
            error={!!accountDialog.errors.password}
            helperText={accountDialog.errors.password}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccountDialog({...accountDialog, open: false})}>Hủy</Button>
          <Button onClick={handleCreateAccount} color="primary">Tạo</Button>
        </DialogActions>
      </Dialog>

      {/* Result Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};



// At the very end of the file, add this export:
export default AccountManagement;
