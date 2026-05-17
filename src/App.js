import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import UserProfile from './pages/UserProfile';
import MovieDetail from './pages/MovieDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageTheaters from './pages/admin/ManageTheaters';
import ManageShows from './pages/admin/ManageShows';
import AllBookings from './pages/admin/AllBookings';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// 404
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/my-bookings" element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
        <Route path="/movie/:id/:title/:genre/:language/:durationMinutes/:description" element={
          <PrivateRoute>
            <MovieDetail />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/movies" element={
          <PrivateRoute adminOnly={true}>
            <ManageMovies />
          </PrivateRoute>
        } />
        <Route path="/admin/theaters" element={
          <PrivateRoute adminOnly={true}>
            <ManageTheaters />
          </PrivateRoute>
        } />
        <Route path="/admin/shows" element={
          <PrivateRoute adminOnly={true}>
            <ManageShows />
          </PrivateRoute>
        } />
        <Route path="/admin/bookings" element={
          <PrivateRoute adminOnly={true}>
            <AllBookings />
          </PrivateRoute>
        } />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;