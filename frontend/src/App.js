import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage'; // Adjusted path to './pages'
import RegisterPage from './pages/RegisterPage'; // Adjusted path to './pages'
import LoginPage from './pages/LoginPage'; // Adjusted path to './pages'
import DashboardPage from './pages/DashboardPage'; // Adjusted path to './pages'
// import DonationPage from './pages/DonationPage'; // Adjusted path to './pages'
import PrivateRoute from './components/PrivateRoute'; // Adjusted path to './components'
import DonorDashboardPage from './pages/DonorDashboardPage';
import OrganizationDashboardPage from './pages/OrganizationDashboardPage';
import AddDonationPage from './pages/AddDonationPage';
import MyDonationsPage from './pages/MyDonationsPage';
import MyWastePage from './pages/MyWastePage'; // ✅ Add this line
import DonorProfilePage from './pages/DonorProfilePage';
import OrganizationProfilePage from './pages/OrganizationProfilePage'; // ✅ Add this
import ReceivedDonationsPage from './pages/ReceivedDonationsPage';
import DonationHistoryPage from './pages/DonationHistoryPage'; 



export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/donate" element={<DonationPage />} /> */}
        <Route path="/donor-dashboard" element={<DonorDashboardPage />} />
        <Route path="/organization-dashboard" element={<OrganizationDashboardPage />} />
        <Route path="/add-donation" element={<AddDonationPage />} />
        <Route path="/mydonations" element={<MyDonationsPage />} />
        <Route path="/mywaste" element={<MyWastePage />} /> {/* ✅ Add this route */}
        <Route path="/profile" element={<DonorProfilePage />} />
        <Route path="/organization-profile" element={<OrganizationProfilePage />} />
        <Route path="/received-donations" element={<ReceivedDonationsPage />} />
        <Route path="/donation-history" element={<DonationHistoryPage />} />

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
