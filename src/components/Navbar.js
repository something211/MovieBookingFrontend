import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🎬 MovieBook</div>
      <div style={styles.links}>
        {token ? (
          <>
            {/* User Links */}
            <Link to="/home" style={styles.link}>Home</Link>
            <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>

            {/* Admin Links */}
            {role === 'ROLE_ADMIN' && (
              <>
                <Link to="/admin" style={styles.adminLink}>Dashboard</Link>
                <Link to="/admin/movies" style={styles.adminLink}>Movies</Link>
                <Link to="/admin/theaters" style={styles.adminLink}>Theaters</Link>
                <Link to="/admin/shows" style={styles.adminLink}>Shows</Link>
                <Link to="/admin/bookings" style={styles.adminLink}>All Bookings</Link>
              </>
            )}

            <span style={styles.username}>👤 {username}</span>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#1a1a2e',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    flexWrap: 'wrap',
    gap: '10px'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e94560'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px'
  },
  adminLink: {
    color: '#f5a623',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  username: {
    color: '#e94560',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Navbar;
