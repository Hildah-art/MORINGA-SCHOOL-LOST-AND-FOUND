import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Navbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;