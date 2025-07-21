import React, { useState } from 'react';
import './ReportLostItem.css';

function ReportLostItem() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    urgency: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
  };

  return (
    <div className='all'>
    <div className="report-form-container">
      <h2>Report Lost Item</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <label>Title</label>
        <input
          type="text"
          name="title"
          placeholder="Description of the item"
          value={formData.title}
          onChange={handleChange}
        />

        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="ID/Document">ID/Document</option>
          <option value="Other">Other</option>
        </select>

        <div className="row">
          <div className="half">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="half">
            <label>Urgency</label>
            <select name="urgency" value={formData.urgency} onChange={handleChange}>
              <option value="">select urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <label>Image</label>
        <div className="upload-box">
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>

        <button type="submit">Submit report</button>
      </form>
    </div>
    </div>
  );
}

export default ReportLostItem;
