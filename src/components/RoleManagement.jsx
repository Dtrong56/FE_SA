import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';  // Changed from @mui/material
import { 
  Typography, Paper, TextField, 
  IconButton, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, FormControl,
  InputLabel, Select, MenuItem, Snackbar, Alert 
} from '@mui/material';
import { Search as SearchIcon, Edit, Delete, Info } from '@mui/icons-material';
import { accountApi } from '../api/accountApi';
import Account from '../models/Account';  // Add Account model import
import { useLocation, useSearchParams } from 'react-router-dom';

export default function RoleManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    accountName: '',
    password: '',
    isLocked: false
  });

  // Update columns definition to match API response
  // Add new state for info dialog
  const [infoDialog, setInfoDialog] = useState({
    open: false,
    info: null
  });

  const handleShowInfo = (info) => {
    setInfoDialog({
      open: true,
      info: info
    });
  };

  // Update the information column definition
  const columns = [
    { field: 'idAccount', headerName: 'ID', width: 70 },
    { field: 'accountName', headerName: 'Tên tài khoản', width: 200 },
    { field: 'password', headerName: 'Mật khẩu', width: 200 },
    { 
      field: 'isLocked', 
      headerName: 'Trạng thái', 
      width: 130,
      valueGetter: (params) => params.row.isLocked ? 'Đã khóa' : 'Hoạt động'
    },
    { 
      field: 'information',
      headerName: 'Thông tin cá nhân',
      width: 120,
      renderCell: (params) => (
        <IconButton onClick={() => handleShowInfo(params.row.information)}>
          <Info />
        </IconButton>
      ),
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

  // Update DataGrid to use idAccount as row id
  <DataGrid
    rows={accounts}
    columns={columns}
    loading={loading}
    pageSize={5}
    rowsPerPageOptions={[5, 10, 20]}
    getRowId={(row) => row.idAccount}
    components={{
      Toolbar: GridToolbar,
    }}
  />
  const handleAddNew = () => {
    setCurrentAccount(null);
    setFormData({
      accountName: '',
      password: '',
      isLocked: false
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (account) => {
    setCurrentAccount(account);
    setFormData({
      accountName: account.accountName,
      password: account.password,
      isLocked: account.isLocked
    });
    setOpenDialog(true);
  };

  const handleDelete = (account) => {
    setAccountToDelete(account);
    setDeleteConfirmOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    const rules = Account.getValidationRules();
    
    if (!formData.accountName) {
      newErrors.accountName = rules.accountName.required;
    } else if (formData.accountName.length < 5) {
      newErrors.accountName = rules.accountName.minLength.message;
    } else if (formData.accountName.length > 50) {
      newErrors.accountName = rules.accountName.maxLength.message;
    }

    if (!currentAccount && !formData.password) {
      newErrors.password = rules.password.required;
    } else if (formData.password && formData.password.length < 5) {
      newErrors.password = rules.password.minLength.message;
    } else if (formData.password && formData.password.length > 100) {
      newErrors.password = rules.password.maxLength.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (currentAccount) {
        setEditConfirmOpen(true);
        return;
      }
      await saveAccount();
    }
  };

  // Add these at the top of your component
  const [searchParams] = useSearchParams();
  const idInfo = searchParams.get('idInfo');

  useEffect(() => {
    // If idInfo is present in URL, show add account dialog
    if (idInfo) {
      setCurrentAccount(null);
      setFormData({
        accountName: '',
        password: '',
        isLocked: false
      });
      setErrors({});
      setOpenDialog(true);
    }
  }, [idInfo]);

  // Modify saveAccount function
  const saveAccount = async () => {
    try {
      let result;
      if (currentAccount) {
        result = await accountApi.updateAccount(currentAccount.idAccount, formData);
      } else {
        // Use idInfo from URL when creating new account
        result = await accountApi.createAccount(idInfo, formData);
      }

      setSnackbar({
        open: true,
        message: result.message || 'Thao tác thành công',
        severity: 'success'
      });

      loadAccounts();
      setOpenDialog(false);
      setEditConfirmOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await accountApi.deleteAccount(accountToDelete.idAccount);  // Changed from idAcc
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
      loadAccounts();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setAccountToDelete(null);
    }
  };

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await accountApi.getAllAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <Paper elevation={3} sx={{ 
      p: 3,
      height: 'calc(100vh - 80px)', // Set height to fill viewport minus header
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '16px 0', display: 'flex', gap: '16px' }}>
        <TextField
          fullWidth
          label="Tìm kiếm theo tên tài khoản"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => {}}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {/* Removed the Thêm button */}
      </div>

      <div style={{ flex: 1, width: '100%' }}>
        <DataGrid
          rows={accounts}
          columns={columns}
          loading={loading}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.idAccount} // Make sure this matches
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentAccount ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <TextField
              label="Tên tài khoản"
              value={formData.accountName}
              onChange={(e) => setFormData({...formData, accountName: e.target.value})}
              error={!!errors.accountName}
              helperText={errors.accountName}
              fullWidth
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái tài khoản</InputLabel>
              <Select
                value={formData.isLocked}
                onChange={(e) => setFormData({...formData, isLocked: e.target.value})}
                label="Trạng thái tài khoản"
              >
                <MenuItem value={false}>Hoạt động</MenuItem>
                <MenuItem value={true}>Khóa</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSubmit} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialogs */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn xóa tài khoản này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editConfirmOpen} onClose={() => setEditConfirmOpen(false)}>
        <DialogTitle>Xác nhận thay đổi</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn lưu thay đổi?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditConfirmOpen(false)}>Hủy</Button>
          <Button onClick={saveAccount} color="primary">Xác nhận</Button>
        </DialogActions>
      </Dialog>

      {/* Add info dialog before the last Snackbar */}
      <Dialog open={infoDialog.open} onClose={() => setInfoDialog({...infoDialog, open: false})} maxWidth="sm" fullWidth>
        <DialogTitle>Thông tin cá nhân</DialogTitle>
        <DialogContent>
          {infoDialog.info && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <TextField
                label="Họ và tên"
                value={`${infoDialog.info.firstName} ${infoDialog.info.middleName} ${infoDialog.info.lastName}`}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="CIC"
                value={infoDialog.info.cic}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Ngày sinh"
                value={infoDialog.info.dateOfBirth}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Giới tính"
                value={infoDialog.info.sex ? 'Nam' : 'Nữ'}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                value={infoDialog.info.permanentAddress}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Số điện thoại"
                value={infoDialog.info.phoneNumber}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Email"
                value={infoDialog.info.email}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialog({...infoDialog, open: false})}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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