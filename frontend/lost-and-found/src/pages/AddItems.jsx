import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { AddCircle } from '@mui/icons-material';

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    dateFound: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Item added:', formData);
    alert('Item added successfully!');
    setFormData({
      name: '',
      description: '',
      category: '',
      location: '',
      dateFound: '',
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Add New Item</Typography>
      
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Item Name"
            name="name"
            value={formData.name}
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
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Date Found"
            name="dateFound"
            type="date"
            value={formData.dateFound}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddCircle />}
            sx={{ mt: 2 }}
          >
            Add Item
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddItems;