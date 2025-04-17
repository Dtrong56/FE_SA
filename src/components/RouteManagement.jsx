import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function RouteManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý tuyến xe và phân công
      </Typography>
      <Typography paragraph>
        Nội dung quản lý tuyến xe và phân công sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}