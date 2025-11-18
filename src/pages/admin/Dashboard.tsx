import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Users, 
  Star, 
  CreditCard, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { admin } from '../../lib/supabase';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalReviews: 0,
    totalInquiries: 0,
    pendingBookings: 0,
    pendingReviews: 0,
    newInquiries: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataErrors, setDataErrors] = useState<Record<string, string>>({});

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDataErrors({});

      const results = await Promise.allSettled([
        admin.getAllTourPackages(),
        admin.getAllUsers(),
        admin.getAllBookings(),
        admin.getAllReviews(false),
        admin.getAllContactInquiries(),
        admin.getAllPayments()
      ]);

      const [toursResult, usersResult, bookingsResult, reviewsResult, inquiriesResult, paymentsResult] = results;

      const tours = toursResult.status === 'fulfilled' && !toursResult.value.error ? toursResult.value.data : null;
      const users = usersResult.status === 'fulfilled' && !usersResult.value.error ? usersResult.value.data : null;
      const bookings = bookingsResult.status === 'fulfilled' && !bookingsResult.value.error ? bookingsResult.value.data : null;
      const reviews = reviewsResult.status === 'fulfilled' && !reviewsResult.value.error ? reviewsResult.value.data : null;
      const inquiries = inquiriesResult.status === 'fulfilled' && !inquiriesResult.value.error ? inquiriesResult.value.data : null;
      const payments = paymentsResult.status === 'fulfilled' && !paymentsResult.value.error ? paymentsResult.value.data : null;

      const errors: Record<string, string> = {};

      if (toursResult.status === 'rejected') {
        errors.tours = 'Failed to load tours';
      } else if (toursResult.value.error) {
        errors.tours = 'Failed to load tours';
      }

      if (usersResult.status === 'rejected') {
        errors.users = 'Failed to load users';
      } else if (usersResult.value.error) {
        errors.users = 'Failed to load users';
      }

      if (bookingsResult.status === 'rejected') {
        errors.bookings = 'Failed to load bookings';
      } else if (bookingsResult.value.error) {
        errors.bookings = 'Failed to load bookings';
      }

      if (reviewsResult.status === 'rejected') {
        errors.reviews = 'Failed to load reviews';
      } else if (reviewsResult.value.error) {
        errors.reviews = 'Failed to load reviews';
      }

      if (inquiriesResult.status === 'rejected') {
        errors.inquiries = 'Failed to load inquiries';
      } else if (inquiriesResult.value.error) {
        errors.inquiries = 'Failed to load inquiries';
      }

      if (paymentsResult.status === 'rejected') {
        errors.payments = 'Failed to load payments';
      } else if (paymentsResult.value.error) {
        errors.payments = 'Failed to load payments';
      }

      if (Object.keys(errors).length > 0) {
        setDataErrors(errors);
        console.warn('Some dashboard data failed to load:', errors);
      }

      // Calculate stats with fallbacks
      const pendingBookings = bookings?.filter(booking => booking.status === 'pending').length || 0;
      const pendingReviews = reviews?.filter(review => !review.verified).length || 0;
      const newInquiries = inquiries?.filter(inquiry => inquiry.status === 'new').length || 0;

      // Calculate total revenue
      const totalRevenue = payments?.reduce((sum, payment) => {
        if (payment.status === 'completed' && payment.amount) {
          return sum + (typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount);
        }
        return sum;
      }, 0) || 0;

      setStats({
        totalTours: tours?.length || 0,
        totalUsers: users?.length || 0,
        totalBookings: bookings?.length || 0,
        totalReviews: reviews?.length || 0,
        totalInquiries: inquiries?.length || 0,
        pendingBookings,
        pendingReviews,
        newInquiries,
        totalRevenue
      });

      if (Object.keys(errors).length === 6) {
        setError('Unable to load dashboard data. Please check your connection and try again.');
      }

    } catch (err) {
      console.error('Unexpected error fetching dashboard data:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Unable to Load Dashboard</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={() => fetchDashboardData()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Tours', value: stats.totalTours, icon: Package, href: '/admin/tours', color: 'bg-blue-500' },
    { name: 'Total Users', value: stats.totalUsers, icon: Users, href: '/admin/users', color: 'bg-green-500' },
    { name: 'Total Bookings', value: stats.totalBookings, icon: CreditCard, href: '/admin/bookings', color: 'bg-teal-500' },
    { name: 'Total Reviews', value: stats.totalReviews, icon: Star, href: '/admin/reviews', color: 'bg-yellow-500' },
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, href: '/admin/bookings', color: 'bg-green-600' },
    { name: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, href: '/admin/inquiries', color: 'bg-sky-500' },
  ];

  const alertCards = [
    { name: 'Pending Bookings', value: stats.pendingBookings, icon: Calendar, href: '/admin/bookings', color: 'bg-blue-500' },
    { name: 'Pending Reviews', value: stats.pendingReviews, icon: Star, href: '/admin/reviews', color: 'bg-yellow-600' },
    { name: 'New Inquiries', value: stats.newInquiries, icon: MessageSquare, href: '/admin/inquiries', color: 'bg-red-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome to the Karibu Safariz admin dashboard. Here's an overview of your website's performance.
            </p>
          </div>
          <button
            onClick={() => fetchDashboardData()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {Object.keys(dataErrors).length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">
                Some dashboard data couldn't be loaded:
              </p>
              <ul className="mt-1 text-sm text-yellow-800 space-y-0.5">
                {Object.entries(dataErrors).map(([key, message]) => (
                  <li key={key}>• {message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <div className="font-medium text-blue-600 hover:text-blue-500">
                    View all
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Alerts Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Alerts & Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alertCards.map((alert) => {
            const Icon = alert.icon;
            return (
              <Link
                key={alert.name}
                to={alert.href}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${alert.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{alert.name}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{alert.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <div className="font-medium text-blue-600 hover:text-blue-500">
                      Take action
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/tours/new"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 text-center"
          >
            Add New Tour
          </Link>
          <Link
            to="/admin/blog/new"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 text-center"
          >
            Create Blog Post
          </Link>
          <Link
            to="/admin/destinations/new"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 text-center"
          >
            Add Destination
          </Link>
          <Link
            to="/admin/travel-info/new"
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg p-4 text-center"
          >
            Add Travel Info
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {stats.pendingBookings > 0 && (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-md p-2 mr-4">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{stats.pendingBookings} pending booking{stats.pendingBookings !== 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-500">Awaiting confirmation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}
            {stats.pendingReviews > 0 && (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-yellow-100 rounded-md p-2 mr-4">
                        <Star className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{stats.pendingReviews} review{stats.pendingReviews !== 1 ? 's' : ''} pending verification</p>
                        <p className="text-xs text-gray-500">Awaiting moderation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}
            {stats.newInquiries > 0 && (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-red-100 rounded-md p-2 mr-4">
                        <MessageSquare className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{stats.newInquiries} new contact inquiry/ies</p>
                        <p className="text-xs text-gray-500">Requires response</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}
            {stats.totalUsers > 0 && (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-md p-2 mr-4">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{stats.totalUsers} total user{stats.totalUsers !== 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-500">Registered on platform</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;