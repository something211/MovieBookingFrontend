import React, { useState, useEffect } from 'react';
import { getAllTheaters, addTheater, updateTheater, deleteTheater } from '../../services/api';

const ManageTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [formData, setFormData] = useState({
    name: '', location: '', totalSeats: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchTheaters(); }, []);

  const fetchTheaters = async () => {
    try {
      const res = await getAllTheaters();
      setTheaters(res.data);
    } catch { setError('Failed to load theaters'); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      if (editingId) {
        await updateTheater(editingId, formData);
        setMessage('Theater updated!');
      } else {
        await addTheater(formData);
        setMessage('Theater added!');
      }
      setFormData({ name: '', location: '', totalSeats: '' });
      setEditingId(null);
      fetchTheaters();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (theater) => {
    setEditingId(theater.id);
    setFormData({
      name: theater.name,
      location: theater.location,
      totalSeats: theater.totalSeats
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this theater?')) return;
    try {
      await deleteTheater(id);
      setMessage('Theater deleted!');
      fetchTheaters();
    } catch { setError('Delete failed'); }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏛 Manage Theaters</h1>
      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      {/* Form */}
      <div style={styles.form}>
        <h2 style={styles.formTitle}>
          {editingId ? '✏️ Edit Theater' : '➕ Add New Theater'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <input
              name="name"
              placeholder="Theater Name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="totalSeats"
              placeholder="Total Seats"
              type="number"
              value={formData.totalSeats}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formButtons}>
            <button type="submit" style={styles.submitButton}>
              {editingId ? 'Update Theater' : 'Add Theater'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', location: '', totalSeats: '' });
                }}
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
        <h2 style={styles.formTitle}>📋 All Theaters</h2>
        {theaters.length === 0 ? (
          <p style={styles.noData}>No theaters added yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Total Seats</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map(theater => (
                <tr key={theater.id} style={styles.tableRow}>
                  <td style={styles.td}>{theater.name}</td>
                  <td style={styles.td}>{theater.location}</td>
                  <td style={styles.td}>{theater.totalSeats}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(theater)}
                      style={styles.editButton}
                    >✏️ Edit</button>
                    <button
                      onClick={() => handleDelete(theater.id)}
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
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
    gap: '15px', marginBottom: '15px'
  },
  input: {
    padding: '10px', borderRadius: '5px',
    border: '1px solid #ddd', fontSize: '15px',
    width: '100%', boxSizing: 'border-box'
  },
  formButtons: { display: 'flex', gap: '10px' },
  submitButton: {
    backgroundColor: '#0f3460', color: 'white',
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
  tableHeader: { backgroundColor: '#0f3460' },
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

export default ManageTheaters;