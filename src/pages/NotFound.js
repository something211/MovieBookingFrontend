import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.message}>
          Oops! The page you are looking for doesn't exist.
        </p>
        <div style={styles.buttons}>
          <button
            onClick={() => navigate('/home')}
            style={styles.homeButton}
          >
            🏠 Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            style={styles.backButton}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: { textAlign: 'center', color: 'white' },
  code: {
    fontSize: '120px',
    color: '#e94560',
    margin: '0',
    lineHeight: 1
  },
  title: {
    fontSize: '36px',
    marginBottom: '15px',
    color: 'white'
  },
  message: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '40px'
  },
  buttons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center'
  },
  homeButton: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '12px 30px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  }
};

export default NotFound;