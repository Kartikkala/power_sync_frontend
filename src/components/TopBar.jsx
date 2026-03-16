import React from 'react';
import { Bell, Moon, Menu } from 'lucide-react';

export default function TopBar({ onMenuClick, activeTab = 'dashboard' }) {
  const getTabLabel = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'tenants': return 'Tenant Management';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-card border-b border-black/5">
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
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-text-secondary hover:text-text-primary transition-colors" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-card translate-x-1/4 -translate-y-1/4"></span>
        </div>
        <Moon className="w-5 h-5 text-text-secondary cursor-pointer hover:text-text-primary transition-colors" />
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-transparent hover:border-slate-200 transition-all shadow-sm">
          <img src="https://ui-avatars.com/api/?name=L&background=ffd5cc&color=f97316&bold=true" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
