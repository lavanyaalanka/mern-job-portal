import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-Time'
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyJobs();
    fetchApplications();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const adminId = JSON.parse(atob(token.split('.')[1])).userId;
      const adminJobs = res.data.filter(job => job.createdBy._id === adminId);
      setJobs(adminJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err.message);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err.message);
    }
  };

  const handleJobChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Job posted');
      setJobData({ title: '', description: '', location: '', type: 'Full-Time' });
      fetchMyJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Job posting failed');
    }
  };

  const handleApprove = async (appId) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/approve/${appId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Application approved');
      fetchApplications();
    } catch (err) {
      alert('Approval failed');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Admin Dashboard 🛠️</h2>

      <h3>📝 Post a Job</h3>
      <form onSubmit={handleJobPost}>
        <input type="text" name="title" placeholder="Title" value={jobData.title} onChange={handleJobChange} required />
        <input type="text" name="location" placeholder="Location" value={jobData.location} onChange={handleJobChange} required />
        <textarea name="description" placeholder="Description" value={jobData.description} onChange={handleJobChange} rows={3} required />
        <select name="type" value={jobData.type} onChange={handleJobChange}>
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Internship</option>
        </select>
        <button type="submit">Post</button>
      </form>

      <h3 style={{ marginTop: '30px' }}>📄 Jobs Posted by You</h3>
      {jobs.map(job => (
        <div key={job._id} style={styles.card}>
          <h4>{job.title}</h4>
          <p>{job.description}</p>
          <p><strong>Location:</strong> {job.location}</p>
        </div>
      ))}

      <h3 style={{ marginTop: '30px' }}>🧾 User Applications</h3>
      {applications.length === 0 ? <p>No applications yet.</p> : (
        applications.map(app => (
          <div key={app._id} style={styles.card}>
            <p><strong>User:</strong> {app.user.username} ({app.user.email})</p>
            <p><strong>Job:</strong> {app.job.title}</p>
            <p><strong>Applied at:</strong> {new Date(app.appliedAt).toLocaleString()}</p>
            <button onClick={() => handleApprove(app._id)}>✅ Approve</button>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    background: '#f9f9f9'
  }
};

export default AdminDashboard;
