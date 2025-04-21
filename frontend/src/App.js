import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Adjusted path to './pages'
import RegisterPage from './pages/RegisterPage'; // Adjusted path to './pages'
import LoginPage from './pages/LoginPage'; // Adjusted path to './pages'
import DashboardPage from './pages/DashboardPage'; // Adjusted path to './pages'
import DonationPage from './pages/DonationPage'; // Adjusted path to './pages'
import PrivateRoute from './components/PrivateRoute'; // Adjusted path to './components'

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/donate" element={<DonationPage />} />

        {/* 🔒 Protected Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
