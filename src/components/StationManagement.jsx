import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function StationManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý trạm dừng
      </Typography>
      <Typography paragraph>
        Nội dung quản lý trạm dừng sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}