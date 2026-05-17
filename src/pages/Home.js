import React, { useState, useEffect } from 'react';
import { getAllMovies, searchMovies, getShowsByMovie, createBooking } from '../services/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await getAllMovies();
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies');
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '') {
      fetchMovies();
    } else {
      try {
        const response = await searchMovies(e.target.value);
        setMovies(response.data);
      } catch (err) {
        setError('Search failed');
      }
    }
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setShows([]);
    setMessage('');
    try {
      const response = await getShowsByMovie(movie.id);
      setShows(response.data);
    } catch (err) {
      setError('Failed to load shows');
    }
  };

  const handleBooking = async (showId) => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const userId = localStorage.getItem('userId');
      await createBooking(userId, showId, seats);
      setMessage(`✅ Successfully booked ${seats} seat(s)!`);
      // Refresh shows
      const response = await getShowsByMovie(selectedMovie.id);
      setShows(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎬 Now Showing</h1>
        <input
          type="text"
          placeholder="🔍 Search movies..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      <div style={styles.content}>
        {/* Movies Grid */}
        <div style={styles.moviesGrid}>
          {movies.length === 0 ? (
            <p style={styles.noData}>No movies available</p>
          ) : (
            movies.map(movie => (
              <div
                key={movie.id}
                style={{
                  ...styles.movieCard,
                  border: selectedMovie?.id === movie.id
                    ? '2px solid #e94560'
                    : '2px solid transparent'
                }}
                onClick={() => handleMovieClick(movie)}
              >
                <div style={styles.movieIcon}>🎥</div>
                <h3 style={styles.movieTitle}>{movie.title}</h3>
                <p style={styles.movieInfo}>🎭 {movie.genre}</p>
                <p style={styles.movieInfo}>🌐 {movie.language}</p>
                <p style={styles.movieInfo}>⏱ {movie.durationMinutes} mins</p>
                <p style={styles.movieDesc}>{movie.description}</p>
                <button style={styles.viewButton}>View Shows</button>
              </div>
            ))
          )}
        </div>

        {/* Shows Panel */}
        {selectedMovie && (
          <div style={styles.showsPanel}>
            <h2 style={styles.showsTitle}>
              🎟 Shows for {selectedMovie.title}
            </h2>

            {/* Seats selector */}
            <div style={styles.seatsSelector}>
              <label style={styles.seatsLabel}>Number of Seats: </label>
              <input
                type="number"
                min="1"
                max="10"
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value))}
                style={styles.seatsInput}
              />
            </div>

            {shows.length === 0 ? (
              <p style={styles.noData}>No shows available</p>
            ) : (
              shows.map(show => (
                <div key={show.id} style={styles.showCard}>
                  <div style={styles.showInfo}>
                    <p style={styles.showDetail}>
                      🏛 {show.theaterName}
                    </p>
                    <p style={styles.showDetail}>
                      📅 {new Date(show.showTime).toLocaleString()}
                    </p>
                    <p style={styles.showDetail}>
                      💺 Available: {show.availableSeats}
                    </p>
                    <p style={styles.showDetail}>
                      💰 ₹{show.ticketPrice} per seat
                    </p>
                    <p style={styles.showDetail}>
                      💳 Total: ₹{show.ticketPrice * seats}
                    </p>
                  </div>
                  <button
                    style={{
                      ...styles.bookButton,
                      opacity: show.availableSeats < seats ? 0.5 : 1
                    }}
                    onClick={() => handleBooking(show.id)}
                    disabled={loading || show.availableSeats < seats}
                  >
                    {loading ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              ))
            )}
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
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  title: {
    color: '#1a1a2e',
    fontSize: '32px',
    margin: 0
  },
  searchInput: {
    padding: '10px 20px',
    borderRadius: '25px',
    border: '2px solid #ddd',
    fontSize: '16px',
    width: '300px',
    outline: 'none'
  },
  content: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  moviesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    flex: 1
  },
  movieCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    width: '200px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    textAlign: 'center'
  },
  movieIcon: {
    fontSize: '48px',
    marginBottom: '10px'
  },
  movieTitle: {
    color: '#1a1a2e',
    fontSize: '18px',
    margin: '0 0 10px 0'
  },
  movieInfo: {
    color: '#666',
    fontSize: '14px',
    margin: '4px 0'
  },
  movieDesc: {
    color: '#999',
    fontSize: '12px',
    margin: '8px 0'
  },
  viewButton: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    fontSize: '14px'
  },
  showsPanel: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    width: '350px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    height: 'fit-content'
  },
  showsTitle: {
    color: '#1a1a2e',
    marginBottom: '20px',
    fontSize: '20px'
  },
  seatsSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '8px'
  },
  seatsLabel: {
    color: '#333',
    fontWeight: 'bold'
  },
  seatsInput: {
    width: '60px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    textAlign: 'center'
  },
  showCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  showInfo: {
    flex: 1
  },
  showDetail: {
    color: '#555',
    fontSize: '14px',
    margin: '4px 0'
  },
  bookButton: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  noData: {
    color: '#999',
    textAlign: 'center',
    padding: '20px'
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

export default Home;