import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { api } from "../api/api";

const RegisterPage = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    student_staff_id: "",
    role: "Student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // check blanks
    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.phone.trim() ||
      !form.student_staff_id.trim()
    ) {
      setError("All fields are required.");
      return;
    }
    try {
      await api.registerUser(form);
      setSuccess("Registration successful. You can now log in.");
      setForm({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        student_staff_id: "",
        role: "Student",
      });
    } catch (err) {
      console.error(err);
      setError(`Registration failed. Try again later. ${err.message}`);
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={5}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Register
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="full_name"
            placeholder="John Doe"
            value={form.full_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            placeholder="admin@gmail.com"
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
          <TextField
            label="Phone"
            name="phone"
            placeholder="+254712345678"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="ID (Student/Staff)"
            name="student_staff_id"
            placeholder="MOR123456"
            value={form.student_staff_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select name="role" value={form.role} onChange={handleChange}>
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="STAFF">Staff</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
