import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { api } from "../api/api";
import { NavLink } from "react-router";

const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.login(form);
      if (onLogin) onLogin();
      setSuccess("Login successful!");
      <NavLink
        to="/dashboard"
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal",
          color: isActive ? "#1976d2" : "#000",
        })}
      >
        Dashboard
      </NavLink>;
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Don't have an account? <a href="/register">Register</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
