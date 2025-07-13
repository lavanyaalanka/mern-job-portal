import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // ✅ Fetch applications (newest first, approved at bottom)
  const fetchApplications = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Show approved ones last
      const sorted = res.data.sort((a, b) => {
        if (a.status === 'approved' && b.status !== 'approved') return 1;
        if (a.status !== 'approved' && b.status === 'approved') return -1;
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      });

      setApplications(sorted);
    } catch (err) {
      alert(err.response?.data?.message || 'Error fetching applications');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Approve application
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Application approved!');
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving application');
    }
  };

  // ✅ Reject application
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('❌ Application rejected!');
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting application');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '30px' }}>
      <h2>📋 Admin Panel - Job Applications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} style={boxStyle}>
            <h3>{app.job?.title}</h3>
            <p><strong>Applicant:</strong> {app.user?.username}</p>
            <p><strong>Email:</strong> {app.user?.email}</p>
            <p><strong>Status:</strong> {app.status || 'pending'}</p>
            <p><small>🕒 Applied on: {new Date(app.appliedAt).toLocaleString()}</small></p>

            {/* ✅ Resume Download Button */}
           {app.resumePath && (
  <a
    href={`http://localhost:5000/uploads/${app.resumePath}`}
    target="_blank"
    rel="noopener noreferrer"
    style={downloadLinkStyle}
  >
    📄 Download Resume
  </a>
)}


            {/* ✅ Action buttons */}
            {app.status !== 'approved' && (
              <div style={{ marginTop: '10px' }}>
                <button style={btnStyle} onClick={() => handleApprove(app._id)}>✅ Approve</button>
                <button style={rejectBtnStyle} onClick={() => handleReject(app._id)}>❌ Reject</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const boxStyle = {
  border: '1px solid #ccc',
  padding: '15px',
  marginBottom: '15px',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9'
};

const btnStyle = {
  background: '#28a745',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '10px'
};

const rejectBtnStyle = {
  ...btnStyle,
  background: '#dc3545'
};

const downloadLinkStyle = {
  display: 'inline-block',
  marginTop: '10px',
  marginBottom: '5px',
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: 'bold'
};

export default AdminPanel;
