import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [reportType, setReportType] = useState('items');
  const [timePeriod, setTimePeriod] = useState('month');

  // Sample data for reports
  const itemsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Lost Items',
        data: [12, 19, 15, 22, 18, 24],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Found Items',
        data: [20, 25, 30, 35, 40, 42],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const usersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [30, 45, 50, 60, 70, 80],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const disputesData = {
    labels: ['Resolved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [65, 15, 20],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const getReportData = () => {
    switch(reportType) {
      case 'items':
        return itemsData;
      case 'users':
        return usersData;
      case 'disputes':
        return disputesData;
      default:
        return itemsData;
    }
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF or CSV
    alert(`Downloading ${reportType} report for ${timePeriod}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Generate Reports</Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
            >
              <MenuItem value="items">Lost & Found Items</MenuItem>
              <MenuItem value="users">User Activity</MenuItem>
              <MenuItem value="disputes">Disputes</MenuItem>
              <MenuItem value="payments">Payments</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              label="Time Period"
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="contained" 
            onClick={handleDownload}
            sx={{ height: '56px' }}
          >
            Download Report
          </Button>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {reportType === 'items' && 'Lost & Found Items Report'}
          {reportType === 'users' && 'User Activity Report'}
          {reportType === 'disputes' && 'Disputes Report'}
          {reportType === 'payments' && 'Payments Report'}
        </Typography>
        
        <Box sx={{ height: 400 }}>
          {reportType !== 'disputes' ? (
            <Bar 
              data={getReportData()} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
              }} 
            />
          ) : (
            <Pie 
              data={getReportData()} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
              }} 
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Reports;