import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout'; // Thêm dòng này
import { useNavigate } from 'react-router-dom'; // Thêm dòng này
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RouteIcon from '@mui/icons-material/Route';
import ImageIcon from '@mui/icons-material/Image';
import MapIcon from '@mui/icons-material/Map';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArticleIcon from '@mui/icons-material/Article';

// Import các component
import AccountManagement from '../components/AccountManagement';
import RoleManagement from '../components/RoleManagement';
import StationManagement from '../components/StationManagement';
import RouteManagement from '../components/RouteManagement';
import MediaManagement from '../components/MediaManagement';
import RouteMapManagement from '../components/RouteMapManagement';
import CustomerManagement from '../components/CustomerManagement';
import TicketManagement from '../components/TicketManagement';
import VoucherManagement from '../components/VoucherManagement';
import InvoiceManagement from '../components/InvoiceManagement';
import BlogManagement from '../components/BlogManagement';

const drawerWidth = 280;

const menuItems = [
  { text: 'Quản lý thông tin nhân viên', icon: <AccountCircleIcon />, component: <AccountManagement /> },
  { text: 'Quản lý tài khoản', icon: <SecurityIcon />, component: <RoleManagement /> },
  { text: 'Quản lý trạm dừng', icon: <DirectionsBusIcon />, component: <StationManagement /> },
  { text: 'Quản lý tuyến xe và phân công', icon: <RouteIcon />, component: <RouteManagement /> },
  { text: 'Quản lý media', icon: <ImageIcon />, component: <MediaManagement /> },
  { text: 'Quản lý lộ trình tuyến xe', icon: <MapIcon />, component: <RouteMapManagement /> },
  { text: 'Quản lý thông tin khách hàng', icon: <PeopleIcon />, component: <CustomerManagement /> },
  { text: 'Xem thông tin đặt vé theo ngày', icon: <ConfirmationNumberIcon />, component: <TicketManagement /> },
  { text: 'Quản lý voucher', icon: <LocalOfferIcon />, component: <VoucherManagement /> },
  { text: 'Xem thông tin hóa đơn', icon: <ReceiptIcon />, component: <InvoiceManagement /> },
  { text: 'Quản lý Blog và Review', icon: <ArticleIcon />, component: <BlogManagement /> }
];

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate(); // Thêm dòng này

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  // Thêm hàm xử lý logout
  const handleLogout = () => {
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems[selectedIndex].text}
          </Typography>
          {/* Thêm nút logout ở bên phải AppBar */}
          <IconButton color="inherit" onClick={handleLogout} title="Đăng xuất">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {menuItems[selectedIndex].component}
      </Box>
    </Box>
  );
}