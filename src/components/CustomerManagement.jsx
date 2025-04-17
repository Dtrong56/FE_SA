import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function CustomerManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý thông tin khách hàng
      </Typography>
      <Typography paragraph>
        Nội dung quản lý thông tin khách hàng sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}