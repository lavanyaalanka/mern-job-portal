import React, { useState } from 'react';
import axios from 'axios';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-Time',
  });

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Job posted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting job');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '30px' }}>
      <h2>📢 Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
        </select>
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
