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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch tours
        const { data: tours, error: toursError } = await admin.getAllTourPackages();
        if (toursError) throw toursError;
        
        // Fetch users
        const { data: users, error: usersError } = await admin.getAllUsers();
        if (usersError) throw usersError;
        
        // Fetch bookings
        const { data: bookings, error: bookingsError } = await admin.getAllBookings();
        if (bookingsError) throw bookingsError;
        
        // Fetch reviews
        const { data: reviews, error: reviewsError } = await admin.getAllReviews();
        if (reviewsError) throw reviewsError;
        
        // Fetch inquiries
        const { data: inquiries, error: inquiriesError } = await admin.getAllContactInquiries();
        if (inquiriesError) throw inquiriesError;
        
        // Fetch payments
        const { data: payments, error: paymentsError } = await admin.getAllPayments();
        if (paymentsError) throw paymentsError;
        
        // Calculate stats
        const pendingBookings = bookings?.filter(booking => booking.status === 'pending').length || 0;
        const pendingReviews = reviews?.filter(review => !review.verified).length || 0;
        const newInquiries = inquiries?.filter(inquiry => inquiry.status === 'new').length || 0;
        
        // Calculate total revenue
        const totalRevenue = payments?.reduce((sum, payment) => {
          if (payment.status === 'completed') {
            return sum + parseFloat(payment.amount);
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
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Tours', value: stats.totalTours, icon: Package, href: '/admin/tours', color: 'bg-blue-500' },
    { name: 'Total Users', value: stats.totalUsers, icon: Users, href: '/admin/users', color: 'bg-green-500' },
    { name: 'Total Bookings', value: stats.totalBookings, icon: CreditCard, href: '/admin/bookings', color: 'bg-purple-500' },
    { name: 'Total Reviews', value: stats.totalReviews, icon: Star, href: '/admin/reviews', color: 'bg-yellow-500' },
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, href: '/admin/bookings', color: 'bg-green-600' },
    { name: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, href: '/admin/inquiries', color: 'bg-indigo-500' },
  ];

  const alertCards = [
    { name: 'Pending Bookings', value: stats.pendingBookings, icon: Calendar, href: '/admin/bookings', color: 'bg-orange-500' },
    { name: 'Pending Reviews', value: stats.pendingReviews, icon: Star, href: '/admin/reviews', color: 'bg-yellow-600' },
    { name: 'New Inquiries', value: stats.newInquiries, icon: MessageSquare, href: '/admin/inquiries', color: 'bg-red-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the Karibu Safariz admin dashboard. Here's an overview of your website's performance.
        </p>
      </div>

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
                  <div className="font-medium text-orange-600 hover:text-orange-500">
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
                    <div className="font-medium text-orange-600 hover:text-orange-500">
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
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg p-4 text-center"
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
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 text-center"
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
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-md p-2 mr-4">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">New booking received</p>
                  </div>
                  <div className="text-sm text-gray-500">5 minutes ago</div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 rounded-md p-2 mr-4">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">New review submitted</p>
                  </div>
                  <div className="text-sm text-gray-500">1 hour ago</div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-md p-2 mr-4">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                  </div>
                  <div className="text-sm text-gray-500">3 hours ago</div>
                </div>
              </div>
            </li>
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-100 rounded-md p-2 mr-4">
                      <MessageSquare className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">New contact inquiry</p>
                  </div>
                  <div className="text-sm text-gray-500">5 hours ago</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;