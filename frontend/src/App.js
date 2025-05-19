import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage'; // Adjusted path to './pages'
import RegisterPage from './pages/RegisterPage'; // Adjusted path to './pages'
import LoginPage from './pages/LoginPage'; // Adjusted path to './pages'
import DonorDashboardPage from './pages/DonorDashboardPage';
import OrganizationDashboardPage from './pages/OrganizationDashboardPage';
import AddDonationPage from './pages/AddDonationPage';
import MyDonationsPage from './pages/MyDonationsPage';
import MyWastePage from './pages/MyWastePage'; // ✅ Add this line
import DonorProfilePage from './pages/DonorProfilePage';
import OrganizationProfilePage from './pages/OrganizationProfilePage'; // ✅ Add this
import ReceivedDonationsPage from './pages/ReceivedDonationsPage';
import DonationHistoryPage from './pages/DonationHistoryPage';

import RoleBasedRoute from './components/RoleBasedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

import NotFoundPage from './pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <HomePage />
            </PublicOnlyRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
        
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        {/* Donor Protected Routes */}
        <Route path="/donor-dashboard" element={
          <RoleBasedRoute allowedRoles={['donor']}>
            <DonorDashboardPage />
          </RoleBasedRoute>
        } />
        <Route path="/add-donation" element={
          <RoleBasedRoute allowedRoles={['donor']}>
            <AddDonationPage />
          </RoleBasedRoute>
        } />
        <Route path="/mydonations" element={
          <RoleBasedRoute allowedRoles={['donor']}>
            <MyDonationsPage />
          </RoleBasedRoute>
        } />
        <Route path="/mywaste" element={
          <RoleBasedRoute allowedRoles={['donor']}>
            <MyWastePage />
          </RoleBasedRoute>
        } />
        <Route path="/profile" element={
          <RoleBasedRoute allowedRoles={['donor']}>
            <DonorProfilePage />
          </RoleBasedRoute>
        } />

        {/* Organization Protected Routes */}
        <Route path="/organization-dashboard" element={
          <RoleBasedRoute allowedRoles={['organization']}>
            <OrganizationDashboardPage />
          </RoleBasedRoute>
        } />
        <Route path="/donation-history" element={
          <RoleBasedRoute allowedRoles={['organization']}>
            <DonationHistoryPage />
          </RoleBasedRoute>
        } />
        <Route path="/received-donations" element={
          <RoleBasedRoute allowedRoles={['organization']}>
            <ReceivedDonationsPage />
          </RoleBasedRoute>
        } />
        <Route path="/organization-profile" element={
          <RoleBasedRoute allowedRoles={['organization']}>
            <OrganizationProfilePage />
          </RoleBasedRoute>
        } />
      </Routes>
    </Router>
  );
}
