import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { api } from "../api/api";

const AddItems = () => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    found_location: "",
    date: "",
    image: "", // optional if you add image later
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setError("");

    try {
      await api.reportFoundItem({
        description: formData.description,
        category: formData.category,
        found_location: formData.found_location,
        date: formData.date,
        image: formData.image,
      });

      setSuccessMsg("Item added successfully!");
      setFormData({
        description: "",
        category: "",
        found_location: "",
        date: "",
        image: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add item. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add Found Item
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          {successMsg && (
            <Typography color="success.main">{successMsg}</Typography>
          )}
          {error && <Typography color="error.main">{error}</Typography>}

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
              <MenuItem value="documents">Documents</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Location Found"
            name="found_location"
            value={formData.found_location}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Date Found"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          {/* Optional image input later if needed */}
          <TextField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<AddCircle />}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Item"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddItems;
