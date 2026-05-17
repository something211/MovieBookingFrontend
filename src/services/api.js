import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Movie APIs
export const getAllMovies = () => api.get('/movies');
export const addMovie = (data) => api.post('/movies', data);
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);
export const searchMovies = (title) => api.get(`/movies/search?title=${title}`);

// Theater APIs
export const getAllTheaters = () => api.get('/theaters');
export const addTheater = (data) => api.post('/theaters', data);
export const updateTheater = (id, data) => api.put(`/theaters/${id}`, data);
export const deleteTheater = (id) => api.delete(`/theaters/${id}`);

// Show APIs
export const getAllShows = () => api.get('/shows');
export const addShow = (data) => api.post('/shows', data);
export const getShowsByMovie = (movieId) => api.get(`/shows/movie/${movieId}`);
export const deleteShow = (id) => api.delete(`/shows/${id}`);

// Booking APIs
export const createBooking = (userId, showId, seats) =>
  api.post(`/bookings?userId=${userId}&showId=${showId}&numberOfSeats=${seats}`);
export const getUserBookings = (userId) => api.get(`/bookings/user/${userId}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const getAllBookings = () => api.get('/bookings');

export default api;