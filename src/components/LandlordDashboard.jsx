import React, { useState } from 'react';
import { Plus, IndianRupee, Users, Zap, TrendingUp, TrendingDown, Edit2, ShieldAlert, CreditCard } from 'lucide-react';
import UsageChart from './UsageChart';
import TransactionsTable from './TransactionsTable';
import AddTenantModal from './AddTenantModal';

export default function LandlordDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Overview</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage tenants, rates, and monitor property consumption.</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Tenant
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Electricity Rate Card (Dark) */}
        <div className="dark-rate-card flex flex-col h-full relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f97316]/20 text-[#f97316] flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            <button className="btn-dark">
              <Edit2 className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-slate-300 font-medium mb-1">Electricity Rate</p>
            <div className="flex items-baseline gap-1">
              <h2 className="text-[2rem] font-bold text-white">₹8.50</h2>
              <span className="text-slate-400 text-sm">/kWh</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">Base rate for all calculations</p>
          </div>
        </div>

        {/* Metric Card: Total Revenue */}
        <div className="premium-card flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-wrap-green">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Revenue</p>
              <h3 className="text-2xl font-bold text-text-primary leading-none">₹124,500</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-[13px]">
            <span className="text-success font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              ~12%
            </span>
            <span className="text-text-tertiary">vs last month</span>
          </div>
        </div>

        {/* Metric Card: Active Tenants */}
        <div className="premium-card flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-wrap-blue">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Active Tenants</p>
              <h3 className="text-2xl font-bold text-text-primary leading-none">24</h3>
            </div>
          </div>
          <div className="mt-auto text-[13px] text-text-tertiary">
            Total Capacity: 30 Units
          </div>
        </div>

        {/* Metric Card: Consumption */}
        <div className="premium-card flex flex-col h-full">
          <div className="flex flex-row items-center gap-4 mb-4">
            <div className="icon-wrap-purple">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Consumption</p>
              <div className="flex items-baseline gap-1 leading-none">
                <h3 className="text-2xl font-bold text-text-primary">14.2</h3>
                <span className="text-text-primary font-bold text-sm">MWh</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-[13px]">
            <span className="text-error font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              ~5%
            </span>
            <span className="text-text-tertiary">vs last month</span>
          </div>
        </div>

        {/* Metric Card: Total Units */}
        <div className="premium-card flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-wrap-orange w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-500">
              {/* Made a custom shield-like icon using lucide */}
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Units</p>
              <h3 className="text-2xl font-bold text-text-primary leading-none">18,450</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-[13px]">
            <span className="text-success font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 text-green-500" />
              ~8%
            </span>
            <span className="text-text-tertiary">kWh Consumed</span>
          </div>
        </div>

      </div>

      {/* Usage Chart Section */}
      <UsageChart />

      {/* Transactions Table Section */}
      <TransactionsTable />

      {/* Add Tenant Modal */}
      <AddTenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
