import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function MediaManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý media
      </Typography>
      <Typography paragraph>
        Nội dung quản lý media sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}