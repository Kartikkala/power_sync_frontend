import React, { useState, useRef, useEffect } from 'react';
import { Bell, Moon, Sun, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function TopBar({ onMenuClick, activeTab = 'dashboard', isDarkMode, onToggleDarkMode }) {
  const user = useSelector((state) => state.auth.user) || {};
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

  const portalLabel = user.role === 'landlord' ? 'Landlord Portal' : 'Tenant Portal';

  const getTabLabel = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'tenants': return 'Tenant Management';
      case 'transactions': return 'Transactions';
      case 'settings': return 'Settings';
      case 'iot': return 'IoT Device Management';
      case 'billing': return 'Billing Configuration';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-card border-b border-divider">
      <div className="flex items-center gap-3 md:gap-4">
        <Menu 
          className="w-5 h-5 text-text-secondary cursor-pointer hover:text-text-primary transition-colors" 
          onClick={onMenuClick}
        />
        <div className="flex items-center text-sm font-medium">
          <span className="text-text-secondary hidden sm:inline">{portalLabel}</span>
          <span className="mx-2 text-text-tertiary hidden sm:inline">›</span>
          <span className="font-semibold text-text-primary">{getTabLabel()}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative" ref={notificationsRef}>
          <div 
            className="cursor-pointer flex items-center justify-center relative p-1"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className={`w-5 h-5 transition-colors ${isNotificationsOpen ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`} />
          </div>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-card border border-divider shadow-card rounded-2xl overflow-hidden z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-4">
              <div className="p-4 border-b border-divider flex items-center justify-between bg-bg/50">
                <h3 className="font-bold text-text-primary">Notifications</h3>
              </div>
              <div className="p-8 text-center text-text-tertiary text-sm">
                No new notifications
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
        <div className="w-8 h-8 rounded-full bg-[#0f9d78] flex items-center justify-center overflow-hidden cursor-pointer border-2 border-transparent hover:border-slate-200 transition-all shadow-sm text-white text-xs font-bold">
          {(user.fullname || user.email || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
