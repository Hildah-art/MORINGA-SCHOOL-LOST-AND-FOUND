import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { Check, Clear } from '@mui/icons-material';

const ApproveItems = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Wallet', description: 'Black leather wallet found in cafeteria', date: '2023-05-15', status: 'pending' },
    { id: 2, name: 'Phone', description: 'iPhone 13 found in library', date: '2023-05-16', status: 'pending' },
    { id: 3, name: 'Keys', description: 'Set of car keys with keychain', date: '2023-05-17', status: 'pending' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
  };

  const handleReject = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
  };

  const filteredItems = items.filter(item => 
    item.status === 'pending' && 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Approve Items</Typography>
      
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date Found</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<Check />}
                    onClick={() => handleApprove(item.id)}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<Clear />}
                    onClick={() => handleReject(item.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ApproveItems;