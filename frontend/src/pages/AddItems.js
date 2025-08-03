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
    title: "",
    description: "",
    category: "",
    urgency: "",
    date: "",
    last_seen_location: "",
    image: null,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setError("");

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("urgency", formData.urgency);
      form.append("date", new Date(formData.date).toString()); // ensures JS format
      form.append("last_seen_location", formData.last_seen_location);
      if (formData.image) {
        form.append("image", formData.image);
      }

      await api.reportLostItem(form);

      setSuccessMsg("Item added successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        urgency: "",
        date: "",
        last_seen_location: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add item. Ensure all fields are filled and valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Report Lost Item
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          {successMsg && (
            <Typography color="success.main">{successMsg}</Typography>
          )}
          {error && <Typography color="error.main">{error}</Typography>}

          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
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
              <MenuItem value="shoes">Shoes</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
              <MenuItem value="documents">Documents</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Urgency</InputLabel>
            <Select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              label="Urgency"
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="CRITICAL">Critical</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Last Seen Location"
            name="last_seen_location"
            value={formData.last_seen_location}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Date Lost"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input
              type="file"
              name="image"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<AddCircle />}
            sx={{ mt: 10, width: "100%" }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Lost Item"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddItems;
