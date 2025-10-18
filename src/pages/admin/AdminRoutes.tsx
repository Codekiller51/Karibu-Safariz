import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';
import TourManagement from './TourManagement';
import TourForm from './TourForm';
import BlogManagement from './BlogManagement';
import BlogForm from './BlogForm';
import TravelInfoManagement from './TravelInfoManagement';
import TravelInfoForm from './TravelInfoForm';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tours" element={<TourManagement />} />
        <Route path="tours/new" element={<TourForm />} />
        <Route path="tours/edit/:id" element={<TourForm />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="blog/new" element={<BlogForm />} />
        <Route path="blog/edit/:id" element={<BlogForm />} />
        <Route path="travel-info" element={<TravelInfoManagement />} />
        <Route path="travel-info/new" element={<TravelInfoForm />} />
        <Route path="travel-info/edit/:id" element={<TravelInfoForm />} />
        <Route path="bookings" element={<div>Bookings Management</div>} />
        <Route path="users" element={<div>Users Management</div>} />
        <Route path="reviews" element={<div>Reviews Management</div>} />
        <Route path="destinations" element={<div>Destinations Management</div>} />
        <Route path="inquiries" element={<div>Inquiries Management</div>} />
        <Route path="settings" element={<div>Settings</div>} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;