import React, { useState, useEffect } from 'react';
import { getAllMovies, addMovie, updateMovie, deleteMovie } from '../../services/api';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    title: '', genre: '', language: '',
    durationMinutes: '', description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const res = await getAllMovies();
      setMovies(res.data);
    } catch { setError('Failed to load movies'); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      if (editingId) {
        await updateMovie(editingId, formData);
        setMessage('Movie updated successfully!');
      } else {
        await addMovie(formData);
        setMessage('Movie added successfully!');
      }
      setFormData({
        title: '', genre: '', language: '',
        durationMinutes: '', description: ''
      });
      setEditingId(null);
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      language: movie.language,
      durationMinutes: movie.durationMinutes,
      description: movie.description
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      setMessage('Movie deleted successfully!');
      fetchMovies();
    } catch { setError('Delete failed'); }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: '', genre: '', language: '',
      durationMinutes: '', description: ''
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎬 Manage Movies</h1>

      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      {/* Form */}
      <div style={styles.form}>
        <h2 style={styles.formTitle}>
          {editingId ? '✏️ Edit Movie' : '➕ Add New Movie'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <input
              name="title"
              placeholder="Movie Title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="genre"
              placeholder="Genre (Action, Drama...)"
              value={formData.genre}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="language"
              placeholder="Language"
              value={formData.language}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="durationMinutes"
              placeholder="Duration (minutes)"
              type="number"
              value={formData.durationMinutes}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              style={{ ...styles.input, gridColumn: 'span 2' }}
            />
          </div>
          <div style={styles.formButtons}>
            <button type="submit" style={styles.submitButton}>
              {editingId ? 'Update Movie' : 'Add Movie'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.formTitle}>📋 All Movies</h2>
        {movies.length === 0 ? (
          <p style={styles.noData}>No movies added yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Genre</th>
                <th style={styles.th}>Language</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id} style={styles.tableRow}>
                  <td style={styles.td}>{movie.title}</td>
                  <td style={styles.td}>{movie.genre}</td>
                  <td style={styles.td}>{movie.language}</td>
                  <td style={styles.td}>{movie.durationMinutes} mins</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(movie)}
                      style={styles.editButton}
                    >✏️ Edit</button>
                    <button
                      onClick={() => handleDelete(movie.id)}
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
  formButtons: { display: 'flex', gap: '10px' },
  submitButton: {
    backgroundColor: '#e94560', color: 'white',
    border: 'none', padding: '10px 25px',
    borderRadius: '5px', cursor: 'pointer', fontSize: '15px'
  },
  cancelButton: {
    backgroundColor: '#666', color: 'white',
    border: 'none', padding: '10px 25px',
    borderRadius: '5px', cursor: 'pointer', fontSize: '15px'
  },
  tableContainer: {
    backgroundColor: 'white', borderRadius: '10px',
    padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#1a1a2e' },
  th: { color: 'white', padding: '12px 15px', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 15px', color: '#333' },
  editButton: {
    backgroundColor: '#0f3460', color: 'white',
    border: 'none', padding: '6px 12px',
    borderRadius: '4px', cursor: 'pointer', marginRight: '8px'
  },
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

export default ManageMovies;