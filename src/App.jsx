import React, { useState } from 'react';
import TopBar from './components/TopBar';
import LandlordDashboard from './components/LandlordDashboard';
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('landlord');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-bg overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1400px] w-full mx-auto">
        <div className="flex gap-8 mb-8 border-b border-black/5 px-2 hidden">
          {/* This tab switching logic is hidden initially to closely match the image, but ready for logic as requested */}
          <button 
            className={`tab ${activeTab === 'landlord' ? 'active' : ''}`}
            onClick={() => setActiveTab('landlord')}
          >
            Landlord View
          </button>
          <button 
            className={`tab ${activeTab === 'tenant' ? 'active' : ''}`}
            onClick={() => setActiveTab('tenant')}
          >
            Tenant View
          </button>
        </div>

        {activeTab === 'landlord' && <LandlordDashboard />}
          {activeTab === 'tenant' && (
            <div className="premium-card text-center py-20 text-text-secondary flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold mb-2">Tenant View</h2>
              <p>Details for an individual tenant will appear here.</p>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
