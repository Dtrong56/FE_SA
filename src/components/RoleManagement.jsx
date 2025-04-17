import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function RoleManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý phân quyền tài khoản
      </Typography>
      <Typography paragraph>
        Nội dung quản lý phân quyền tài khoản sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}