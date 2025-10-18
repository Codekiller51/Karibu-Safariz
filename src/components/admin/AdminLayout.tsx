import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  Package, 
  Users, 
  Star, 
  FileText, 
  Map, 
  Info, 
  MessageSquare, 
  CreditCard, 
  BarChart2, 
  Settings,
  ChevronDown,
  Shield
} from 'lucide-react';
import { supabase, db } from '../../lib/supabase';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      const { data: profile, error } = await db.getProfile(user.id);
      
      if (error) {
        console.error('Error fetching profile:', error);
        navigate('/admin/login');
        return;
      }
      
      if (!profile?.is_admin) {
        navigate('/admin/login');
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAdmin();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart2 },
    { name: 'Tour Packages', href: '/admin/tours', icon: Package },
    { name: 'Bookings', href: '/admin/bookings', icon: CreditCard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { name: 'Destinations', href: '/admin/destinations', icon: Map },
    { name: 'Travel Info', href: '/admin/travel-info', icon: Info },
    { name: 'Contact Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-900 p-4">
          <div className="flex items-center space-x-2 text-white">
            <Shield className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-gray-900 pt-16">
            <div className="p-4">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                        location.pathname === item.href
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-10 pt-6 border-t border-gray-700">
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md w-full"
                >
                  <LogOut className="mr-3 h-6 w-6" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-gray-900 lg:pt-5">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-2 text-white">
            <Shield className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronDown className={`h-5 w-5 transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className={`mt-5 flex-1 flex flex-col overflow-y-auto ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-700 px-2">
            <button
              onClick={handleSignOut}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white w-full"
            >
              <LogOut className="mr-3 h-6 w-6" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:pl-64 flex flex-col flex-1`}>
        <main className="flex-1 pb-8">
          <div className="mt-8 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;