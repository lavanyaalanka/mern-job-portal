import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/applications/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data);
      } catch (err) {
        alert('Error loading applications');
      }
    };

    fetchApps();
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto' }}>
      <h2>📄 My Applications</h2>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        applications.map(app => (
          <div key={app._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
            <h3>{app.job?.title}</h3>
            <p><strong>Location:</strong> {app.job?.location}</p>
            <p><strong>Status:</strong> {app.status || 'pending'}</p>
            <p><small>Applied on: {new Date(app.appliedAt).toLocaleString()}</small></p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;
