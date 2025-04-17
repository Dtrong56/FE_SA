import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function RouteMapManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý lộ trình tuyến xe
      </Typography>
      <Typography paragraph>
        Nội dung quản lý lộ trình tuyến xe sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}