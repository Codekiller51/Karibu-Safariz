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
import BookingsManagement from './BookingsManagement';
import UsersManagement from './UsersManagement';
import ReviewsManagement from './ReviewsManagement';
import InquiriesManagement from './InquiriesManagement';

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
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="destinations" element={<div>Destinations Management</div>} />
        <Route path="inquiries" element={<InquiriesManagement />} />
        <Route path="settings" element={<div>Settings</div>} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;