import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching jobs:', err.message);
      }
    };

    const fetchApplications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/applications/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppliedJobs(res.data.map(app => app.job)); // just job IDs
      } catch (err) {
        console.error('Error fetching applications:', err.message);
      }
    };

    fetchJobs();
    fetchApplications();
  }, [token]);

  const handleApply = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/applications/apply/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Applied successfully!');
      setAppliedJobs([...appliedJobs, jobId]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Welcome to your Dashboard 👤</h2>
      <h3>Available Jobs</h3>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} style={styles.card}>
            <h4>{job.title}</h4>
            <p><strong>Type:</strong> {job.type}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Description:</strong> {job.description}</p>
            {appliedJobs.includes(job._id) ? (
              <button disabled>✅ Already Applied</button>
            ) : (
              <button onClick={() => handleApply(job._id)}>Apply</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    background: '#f9f9f9'
  }
};

export default UserDashboard;
