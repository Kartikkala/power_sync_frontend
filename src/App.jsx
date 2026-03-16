import React, { useState } from 'react';
import TopBar from './components/TopBar';
import LandlordDashboard from './components/LandlordDashboard';
import TenantManagement from './components/TenantManagement';
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('landlord');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-bg overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeTab={activeTab}
        onTabSelect={(tab) => setActiveTab(tab)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          activeTab={activeTab}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1400px] w-full mx-auto">
            {activeTab === 'landlord' || activeTab === 'dashboard' ? <LandlordDashboard /> : null}
            {activeTab === 'tenants' && <TenantManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
