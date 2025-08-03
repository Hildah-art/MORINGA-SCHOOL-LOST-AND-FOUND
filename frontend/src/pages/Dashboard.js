import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
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
} from "chart.js";
import { api } from "../api/api";

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
  const [stats, setStats] = useState([]);
  const [trendData, setTrendData] = useState(null);
  const [userActivityData, setUserActivityData] = useState(null);
  const [apiStat, setApiStat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [lostRes, foundRes, userRes] = await Promise.all([
        api.getLostItems(),
        api.getFoundItems(),
        api.getAllUsers(),
      ]);

      const lostItems = lostRes.items || lostRes || [];
      const foundItems = foundRes.items || foundRes || [];
      const users = userRes || [];

      const resolvedLost = lostItems.filter((item) => item.status !== "LOST");

      setStats([
        {
          title: "Lost Items",
          value: lostItems.length,
          change: "+12%", // Placeholder
        },
        {
          title: "Found Items",
          value: foundItems.length,
          change: "+8%",
        },
        {
          title: "Active Users",
          value: users.filter((u) => u.active).length,
          change: "+5%",
        },
        {
          title: "Resolved Cases",
          value: resolvedLost.length,
          change: "+3%",
        },
      ]);

      // Optional dummy trends
      setTrendData({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Lost Items",
            data: [12, 18, 15, 20, 19, 24],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Found Items",
            data: [10, 12, 17, 25, 22, 28],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });

      setUserActivityData({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Active Users",
            data: [120, 140, 130, 150, 160, 140, 156],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const checkApiStatus = async () => {
    try {
      await api.ping();
      setApiStat(true);
    } catch (err) {
      setApiStat(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography
        color={apiStat ? "success.main" : "error.main"}
        sx={{ mb: 2 }}
      >
        API Status: {apiStat ? "Connected" : "Disconnected"}
      </Typography>

      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{stat.title}</Typography>
              <Typography variant="h4">{stat.value}</Typography>
              <Typography
                color={
                  stat.change.startsWith("+") ? "success.main" : "error.main"
                }
              >
                {stat.change} from last month
              </Typography>
            </Paper>
          </Grid>
        ))}

        {trendData && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Lost & Found Trend
              </Typography>
              <Line data={trendData} />
            </Paper>
          </Grid>
        )}

        {userActivityData && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                User Activity
              </Typography>
              <Bar data={userActivityData} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
