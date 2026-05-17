import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        <h1 style={styles.username}>{username}</h1>
        <span style={{
          ...styles.roleBadge,
          backgroundColor: role === 'ROLE_ADMIN' ? '#e94560' : '#0f3460'
        }}>
          {role === 'ROLE_ADMIN' ? '👑 Admin' : '👤 User'}
        </span>
        <div style={styles.infoSection}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Account Info</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Username</span>
              <span style={styles.infoValue}>{username}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Role</span>
              <span style={styles.infoValue}>{role}</span>
            </div>
          </div>
        </div>
        <div style={styles.buttons}>
          <button
            onClick={() => navigate('/my-bookings')}
            style={styles.bookingsButton}
          >
            🎟 My Bookings
          </button>
          <button
            onClick={() => navigate('/home')}
            style={styles.homeButton}
          >
            🎬 Browse Movies
          </button>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '40px',
    width: '450px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#1a1a2e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '42px',
    fontWeight: 'bold'
  },
  username: {
    color: '#1a1a2e',
    fontSize: '28px',
    marginBottom: '10px'
  },
  roleBadge: {
    color: 'white',
    padding: '5px 20px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  infoSection: {
    marginTop: '30px',
    marginBottom: '30px'
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'left'
  },
  infoTitle: {
    color: '#1a1a2e',
    marginBottom: '15px',
    fontSize: '18px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  infoLabel: { color: '#666', fontWeight: 'bold' },
  infoValue: { color: '#333' },
  buttons: { display: 'flex', flexDirection: 'column', gap: '12px' },
  bookingsButton: {
    backgroundColor: '#0f3460', color: 'white',
    border: 'none', padding: '12px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px', fontWeight: 'bold'
  },
  homeButton: {
    backgroundColor: '#533483', color: 'white',
    border: 'none', padding: '12px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px', fontWeight: 'bold'
  },
  logoutButton: {
    backgroundColor: '#e94560', color: 'white',
    border: 'none', padding: '12px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px', fontWeight: 'bold'
  }
};

export default UserProfile;