import React, { useState } from 'react';
import { Box, Button, TextField, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText, DialogContentText } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

export default function AccountManagement() {
  const [rows, setRows] = useState([
    // Dữ liệu mẫu
    { id: 1, cic: 'CIC001', hoVaTen: 'Nguyễn Văn A', ngaySinh: '1990-01-01', gioiTinh: 1, diaChi: 'Hà Nội', soDienThoai: '0123456789', email: 'nguyenvana@example.com' },
    { id: 2, cic: 'CIC002', hoVaTen: 'Trần Thị B', ngaySinh: '1992-02-02', gioiTinh: 0, diaChi: 'Hồ Chí Minh', soDienThoai: '0987654321', email: 'tranthib@example.com' },
  ]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'cic', headerName: 'CIC', width: 130 },
    { field: 'hoVaTen', headerName: 'Họ và tên', width: 200 },
    { field: 'ngaySinh', headerName: 'Ngày sinh', width: 130 },
    { 
      field: 'gioiTinh', 
      headerName: 'Giới tính', 
      width: 100,
      valueGetter: (params) => params.value === 1 ? 'Nam' : 'Nữ'
    },
    { field: 'diaChi', headerName: 'Địa chỉ', width: 200 },
    { field: 'soDienThoai', headerName: 'Số điện thoại', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [formData, setFormData] = useState({
    cic: '',
    hoVaTen: '',
    ngaySinh: '',
    gioiTinh: 1,
    diaChi: '',
    soDienThoai: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cic) newErrors.cic = 'CIC không được để trống';
    if (!formData.hoVaTen) newErrors.hoVaTen = 'Họ và tên không được để trống';
    if (!formData.ngaySinh) newErrors.ngaySinh = 'Ngày sinh không được để trống';
    if (!formData.diaChi) newErrors.diaChi = 'Địa chỉ không được để trống';
    if (!formData.soDienThoai) newErrors.soDienThoai = 'Số điện thoại không được để trống';
    if (!formData.email) newErrors.email = 'Email không được để trống';

    // Kiểm tra trùng lặp
    const duplicateCIC = rows.find(row => row.cic === formData.cic && row.id !== (selectedRow?.id || 0));
    const duplicatePhone = rows.find(row => row.soDienThoai === formData.soDienThoai && row.id !== (selectedRow?.id || 0));
    const duplicateEmail = rows.find(row => row.email === formData.email && row.id !== (selectedRow?.id || 0));

    if (duplicateCIC) newErrors.cic = 'CIC đã tồn tại';
    if (duplicatePhone) newErrors.soDienThoai = 'Số điện thoại đã tồn tại';
    if (duplicateEmail) newErrors.email = 'Email đã tồn tại';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    const filteredRows = rows.filter(row =>
      row.cic.toLowerCase().includes(searchText.toLowerCase()) ||
      row.hoVaTen.toLowerCase().includes(searchText.toLowerCase()) ||
      row.email.toLowerCase().includes(searchText.toLowerCase()) ||
      row.soDienThoai.includes(searchText)
    );
    return filteredRows;
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setFormData({
      cic: '',
      hoVaTen: '',
      ngaySinh: '',
      gioiTinh: 1,
      diaChi: '',
      soDienThoai: '',
      email: ''
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setFormData(row);
    setErrors({});
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
    setSelectedRow(null);
    setErrors({});
  };

  const handleSave = () => {
    if (validateForm()) {
      if (selectedRow) {
        // Cập nhật record
        setRows(rows.map(row => row.id === selectedRow.id ? { ...formData, id: selectedRow.id } : row));
      } else {
        // Thêm mới record
        setRows([...rows, { ...formData, id: rows.length + 1 }]);
      }
      handleCloseDialog();
    }
  };

  const handleConfirmDelete = () => {
    setRows(rows.filter(row => row.id !== selectedRow.id));
    setOpenDeleteDialog(false);
    setSelectedRow(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Tìm kiếm..."
          size="small"
          sx={{ flexGrow: 1 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton size="small" onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm mới
        </Button>
      </Paper>
      <DataGrid
        rows={handleSearch()}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        autoHeight
      />

      {/* Dialog thêm/sửa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedRow ? 'Chỉnh sửa thông tin' : 'Thêm mới tài khoản'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="cic"
              label="CIC"
              fullWidth
              value={formData.cic}
              onChange={handleInputChange}
              error={!!errors.cic}
              helperText={errors.cic}
            />
            <TextField
              name="hoVaTen"
              label="Họ và tên"
              fullWidth
              value={formData.hoVaTen}
              onChange={handleInputChange}
              error={!!errors.hoVaTen}
              helperText={errors.hoVaTen}
            />
            <TextField
              name="ngaySinh"
              label="Ngày sinh"
              type="date"
              fullWidth
              value={formData.ngaySinh}
              onChange={handleInputChange}
              error={!!errors.ngaySinh}
              helperText={errors.ngaySinh}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Select
                name="gioiTinh"
                value={formData.gioiTinh}
                onChange={handleInputChange}
                label="Giới tính"
              >
                <MenuItem value={1}>Nam</MenuItem>
                <MenuItem value={0}>Nữ</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="diaChi"
              label="Địa chỉ"
              fullWidth
              value={formData.diaChi}
              onChange={handleInputChange}
              error={!!errors.diaChi}
              helperText={errors.diaChi}
            />
            <TextField
              name="soDienThoai"
              label="Số điện thoại"
              fullWidth
              value={formData.soDienThoai}
              onChange={handleInputChange}
              error={!!errors.soDienThoai}
              helperText={errors.soDienThoai}
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedRow ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tài khoản này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}