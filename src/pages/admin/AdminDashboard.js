import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: '🎬 Manage Movies',
      desc: 'Add, edit or delete movies',
      path: '/admin/movies',
      color: '#e94560'
    },
    {
      title: '🏛 Manage Theaters',
      desc: 'Add, edit or delete theaters',
      path: '/admin/theaters',
      color: '#0f3460'
    },
    {
      title: '🎟 Manage Shows',
      desc: 'Add or delete shows',
      path: '/admin/shows',
      color: '#533483'
    }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Admin Dashboard</h1>
      <p style={styles.subtitle}>Welcome Admin! Manage your movie booking system.</p>
      <div style={styles.grid}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{ ...styles.card, backgroundColor: card.color }}
            onClick={() => navigate(card.path)}
          >
            <h2 style={styles.cardTitle}>{card.title}</h2>
            <p style={styles.cardDesc}>{card.desc}</p>
            <button style={styles.button}>Go →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '30px'
  },
  title: {
    color: '#1a1a2e',
    fontSize: '36px',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#666',
    fontSize: '18px',
    marginBottom: '40px'
  },
  grid: {
    display: 'flex',
    gap: '25px',
    flexWrap: 'wrap'
  },
  card: {
    borderRadius: '15px',
    padding: '30px',
    width: '250px',
    cursor: 'pointer',
    boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s'
  },
  cardTitle: {
    color: 'white',
    fontSize: '22px',
    marginBottom: '10px'
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    marginBottom: '20px'
  },
  button: {
    backgroundColor: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  }
};

export default AdminDashboard;