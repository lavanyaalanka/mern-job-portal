import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', location: '', type: '' });
  const [selectedResume, setSelectedResume] = useState({}); // Stores resume per job

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error('Error fetching jobs:', err.message);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const { keyword, location, type } = filters;
    const filtered = jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(keyword.toLowerCase()) &&
        (!location || job.location.toLowerCase().includes(location.toLowerCase())) &&
        (!type || job.type === type)
      );
    });
    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setFilters({ keyword: '', location: '', type: '' });
    setFilteredJobs(jobs);
  };

  const handleFileChange = (jobId, file) => {
    setSelectedResume((prev) => ({ ...prev, [jobId]: file }));
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in first.');

    const resumeFile = selectedResume[jobId];
    if (!resumeFile) return alert('Please upload your resume before applying.');

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/applications/${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error('Apply error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error applying for job');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: 'auto' }}>
      <h1>📋 All Job Listings</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input name="keyword" placeholder="Search by title" value={filters.keyword} onChange={handleFilterChange} />
        <input name="location" placeholder="Location" value={filters.location} onChange={handleFilterChange} />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
        <button onClick={applyFilters}>Filter</button>
        <button onClick={clearFilters}>Clear</button>
      </div>

      {filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        filteredJobs.map((job) => (
          <div
            key={job._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              background: '#f9f9f9',
            }}
          >
            <h3>{job.title}</h3>
            <p>
              <strong>Type:</strong> {job.type}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Description:</strong> {job.description}
            </p>
            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(job._id, e.target.files[0])}
              />
            </div>
            <button onClick={() => handleApply(job._id)} style={{ marginTop: '10px' }}>
              Apply Now
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AllJobs;
