import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingDetails, AdminStats } from '../types';
import {
  IndianRupee,
  Ticket,
  Users,
  Calendar,
  Search,
  Download,
  Filter,
  RefreshCw,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { setupBookingsListener } from '../firebase/bookings';
import { getBookingStats, getAllBookings } from '../utils/bookingService';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    totalVisitors: 0,
    totalRevenue: 0,
    todayBookings: 0,
    todayRevenue: 0,
    visitorMetrics: { daily: 0, weekly: 0, monthly: 0 },
    peakTimes: [],
    popularMuseums: [],
    monthlyTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Data loading
  useEffect(() => {
    // Try to load from localStorage first for immediate display
    const cachedBookings = localStorage.getItem('adminBookings');
    if (cachedBookings) {
      try {
        const parsedBookings = JSON.parse(cachedBookings);
        if (Array.isArray(parsedBookings)) {
          setBookings(parsedBookings);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error parsing cached bookings:", err);
      }
    }

    // Fetch fresh data
    const fetchInitialData = async () => {
      try {
        console.log("Fetching initial booking data...");
        const bookingsData = await getAllBookings();
        if (Array.isArray(bookingsData)) {
          setBookings(bookingsData);
          localStorage.setItem('adminBookings', JSON.stringify(bookingsData));
        }
      } catch (err) {
        console.error("Error fetching initial booking data:", err);
        // Continue with cached data if available
      }
    };
    
    fetchInitialData();

    // Set up real-time listener
    const unsubscribe = setupBookingsListener((bookingsData) => {
      try {
        console.log("Real-time booking update received");
        if (bookingsData && Array.isArray(bookingsData)) {
          setBookings(bookingsData);
          localStorage.setItem('adminBookings', JSON.stringify(bookingsData));
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error("Error processing bookings data:", err);
        setError("Error updating live data");
      }
    }, (error) => {
      console.error("Error in bookings listener:", error);
      setError("Failed to connect to live data service");
      setLoading(false);
    });

    // Fetch stats separately
    const fetchStats = async () => {
      try {
        console.log("Fetching booking statistics...");
        const statsData = await getBookingStats();
        if (statsData && typeof statsData.totalBookings === 'number') {
          setStats(statsData);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Don't set error state here to prioritize bookings display
      } finally {
        // Ensure loading state is completed
        setLoading(false);
      }
    };
    
    fetchStats();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch bookings data
      const bookingsData = await getAllBookings();
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData);
        localStorage.setItem('adminBookings', JSON.stringify(bookingsData));
      } else {
        throw new Error("Invalid bookings data format");
      }
      
      // Fetch stats
      const statsData = await getBookingStats();
      if (statsData && typeof statsData.totalBookings === 'number') {
        setStats({
          totalBookings: statsData.totalBookings || 0,
          totalVisitors: statsData.totalVisitors || 0,
          totalRevenue: statsData.totalRevenue || 0,
          monthlyTrend: statsData.monthlyTrend || []
        });
      } else {
        console.warn("Invalid stats data format");
        setStats({
          totalBookings: 0,
          totalVisitors: 0,
          totalRevenue: 0,
          monthlyTrend: []
        });
      }
      
    } catch (err) {
      console.error("Error fetching admin data:", err);
      
      // Try to use cached data
      const cachedBookings = localStorage.getItem('adminBookings');
      if (cachedBookings) {
        try {
          setBookings(JSON.parse(cachedBookings));
          setError("Using cached data. Live data unavailable.");
        } catch (parseErr) {
          console.error("Error parsing cached data:", parseErr);
          setError("Failed to load data. Please try again.");
        }
      } else {
        setError("Failed to load data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminSession');
    navigate('/admin/login');
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      (booking.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (booking.ticketNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      booking.paymentStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const exportData = () => {
    const csv = [
      ['Ticket Number', 'Name', 'Email', 'Museum', 'Date', 'Time', 'Amount', 'Status'],
      ...filteredBookings.map(booking => [
        booking.ticketNumber || '',
        booking.name || '',
        booking.email || '',
        booking.museum?.name || '',
        booking.date || '',
        booking.time || '',
        booking.totalAmount || 0,
        booking.paymentStatus || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start mb-8">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error loading data</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchData}
                className="mt-2 text-sm text-red-700 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.totalBookings}</p>
                  </div>
                  <Ticket className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-xl md:text-2xl font-bold flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {stats.totalRevenue}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Today's Bookings</p>
                    <p className="text-xl md:text-2xl font-bold">{stats.todayBookings}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Today's Revenue</p>
                    <p className="text-xl md:text-2xl font-bold flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {stats.todayRevenue}
                    </p>
                  </div>
                  <IndianRupee className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or ticket number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 md:gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button
                    onClick={exportData}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-lg font-medium mb-1">No bookings found</p>
                  <p className="text-sm">
                    {searchTerm || filterStatus !== 'all'
                      ? "Try adjusting your search or filter criteria"
                      : "There are no bookings in the system yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket Details
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Museum
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id || booking.ticketNumber}>
                          <td className="px-4 md:px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{booking.ticketNumber}</p>
                              <p className="text-sm text-gray-500">{booking.name}</p>
                              <p className="text-sm text-gray-500">{booking.email}</p>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div>
                              <p className="text-gray-900">{booking.museum?.name}</p>
                              <p className="text-sm text-gray-500">{booking.museum?.location}</p>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div>
                              <p className="text-gray-900">{booking.date}</p>
                              <p className="text-sm text-gray-500">{booking.time}</p>
                              {booking.createdAt && (
                                <p className="text-xs text-gray-400">
                                  Booked: {
                                    typeof booking.createdAt === 'string' 
                                      ? format(new Date(booking.createdAt), 'MMM d, yyyy')
                                      : format(booking.createdAt, 'MMM d, yyyy')
                                  }
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center text-gray-900">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {booking.totalAmount}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.paymentStatus === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}