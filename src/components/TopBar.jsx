import React, { useState, useRef, useEffect } from 'react';
import { Bell, Moon, Sun, Menu, CheckCircle2, AlertCircle, IndianRupee } from 'lucide-react';

export default function TopBar({ onMenuClick, activeTab = 'dashboard', isDarkMode, onToggleDarkMode }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Payment Received',
      message: 'Alex Morgan paid ₹3,450 for Unit 101',
      time: '10m ago',
      icon: <IndianRupee className="w-4 h-4 text-green-600" />,
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Overdue Bill Alert',
      message: 'Mike Johnson (Unit 302) is 5 days overdue.',
      time: '2h ago',
      icon: <AlertCircle className="w-4 h-4 text-orange-600" />,
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'Smart meter firmware updated successfully.',
      time: '1d ago',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    }
  ];

  const getTabLabel = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'tenants': return 'Tenant Management';
      case 'transactions': return 'Transactions';
      case 'settings': return 'Settings';
      case 'iot': return 'IoT Device Management';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-card border-b border-divider">
      <div className="flex items-center gap-4">
        <Menu 
          className="w-5 h-5 text-text-secondary cursor-pointer hover:text-text-primary transition-colors" 
          onClick={onMenuClick}
        />
        <div className="flex items-center text-sm font-medium">
          <span className="text-text-secondary">Landlord Portal</span>
          <span className="mx-2 text-text-tertiary">›</span>
          <span className="font-semibold text-text-primary">{getTabLabel()}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative" ref={notificationsRef}>
          <div 
            className="cursor-pointer flex items-center justify-center relative p-1"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className={`w-5 h-5 transition-colors ${isNotificationsOpen ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-card translate-x-1/4 -translate-y-1/4"></span>
          </div>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-card border border-divider shadow-card rounded-2xl overflow-hidden z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-4">
              <div className="p-4 border-b border-divider flex items-center justify-between bg-bg/50">
                <h3 className="font-bold text-text-primary">Notifications</h3>
                <button className="text-xs font-medium text-accent-primary hover:text-accent-primary-hover transition-colors">
                  Mark all as read
                </button>
              </div>
              
              <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-divider hover:bg-hover-bg transition-colors cursor-pointer flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${notif.bg}`}>
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-text-primary truncate">{notif.title}</p>
                        <span className="text-[11px] text-text-tertiary whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-bg/50 border-t border-divider text-center">
                <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={onToggleDarkMode}
          className="flex items-center justify-center cursor-pointer text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-transparent hover:border-slate-200 transition-all shadow-sm">
          <img src="https://ui-avatars.com/api/?name=L&background=ffd5cc&color=f97316&bold=true" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
