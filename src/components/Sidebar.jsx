import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  WalletCards, 
  Settings, 
  Server, 
  LogOut,
  Sliders
} from 'lucide-react';

export default function Sidebar({ isOpen, activeTab, onTabSelect }) {
  return (
    <div 
      className={`h-full bg-sidebar-bg flex flex-col transition-all duration-300 ease-in-out shrink-0 border-r border-[#1f2937] ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header / Logo */}
      <div className={`flex items-center h-[72px] shrink-0 transition-all duration-300 overflow-hidden ${isOpen ? 'px-6 gap-3' : 'justify-center'}`}>
        <div className="w-8 h-8 shrink-0 rounded bg-[#0f9d78] flex items-center justify-center text-white font-bold text-sm tracking-wide">
          SG
        </div>
        <span className={`text-white text-lg font-bold tracking-wide transition-opacity duration-300 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
          SmartGrid
        </span>
      </div>

      {/* Scrollable Nav Items */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden py-6 flex flex-col gap-8 no-scrollbar ${isOpen ? 'px-4' : 'px-3'}`}>
        
        {/* Main Menu Section */}
        <div className="flex flex-col gap-1">
          <h3 className={`px-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
            Main Menu
          </h3>
          
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onTabSelect('dashboard'); }}
            className={`flex items-center rounded-lg transition-colors relative group ${
              activeTab === 'dashboard' ? 'bg-sidebar-active text-[#0f9d78]' : 'text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover'
            } ${isOpen ? 'justify-between px-3 py-2.5' : 'justify-center p-3 mx-1'}`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-5 h-5 shrink-0 ${activeTab === 'dashboard' ? 'text-[#0f9d78]' : 'group-hover:text-slate-200 transition-colors'}`} />
              <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                Dashboard
              </span>
            </div>
            {isOpen && activeTab === 'dashboard' && <div className="w-1.5 h-1.5 rounded-full bg-[#0f9d78]"></div>}
          </a>

          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onTabSelect('tenants'); }}
            className={`flex items-center rounded-lg transition-colors relative group ${
              activeTab === 'tenants' ? 'bg-sidebar-active text-[#0f9d78]' : 'text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover'
            } ${isOpen ? 'justify-between px-3 py-2.5' : 'justify-center p-3 mx-1'}`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-5 h-5 shrink-0 ${activeTab === 'tenants' ? 'text-[#0f9d78]' : 'group-hover:text-slate-200 transition-colors'}`} />
              <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                Tenant Management
              </span>
            </div>
            {isOpen && activeTab === 'tenants' && <div className="w-1.5 h-1.5 rounded-full bg-[#0f9d78]"></div>}
          </a>

          <a href="#" className={`flex items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover transition-colors group ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3 mx-1'}`}>
            <BarChart3 className="w-5 h-5 shrink-0 group-hover:text-slate-200 transition-colors" />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Real-time Analytics
            </span>
          </a>

          {/* Transactions */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onTabSelect('transactions'); }}
            className={`flex items-center rounded-lg border transition-colors mt-2 ${
              activeTab === 'transactions' 
                ? 'bg-[#27201c] border-orange-500/20 text-[#f97316]' 
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-sidebar-hover'
            } ${isOpen ? 'justify-between px-3 py-2.5' : 'justify-center p-3 mx-1'}`}
          >
            <div className="flex items-center gap-3">
              <WalletCards className={`w-5 h-5 shrink-0 ${activeTab === 'transactions' ? 'text-[#f97316]' : 'group-hover:text-slate-200 transition-colors'}`} />
              <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                Transactions
              </span>
            </div>
            {isOpen && activeTab === 'transactions' && <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></div>}
          </a>
        </div>

        {/* Configuration Section */}
        <div className="flex flex-col gap-1">
          <h3 className={`px-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
            Configuration
          </h3>
          <a href="#" className={`flex items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover transition-colors group ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3 mx-1'}`}>
            <Sliders className="w-5 h-5 shrink-0 group-hover:text-slate-200 transition-colors" />
             <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Billing Configuration
            </span>
          </a>
          <a href="#" className={`flex items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover transition-colors group ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3 mx-1'}`}>
            <Server className="w-5 h-5 shrink-0 group-hover:text-slate-200 transition-colors" />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              IoT Device Control
            </span>
          </a>
          <a href="#" className={`flex items-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-sidebar-hover transition-colors group ${isOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-3 mx-1'}`}>
            <Settings className="w-5 h-5 shrink-0 group-hover:text-slate-200 transition-colors" />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              Settings
            </span>
          </a>
        </div>
      </div>

      {/* Footer Profile */}
      <div className={`p-4 shrink-0 overflow-hidden transition-all duration-300 ${isOpen ? '' : 'flex justify-center'}`}>
        <div className={`bg-[#1f2632] rounded-xl flex items-center group cursor-pointer hover:bg-sidebar-hover transition-colors border border-white/5 shadow-sm overflow-hidden ${isOpen ? 'p-3 justify-between w-full' : 'p-2 justify-center w-12 h-12'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 bg-[#292e39] rounded-lg flex items-center justify-center overflow-hidden border border-orange-500/20">
              <img src="https://ui-avatars.com/api/?name=R+C&background=ffd5cc&color=f97316&bold=true" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className={`flex flex-col flex-1 min-w-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
              <span className="text-white text-sm font-medium leading-tight truncate">Robert Chen</span>
              <span className="text-slate-400 text-xs truncate">Landlord Admin</span>
            </div>
          </div>
          <button className={`text-slate-400 hover:text-white transition-colors p-1 shrink-0 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
