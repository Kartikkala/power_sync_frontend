import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import LandlordDashboard from './components/LandlordDashboard';
import TenantManagement from './components/TenantManagement';
import TransactionsPage from './components/TransactionsPage';
import SettingsPage from './components/SettingsPage';
import IotDeviceControl from './components/IotDeviceControl';
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('landlord');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle resize for mobile default state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="h-screen flex bg-bg overflow-hidden relative">
      
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex shrink-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTab={activeTab}
          onTabSelect={(tab) => {
            setActiveTab(tab);
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false); // Auto close on mobile
            }
          }}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          activeTab={activeTab}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1400px] w-full mx-auto">
            {activeTab === 'landlord' || activeTab === 'dashboard' ? <LandlordDashboard /> : null}
            {activeTab === 'tenants' && <TenantManagement />}
            {activeTab === 'transactions' && <TransactionsPage />}
            {activeTab === 'settings' && <SettingsPage />}
            {activeTab === 'iot' && <IotDeviceControl />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
