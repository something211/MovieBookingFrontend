import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowsByMovie, createBooking } from '../services/api';

const MovieDetail = () => {
  const { id, title, genre, language, durationMinutes, description } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const res = await getShowsByMovie(id);
      setShows(res.data);
    } catch {
      setError('Failed to load shows');
    }
  };

  const handleBooking = async (showId, availableSeats, ticketPrice) => {
    if (seats > availableSeats) {
      setError(`Only ${availableSeats} seats available!`);
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const userId = localStorage.getItem('userId');
      await createBooking(userId, showId, seats);
      setMessage(`✅ Successfully booked ${seats} seat(s) for ₹${ticketPrice * seats}!`);
      fetchShows();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Back Button */}
      <button
        onClick={() => navigate('/home')}
        style={styles.backButton}
      >
        ← Back to Movies
      </button>

      {/* Movie Info Card */}
      <div style={styles.movieCard}>
        <div style={styles.movieLeft}>
          <div style={styles.moviePoster}>🎬</div>
        </div>
        <div style={styles.movieRight}>
          <h1 style={styles.movieTitle}>{title}</h1>
          <div style={styles.badges}>
            <span style={styles.badge}>🎭 {genre}</span>
            <span style={styles.badge}>🌐 {language}</span>
            <span style={styles.badge}>⏱ {durationMinutes} mins</span>
          </div>
          <p style={styles.description}>{description}</p>
        </div>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      {/* Shows Section */}
      <div style={styles.showsSection}>
        <h2 style={styles.showsTitle}>🎟 Available Shows</h2>

        {/* Seats Selector */}
        <div style={styles.seatsSelector}>
          <label style={styles.seatsLabel}>Number of Seats:</label>
          <div style={styles.seatsControl}>
            <button
              onClick={() => setSeats(prev => Math.max(1, prev - 1))}
              style={styles.seatControlBtn}
            >−</button>
            <span style={styles.seatsCount}>{seats}</span>
            <button
              onClick={() => setSeats(prev => Math.min(10, prev + 1))}
              style={styles.seatControlBtn}
            >+</button>
          </div>
        </div>

        {/* Shows List */}
        {shows.length === 0 ? (
          <div style={styles.noShows}>
            <p>😞 No shows available for this movie</p>
            <button
              onClick={() => navigate('/home')}
              style={styles.browseButton}
            >
              Browse Other Movies
            </button>
          </div>
        ) : (
          <div style={styles.showsList}>
            {shows.map(show => (
              <div key={show.id} style={styles.showCard}>
                <div style={styles.showLeft}>
                  <h3 style={styles.theaterName}>🏛 {show.theaterName}</h3>
                  <p style={styles.showTime}>
                    📅 {new Date(show.showTime).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p style={styles.showTime}>
                    🕐 {new Date(show.showTime).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p style={styles.seatsInfo}>
                    💺 {show.availableSeats} seats available
                  </p>
                </div>
                <div style={styles.showRight}>
                  <p style={styles.price}>₹{show.ticketPrice}</p>
                  <p style={styles.perSeat}>per seat</p>
                  <p style={styles.total}>
                    Total: ₹{show.ticketPrice * seats}
                  </p>
                  <button
                    style={{
                      ...styles.bookButton,
                      opacity: show.availableSeats < seats ? 0.5 : 1,
                      cursor: show.availableSeats < seats
                        ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => handleBooking(
                      show.id,
                      show.availableSeats,
                      show.ticketPrice
                    )}
                    disabled={loading || show.availableSeats < seats}
                  >
                    {show.availableSeats < seats
                      ? 'Not Enough Seats'
                      : loading ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  backButton: {
    backgroundColor: 'transparent',
    border: '2px solid #1a1a2e',
    color: '#1a1a2e',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    marginBottom: '25px',
    fontWeight: 'bold'
  },
  movieCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    display: 'flex',
    gap: '30px',
    marginBottom: '30px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  },
  movieLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  moviePoster: {
    fontSize: '120px',
    width: '200px',
    height: '200px',
    backgroundColor: '#1a1a2e',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  movieRight: {
    flex: 1
  },
  movieTitle: {
    color: '#1a1a2e',
    fontSize: '36px',
    marginBottom: '15px'
  },
  badges: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },
  badge: {
    backgroundColor: '#f0f2f5',
    color: '#333',
    padding: '6px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  description: {
    color: '#666',
    fontSize: '16px',
    lineHeight: '1.6'
  },
  showsSection: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
  },
  showsTitle: {
    color: '#1a1a2e',
    fontSize: '24px',
    marginBottom: '20px'
  },
  seatsSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px',
    backgroundColor: '#f8f9fa',
    padding: '15px 20px',
    borderRadius: '10px'
  },
  seatsLabel: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  seatsControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  seatControlBtn: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  seatsCount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    minWidth: '30px',
    textAlign: 'center'
  },
  showsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  showCard: {
    border: '2px solid #eee',
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    transition: 'border-color 0.2s'
  },
  showLeft: {
    flex: 1
  },
  theaterName: {
    color: '#1a1a2e',
    fontSize: '18px',
    margin: '0 0 8px 0'
  },
  showTime: {
    color: '#555',
    fontSize: '15px',
    margin: '4px 0'
  },
  seatsInfo: {
    color: '#009900',
    fontSize: '15px',
    margin: '4px 0',
    fontWeight: 'bold'
  },
  showRight: {
    textAlign: 'center'
  },
  price: {
    color: '#e94560',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0'
  },
  perSeat: {
    color: '#999',
    fontSize: '13px',
    margin: '2px 0 8px 0'
  },
  total: {
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 12px 0'
  },
  bookButton: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  noShows: {
    textAlign: 'center',
    padding: '40px',
    color: '#999'
  },
  browseButton: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    marginTop: '15px'
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

export default MovieDetail;