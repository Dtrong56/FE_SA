import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function BlogManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý Blog và Review
      </Typography>
      <Typography paragraph>
        Nội dung quản lý blog và review sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}