import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Sample data
  const stats = [
    { title: 'Lost Items', value: 24, change: '+12%' },
    { title: 'Found Items', value: 42, change: '+5%' },
    { title: 'Active Users', value: 156, change: '+8%' },
    { title: 'Resolved Cases', value: 89, change: '+3%' },
  ];

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Lost Items',
        data: [12, 19, 15, 22, 18, 24],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Found Items',
        data: [20, 25, 30, 35, 40, 42],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [120, 140, 130, 150, 160, 140, 156],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{stat.title}</Typography>
              <Typography variant="h4">{stat.value}</Typography>
              <Typography color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}>
                {stat.change} from last month
              </Typography>
            </Paper>
          </Grid>
        ))}
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Lost & Found Trend</Typography>
            <Line data={trendData} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>User Activity</Typography>
            <Bar data={userActivityData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;