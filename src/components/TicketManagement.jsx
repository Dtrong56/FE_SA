import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function TicketManagement() {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Xem thông tin đặt vé theo ngày
      </Typography>
      <Typography paragraph>
        Nội dung xem thông tin đặt vé theo ngày sẽ được hiển thị tại đây.
      </Typography>
    </Paper>
  );
}