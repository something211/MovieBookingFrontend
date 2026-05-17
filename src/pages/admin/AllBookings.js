import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../../services/api';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFiltered(bookings);
    } else {
      setFiltered(bookings.filter(b => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
      setFiltered(res.data);
    } catch {
      setError('Failed to load bookings');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return '#006600';
      case 'CANCELLED': return '#cc0000';
      case 'PENDING': return '#ff6600';
      default: return '#333';
    }
  };

  const totalRevenue = filtered
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 All Bookings</h1>
      {error && <div style={styles.error}>{error}</div>}

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{bookings.length}</h3>
          <p style={styles.statLabel}>Total Bookings</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {bookings.filter(b => b.status === 'CONFIRMED').length}
          </h3>
          <p style={styles.statLabel}>Confirmed</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>
            {bookings.filter(b => b.status === 'CANCELLED').length}
          </h3>
          <p style={styles.statLabel}>Cancelled</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>₹{totalRevenue}</h3>
          <p style={styles.statLabel}>Total Revenue</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={styles.filterRow}>
        <label style={styles.filterLabel}>Filter: </label>
        {['ALL', 'CONFIRMED', 'CANCELLED', 'PENDING'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              ...styles.filterButton,
              backgroundColor: statusFilter === status ? '#1a1a2e' : '#ddd',
              color: statusFilter === status ? 'white' : '#333'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        {filtered.length === 0 ? (
          <p style={styles.noData}>No bookings found</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Movie</th>
                <th style={styles.th}>Theater</th>
                <th style={styles.th}>Show Time</th>
                <th style={styles.th}>Seats</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => (
                <tr key={booking.id} style={styles.tableRow}>
                  <td style={styles.td}>#{booking.id}</td>
                  <td style={styles.td}>{booking.username}</td>
                  <td style={styles.td}>{booking.movieTitle}</td>
                  <td style={styles.td}>{booking.theaterName}</td>
                  <td style={styles.td}>
                    {new Date(booking.showTime).toLocaleString()}
                  </td>
                  <td style={styles.td}>{booking.numberOfSeats}</td>
                  <td style={styles.td}>₹{booking.totalAmount}</td>
                  <td style={styles.td}>
                    <span style={{
                      color: getStatusColor(booking.status),
                      fontWeight: 'bold'
                    }}>
                      {booking.status}
                    </span>
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
  statsRow: { display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' },
  statCard: {
    backgroundColor: 'white', borderRadius: '10px',
    padding: '20px', flex: 1, textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', minWidth: '150px'
  },
  statNumber: { color: '#e94560', fontSize: '32px', margin: '0 0 5px 0' },
  statLabel: { color: '#666', fontSize: '14px', margin: 0 },
  filterRow: {
    display: 'flex', alignItems: 'center',
    gap: '10px', marginBottom: '20px', flexWrap: 'wrap'
  },
  filterLabel: { color: '#333', fontWeight: 'bold', fontSize: '15px' },
  filterButton: {
    border: 'none', padding: '8px 16px',
    borderRadius: '20px', cursor: 'pointer',
    fontSize: '14px', fontWeight: 'bold'
  },
  tableContainer: {
    backgroundColor: 'white', borderRadius: '10px',
    padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#1a1a2e' },
  th: { color: 'white', padding: '12px 15px', textAlign: 'left', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 15px', color: '#333', fontSize: '14px' },
  error: {
    backgroundColor: '#ffe0e0', color: '#cc0000',
    padding: '10px', borderRadius: '5px', marginBottom: '15px'
  },
  noData: { color: '#999', textAlign: 'center', padding: '30px', fontSize: '18px' }
};

export default AllBookings;