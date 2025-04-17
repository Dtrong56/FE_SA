import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function InvoiceManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Xem thông tin hóa đơn
      </Typography>
      <Typography paragraph>
        Nội dung xem thông tin hóa đơn sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}