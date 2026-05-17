import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await getUserBookings(userId);
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setLoading(true);
    try {
      await cancelBooking(id);
      setMessage('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setLoading(false);
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎟 My Bookings</h1>
      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}
      {bookings.length === 0 ? (
        <div style={styles.noData}>
          <p>No bookings found!</p>
          <p>Go to Home page to book tickets.</p>
        </div>
      ) : (
        bookings.map(booking => (
          <div key={booking.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.movieTitle}>🎬 {booking.movieTitle}</h3>
              <span style={{
                ...styles.status,
                color: getStatusColor(booking.status)
              }}>
                {booking.status}
              </span>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.details}>
                <p style={styles.detail}>🏛 {booking.theaterName}</p>
                <p style={styles.detail}>
                  📅 {new Date(booking.showTime).toLocaleString()}
                </p>
                <p style={styles.detail}>💺 Seats: {booking.numberOfSeats}</p>
                <p style={styles.detail}>💰 Total: ₹{booking.totalAmount}</p>
                <p style={styles.detail}>
                  🕐 Booked: {new Date(booking.bookingTime).toLocaleString()}
                </p>
              </div>
              {booking.status === 'CONFIRMED' && (
                <button
                  style={styles.cancelButton}
                  onClick={() => handleCancel(booking.id)}
                  disabled={loading}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))
      )}
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
    fontSize: '32px',
    marginBottom: '30px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  movieTitle: {
    color: '#1a1a2e',
    margin: 0,
    fontSize: '20px'
  },
  status: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  cardBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  details: {
    flex: 1
  },
  detail: {
    color: '#555',
    fontSize: '15px',
    margin: '5px 0'
  },
  cancelButton: {
    backgroundColor: '#cc0000',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    fontSize: '18px',
    marginTop: '50px'
  },
  error: {
    backgroundColor: '#ffe0e0',
    color: '#cc0000',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px'
  },
  success: {
    backgroundColor: '#e0ffe0',
    color: '#006600',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px'
  }
};

export default MyBookings;