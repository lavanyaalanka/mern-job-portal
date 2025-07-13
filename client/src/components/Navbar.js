import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setIsAdmin(false);
    alert('Logged out!');
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setIsAdmin(decoded.role === 'admin');
      } catch (err) {
        console.error('Invalid token:', err);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [location]);

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>JobPortal</Link>

      <div style={styles.links}>
        <Link to="/jobs" style={styles.link}>All Jobs</Link>

        {!token ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/admin-login" style={styles.link}>Admin Login</Link>
            <Link to="/admin-register" style={styles.link}>Admin Register</Link>
          </>
        ) : (
          <>
            {isAdmin ? (
              <>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/post-job" style={styles.link}>Post Job</Link>
                <Link to="/admin-jobs" style={styles.link}>My Posted Jobs</Link>
                <Link to="/admin" style={styles.link}>Admin Panel</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/my-applications" style={styles.link}>My Applications</Link>
              </>
            )}
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 30px',
    background: '#007bff',
    color: 'white',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px'
  },
  logoutBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
    borderRadius: '4px'
  }
};

export default Navbar;
