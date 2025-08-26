"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MessageSquare, 
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  Star,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

interface Stats {
  messages: number;
  bookings: number;
  newBookings: number;
  revenue?: number;
}

interface Booking {
  _id: string;
  name: string;
  email: string;
  service: string;
  address: string;
  status: string;
  totalPrice: number;
  catCount: number;
  dates: string[];
  date?: string;
  notes?: string;
  phone?: string;
}

interface Activity {
  type: 'booking' | 'message';
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [hoveredBookings, setHoveredBookings] = useState<Booking[]>([]);

  // Color palette for different clients
  const clientColors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-cyan-500'
  ];

  // Fetch stats and bookings
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        console.log("Fetching admin data...");
        
        // Fetch stats
        const statsRes = await fetch("/api/admin/stats");
        console.log("Stats response:", statsRes.status);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          console.log("Stats data:", statsData);
          if (isMounted) setStats(statsData);
        }

        // Fetch bookings for calendar
        const bookingsRes = await fetch("/api/admin/bookings?limit=100");
        console.log("Bookings response:", bookingsRes.status);
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          console.log("Bookings data:", bookingsData);
          if (isMounted) setBookings(bookingsData.bookings || []);
        }

        // Fetch recent activity
        const activityRes = await fetch("/api/admin/recent-activity");
        console.log("Activity response:", activityRes.status);
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          console.log("Activity data:", activityData);
          if (isMounted) setActivities(activityData.activities || []);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Check for expired deposits
  const checkExpiredDeposits = async () => {
    try {
      const response = await fetch("/api/admin/check-expired-deposits", {
        method: "POST"
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Found ${result.cancelledCount} expired deposits and cancelled them.`);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert("Failed to check expired deposits");
      }
    } catch (error) {
      console.error("Error checking expired deposits:", error);
      alert("Error checking expired deposits");
    }
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    // Don't show bookings for past dates
    if (date < today) {
      return [];
    }
    
    return bookings.filter(booking => {
      if (Array.isArray(booking.dates)) {
        return booking.dates.some((d: string) => d.startsWith(dateStr));
      }
      return booking.date && booking.date.startsWith(dateStr);
    });
  };

  const getClientColor = (clientName: string) => {
    const index = clientName.charCodeAt(0) % clientColors.length;
    return clientColors[index];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'border-green-500 bg-green-50';
      case 'pending': return 'border-yellow-500 bg-yellow-50';
      case 'declined': return 'border-red-500 bg-red-50';
      case 'cancelled': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700';
      case 'pending': return 'text-yellow-700';
      case 'declined': return 'text-red-700';
      case 'cancelled': return 'text-gray-700';
      default: return 'text-gray-700';
    }
  };

  const getActivityIcon = (activity: Activity) => {
    if (activity.type === 'message') {
      return MessageSquare;
    }
    
    switch (activity.status) {
      case 'pending': return Clock;
      case 'approved': return Calendar;
      case 'declined': return XCircle;
      case 'cancelled': return AlertTriangle;
      default: return Calendar;
    }
  };

  const getActivityIconColor = (activity: Activity) => {
    if (activity.type === 'message') {
      return 'text-green-600';
    }
    
    switch (activity.status) {
      case 'pending': return 'text-yellow-600';
      case 'approved': return 'text-blue-600';
      case 'declined': return 'text-red-600';
      case 'cancelled': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityIconBg = (activity: Activity) => {
    if (activity.type === 'message') {
      return 'bg-green-100';
    }
    
    switch (activity.status) {
      case 'pending': return 'bg-yellow-100';
      case 'approved': return 'bg-blue-100';
      case 'declined': return 'bg-red-100';
      case 'cancelled': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime.toLocaleDateString();
  };

  const handleDateHover = (date: Date) => {
    setHoveredDate(date);
    const dayBookings = getBookingsForDate(date);
    setHoveredBookings(dayBookings);
  };

  const handleDateLeave = () => {
    setHoveredDate(null);
    setHoveredBookings([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beige-50 to-olive-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-olive-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-warm-brown-800">
                Admin Dashboard
              </h1>
              <p className="text-dark-gray-600">Manage bookings, messages, and system status</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={checkExpiredDeposits}
                className="flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <AlertTriangle size={16} className="mr-2" />
                Check Expired Deposits
              </button>
              
              <Link
                href="/admin/logout"
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-warm-brown-800">
                  {stats?.bookings || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-warm-brown-800">
                  {stats?.messages || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-warm-brown-800">
                  {stats?.newBookings || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-dark-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-warm-brown-800">
                  ${stats?.revenue || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/bookings"
            className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-warm-brown-800 mb-2">
                  Manage Bookings
                </h3>
                <p className="text-dark-gray-600 text-sm">
                  View, approve, and manage all booking requests
                </p>
              </div>
              <Calendar className="w-8 h-8 text-olive-500 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/messages"
            className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-warm-brown-800 mb-2">
                  View Messages
                </h3>
                <p className="text-dark-gray-600 text-sm">
                  Read and respond to customer inquiries
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-olive-500 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-warm-brown-800 mb-2">
                  System Status
                </h3>
                <p className="text-dark-gray-600 text-sm">
                  Monitor system health and performance
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Calendar and Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Calendar */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-semibold text-warm-brown-800">
                Booking Calendar
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedDate(newDate);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium text-warm-brown-800">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedDate(newDate);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid - Clean and Compact */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: startingDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} className="h-28"></div>
              ))}
              
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                const dayBookings = getBookingsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isPast = date < new Date();
                
                return (
                  <div
                    key={day}
                    className={`h-28 border border-gray-200 p-2 relative cursor-pointer transition-all duration-200 ${
                      isToday ? 'bg-olive-50 border-olive-300 shadow-md' : 
                      isPast ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => handleDateHover(date)}
                    onMouseLeave={handleDateLeave}
                  >
                    <div className={`text-sm font-medium mb-1 ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>
                      {day}
                    </div>
                    
                    {/* Compact Booking Indicators */}
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking, index) => (
                        <div
                          key={booking._id}
                          className="flex items-center space-x-1 text-xs"
                        >
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getClientColor(booking.name)}`}></div>
                          <span className="truncate font-medium">{booking.name}</span>
                          <span className="text-gray-500">${booking.totalPrice}</span>
                        </div>
                      ))}
                      
                      {/* Show more indicator */}
                      {dayBookings.length > 2 && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></div>
                          <span>+{dayBookings.length - 2} more</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Status indicator for first booking */}
                    {dayBookings.length > 0 && (
                      <div className="absolute top-1 right-1">
                        <div className={`w-2 h-2 rounded-full ${
                          dayBookings[0].status === 'approved' ? 'bg-green-500' :
                          dayBookings[0].status === 'pending' ? 'bg-yellow-500' :
                          dayBookings[0].status === 'declined' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="text-xs text-gray-500 mb-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Clients</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>Approved</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span>Declined</span>
                  </div>
                </div>
                <div className="text-gray-400">
                  Hover over dates to see full details
                </div>
              </div>
            </div>

            {/* Hover Tooltip */}
            {hoveredDate && hoveredBookings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: '100%',
                  marginTop: '8px'
                }}
              >
                <div className="text-sm font-medium text-gray-900 mb-3">
                  {hoveredDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="space-y-2">
                  {hoveredBookings.map((booking) => (
                    <div key={booking._id} className={`p-3 rounded border-l-4 ${getStatusColor(booking.status)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getClientColor(booking.name)}`}></div>
                          <span className="font-medium text-sm">{booking.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusTextColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.service} • {booking.catCount} cat{booking.catCount > 1 ? 's' : ''} • ${booking.totalPrice}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}


          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-semibold text-warm-brown-800">
                Recent Activity
              </h2>
              <RefreshCw 
                className="w-5 h-5 text-dark-gray-400 hover:text-dark-gray-600 cursor-pointer"
                onClick={() => window.location.reload()}
              />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-dark-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400 mt-1">New bookings and messages will appear here</p>
                </div>
              ) : (
                activities.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start p-4 bg-beige-50 rounded-lg hover:bg-beige-100 transition-colors"
                    >
                      <div className={`p-2 rounded-lg mr-4 ${getActivityIconBg(activity)}`}>
                        <ActivityIcon className={`w-4 h-4 ${getActivityIconColor(activity)}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-warm-brown-800 truncate">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-dark-gray-600 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-dark-gray-500 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                          activity.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          activity.status === 'unread' ? 'bg-yellow-100 text-yellow-800' :
                          activity.status === 'read' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
