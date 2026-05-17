import React, { useState, useEffect } from 'react';
import { getAllShows, addShow, deleteShow, getAllMovies, getAllTheaters } from '../../services/api';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [formData, setFormData] = useState({
    movieId: '', theaterId: '',
    showTime: '', availableSeats: '', ticketPrice: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [showsRes, moviesRes, theatersRes] = await Promise.all([
        getAllShows(),
        getAllMovies(),
        getAllTheaters()
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);
    } catch { setError('Failed to load data'); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      await addShow(formData);
      setMessage('Show added successfully!');
      setFormData({
        movieId: '', theaterId: '',
        showTime: '', availableSeats: '', ticketPrice: ''
      });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add show');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this show?')) return;
    try {
      await deleteShow(id);
      setMessage('Show deleted!');
      fetchAll();
    } catch { setError('Delete failed'); }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎟 Manage Shows</h1>
      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      {/* Form */}
      <div style={styles.form}>
        <h2 style={styles.formTitle}>➕ Add New Show</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <select
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Movie</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
            <select
              name="theaterId"
              value={formData.theaterId}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Theater</option>
              {theaters.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} - {t.location}
                </option>
              ))}
            </select>
            <input
              name="showTime"
              type="datetime-local"
              value={formData.showTime}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="availableSeats"
              placeholder="Available Seats"
              type="number"
              value={formData.availableSeats}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="ticketPrice"
              placeholder="Ticket Price (₹)"
              type="number"
              value={formData.ticketPrice}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.submitButton}>
            Add Show
          </button>
        </form>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.formTitle}>📋 All Shows</h2>
        {shows.length === 0 ? (
          <p style={styles.noData}>No shows added yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Movie</th>
                <th style={styles.th}>Theater</th>
                <th style={styles.th}>Show Time</th>
                <th style={styles.th}>Seats</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map(show => (
                <tr key={show.id} style={styles.tableRow}>
                  <td style={styles.td}>{show.movieTitle}</td>
                  <td style={styles.td}>{show.theaterName}</td>
                  <td style={styles.td}>
                    {new Date(show.showTime).toLocaleString()}
                  </td>
                  <td style={styles.td}>{show.availableSeats}</td>
                  <td style={styles.td}>₹{show.ticketPrice}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(show.id)}
                      style={styles.deleteButton}
                    >🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '30px' },
  title: { color: '#1a1a2e', fontSize: '32px', marginBottom: '25px' },
  form: {
    backgroundColor: 'white', borderRadius: '10px',
    padding: '25px', marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  formTitle: { color: '#1a1a2e', marginBottom: '20px' },
  formGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '15px', marginBottom: '15px'
  },
  input: {
    padding: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '15px',
    width: '100%', boxSizing: 'border-box'
  },
  submitButton: {
    backgroundColor: '#533483', color: 'white',
    border: 'none', padding: '10px 25px',
    borderRadius: '5px', cursor: 'pointer', fontSize: '15px'
  },
  tableContainer: {
    backgroundColor: 'white', borderRadius: '10px',
    padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#533483' },
  th: { color: 'white', padding: '12px 15px', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 15px', color: '#333' },
  deleteButton: {
    backgroundColor: '#cc0000', color: 'white',
    border: 'none', padding: '6px 12px',
    borderRadius: '4px', cursor: 'pointer'
  },
  error: {
    backgroundColor: '#ffe0e0', color: '#cc0000',
    padding: '10px', borderRadius: '5px', marginBottom: '15px'
  },
  success: {
    backgroundColor: '#e0ffe0', color: '#006600',
    padding: '10px', borderRadius: '5px', marginBottom: '15px'
  },
  noData: { color: '#999', textAlign: 'center', padding: '20px' }
};

export default ManageShows;