import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { Search, DateRange } from '@mui/icons-material';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([
    { id: 1, user: 'John Doe', amount: 50, date: '2023-05-10', method: 'Credit Card', status: 'completed' },
    { id: 2, user: 'Jane Smith', amount: 30, date: '2023-05-12', method: 'PayPal', status: 'completed' },
    { id: 3, user: 'Bob Johnson', amount: 20, date: '2023-05-15', method: 'Bank Transfer', status: 'pending' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

 const filteredPayments = payments.filter(payment => 
  payment.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (dateRange.start === '' || payment.date >= dateRange.start) &&
  (dateRange.end === '' || payment.date <= dateRange.end)
);


  return (
    <Box>
      <Typography variant="h4" gutterBottom>Payment History</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
        />
        
        <TextField
          label="Start Date"
          type="date"
          size="small"
          value={dateRange.start}
          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: <DateRange sx={{ mr: 1 }} />,
          }}
        />
        
        <TextField
          label="End Date"
          type="date"
          size="small"
          value={dateRange.end}
          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          InputLabelProps={{ shrink: true }}
        />
        
        <Button variant="outlined" onClick={() => setDateRange({ start: '', end: '' })}>
          Clear Dates
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.user}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'inline-block', 
                      p: '4px 8px', 
                      borderRadius: 1,
                      backgroundColor: payment.status === 'completed' ? 'success.light' : 'warning.light',
                      color: payment.status === 'completed' ? 'success.contrastText' : 'warning.contrastText',
                    }}
                  >
                    {payment.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentHistory;