import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, DollarSign, Calendar, AlertCircle } from 'lucide-react';

const mockUsageData = [
  { time: '00:00', kwh: 1.2 }, { time: '04:00', kwh: 0.8 },
  { time: '08:00', kwh: 3.5 }, { time: '12:00', kwh: 4.8 },
  { time: '16:00', kwh: 5.2 }, { time: '20:00', kwh: 6.1 },
  { time: '24:00', kwh: 2.1 }
];

const TenantDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Your Energy Dashboard</h1>
          <p className="text-text-secondary mt-1">Monitor your consumption and upcoming bills</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="badge-success">Account Active</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Bill */}
        <div className="premium-card bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-orange/20 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <DollarSign className="w-6 h-6 text-accent-orange" />
            </div>
            <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full text-zinc-300">Unbilled</span>
          </div>
          <div>
            <p className="text-slate-400 font-medium mb-1">Estimated Current Bill</p>
            <h3 className="text-4xl font-bold font-mono tracking-tight">$84.50</h3>
          </div>
        </div>

        {/* Current Rate */}
        <div className="premium-card flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <div className="icon-wrap-blue group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-text-secondary font-medium mb-1">Active Rate Plan</p>
            <h3 className="text-3xl font-bold text-text-primary tracking-tight">$0.14 <span className="text-base text-text-tertiary font-normal">/ kWh</span></h3>
            <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
              Standard Tier
            </p>
          </div>
        </div>

        {/* Next Billing Cycle */}
        <div className="premium-card flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <div className="icon-wrap-purple group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-text-secondary font-medium mb-1">Next Billing Date</p>
            <h3 className="text-3xl font-bold text-text-primary tracking-tight">Nov 1st</h3>
            <p className="text-sm text-text-tertiary mt-2">12 days remaining</p>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 premium-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-text-primary text-lg">Today's Usage</h3>
              <p className="text-sm text-text-secondary">Your electricity consumption over the last 24 hours.</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid var(--color-divider)',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: 'var(--color-card)',
                    color: 'var(--color-text-primary)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="kwh" 
                  stroke="#ff6b00" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorKwh)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action / Alerts */}
        <div className="space-y-6">
          <div className="premium-card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30">
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-500 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-500">High Usage Alert</h4>
                  <p className="text-sm text-amber-800/80 dark:text-amber-400/80 mt-1">
                    You used 20% more electricity yesterday than average. Consider checking your AC unit.
                  </p>
               </div>
            </div>
          </div>
          
          <div className="premium-card">
            <h4 className="font-semibold text-text-primary mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full btn-secondary justify-between group">
                Download Last Invoice
                <DollarSign className="w-4 h-4 text-text-tertiary group-hover:text-text-primary" />
              </button>
              <button className="w-full btn-secondary justify-between group">
                Contact Landlord
                <AlertCircle className="w-4 h-4 text-text-tertiary group-hover:text-text-primary" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TenantDashboard;
