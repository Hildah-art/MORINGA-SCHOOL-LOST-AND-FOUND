import React from 'react';
import { 
  Box, // Add this import
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Drawer, 
  Divider,
  Typography // You can remove the separate Typography import
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CheckCircle as ApproveIcon,
  AddCircle as AddIcon,
  People as UsersIcon,
  Payment as PaymentIcon,
  Gavel as DisputesIcon,
  Notifications as NotificationsIcon,
  Assessment as ReportsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Approve Items', icon: <ApproveIcon />, path: '/approve-items' },
    { text: 'Add Items', icon: <AddIcon />, path: '/add-items' },
    { text: 'Manage Users', icon: <UsersIcon />, path: '/manage-users' },
    { text: 'Payment History', icon: <PaymentIcon />, path: '/payment-history' },
    { text: 'Resolve Disputes', icon: <DisputesIcon />, path: '/resolve-disputes' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Admin Panel</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;