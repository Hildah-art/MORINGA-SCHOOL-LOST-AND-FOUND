import React, { useState } from 'react';

const ReportLostItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    urgency: '',
    location: '',
    description: '',
    image: null,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prevData) => ({ ...prevData, image: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('date', formData.date);
    data.append('urgency', formData.urgency);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('user_id', 1); 
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await fetch('http://localhost:5000/lost-items', {
        method: 'POST',
        body: data,
      });

      const text = await response.text();
      let responseBody = null;
      try {
        responseBody = text ? JSON.parse(text) : null;
      } catch (parseError) {
        console.warn('Non-JSON response from server:', text);
      }

      if (response.ok) {
        setMessage('Report submitted successfully!');
        setError('');
        setFormData({
          title: '',
          category: '',
          date: '',
          urgency: '',
          location: '',
          description: '',
          image: null,
        });
      } else {
        setError(responseBody?.message || 'Failed to submit report.');
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="report-lost-item-container">
      <h2>Report Lost Item</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Bags">Bags</option>
          <option value="Accessories">Accessories</option>
          <option value="Other">Other</option>
        </select>

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <label>Urgency</label>
        <select
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
        >
          <option value="">Select urgency</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Library, Cafeteria, Dorm"
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide more details..."
          required
        ></textarea>

        <label>Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportLostItem;
