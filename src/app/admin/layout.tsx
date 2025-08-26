"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  Settings,
  User,
  Bell
} from "lucide-react";
import PerformanceMonitor from "@/components/PerformanceMonitor";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Simple cookie check for admin authentication
    const checkAuth = () => {
      const adminAuth = document.cookie.includes('admin_auth_client=true');
      setIsAdmin(adminAuth);

      // redirect if not logged in (and not already on login page)
      if (!adminAuth && pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    // Clear the admin cookie
    document.cookie = "admin_auth_client=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/admin/login";
  };

  // Navigation items
  const navigationItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  ];

  // While checking auth, render nothing
  if (isAdmin === null) return null;

  return (
    <div className="min-h-screen bg-beige-50">
      {isAdmin && pathname !== "/admin/login" && (
        <header className="bg-gradient-to-r from-warm-brown-800 to-warm-brown-900 text-white shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side: Logo and Navbar links */}
              <div className="flex items-center space-x-8">
                <Link href="/admin" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center">
                    <Home className="text-olive-600" size={20} />
                  </div>
                  <span className="text-xl font-serif font-bold">Admin Panel</span>
                </Link>
                
                <nav className="hidden md:flex space-x-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          href={item.href} 
                          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                            isActive 
                              ? "bg-olive-600 text-white" 
                              : "text-beige-200 hover:bg-olive-600 hover:text-white"
                          }`}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Right side: User menu and logout */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-beige-200 hover:text-white hover:bg-olive-600 rounded-lg transition-colors"
                >
                  <Bell size={18} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-beige-200 hover:text-white hover:bg-olive-600 rounded-lg transition-colors"
                >
                  <Settings size={18} />
                </motion.button>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-olive-100 rounded-full flex items-center justify-center">
                    <User className="text-olive-600" size={16} />
                  </div>
                  <span className="text-beige-200 text-sm hidden md:block">Admin</span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span className="hidden md:block">Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="min-h-screen">
        {children}
      </main>

      {/* Performance Monitor - Enable in development */}
      <PerformanceMonitor 
        pageName="Admin Panel" 
        enabled={process.env.NODE_ENV === 'development'} 
      />
    </div>
  );
}
