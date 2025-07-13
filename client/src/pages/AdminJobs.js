import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-Time',
  });

  const token = localStorage.getItem('token');

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('🗑️ Job deleted');
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting job');
    }
  };

  const startEdit = (job) => {
    setEditingJob(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
    });
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setFormData({ title: '', description: '', location: '', type: 'Full-Time' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${editingJob}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Job updated');
      cancelEdit();
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating job');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '30px' }}>
      <h2>🛠️ Manage Job Posts</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            {editingJob === job._id ? (
              <>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  style={inputStyle}
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Description"
                  style={textareaStyle}
                />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  style={inputStyle}
                />
                <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
                <br />
                <button onClick={handleUpdate} style={btnStyleGreen}>💾 Save</button>
                <button onClick={cancelEdit} style={btnStyleGray}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{job.title}</h3>
                <p><strong>Type:</strong> {job.type}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <button onClick={() => startEdit(job)} style={btnStyleBlue}>✏️ Edit</button>
                <button onClick={() => handleDelete(job._id)} style={btnStyleRed}>🗑️ Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  marginBottom: '10px'
};

const textareaStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  resize: 'vertical'
};

const btnStyleGreen = {
  background: '#28a745',
  color: 'white',
  padding: '8px 14px',
  border: 'none',
  borderRadius: '4px',
  marginRight: '10px',
  cursor: 'pointer'
};

const btnStyleRed = {
  background: '#dc3545',
  color: 'white',
  padding: '8px 14px',
  border: 'none',
  borderRadius: '4px',
  marginLeft: '10px',
  cursor: 'pointer'
};

const btnStyleBlue = {
  background: '#007bff',
  color: 'white',
  padding: '8px 14px',
  border: 'none',
  borderRadius: '4px',
  marginRight: '10px',
  cursor: 'pointer'
};

const btnStyleGray = {
  background: '#6c757d',
  color: 'white',
  padding: '8px 14px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default AdminJobs;
