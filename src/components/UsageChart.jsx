import React from 'react';
import { Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';

const data = [
  { time: '00:00', wattage: 2.4, voltage: 228, current: 10.5 },
  { time: '04:00', wattage: 2.2, voltage: 229, current: 9.6 },
  { time: '08:00', wattage: 5.6, voltage: 232, current: 24.1 },
  { time: '12:00', wattage: 8.4, voltage: 227, current: 36.5 },
  { time: '16:00', wattage: 6.2, voltage: 225, current: 27.5 },
  { time: '20:00', wattage: 4.8, voltage: 228, current: 21.0 },
  { time: '24:00', wattage: 4.2, voltage: 230, current: 18.5 },
];

export default function UsageChart() {
  return (
    <div className="premium-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error"></span>
            Real-time Usage
          </h2>
          <p className="text-sm text-text-secondary mt-1">Live monitoring of power consumption metrics</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button className="px-4 py-1 text-sm font-medium bg-card rounded-md shadow-sm">Live</button>
          <button className="px-4 py-1 text-sm font-medium text-text-secondary hover:text-text-primary">1H</button>
          <button className="px-4 py-1 text-sm font-medium text-text-secondary hover:text-text-primary">24H</button>
        </div>
      </div>

      <div className="relative h-[300px] w-full">
        {/* Custom Legend floating on the left */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-divider rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0f9d78]"></span>
            <span className="text-xs font-medium text-text-primary">Wattage:</span>
            <span className="text-xs font-bold text-[#0f9d78]">4.2 kW</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-divider rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
            <span className="text-xs font-medium text-text-primary">Voltage:</span>
            <span className="text-xs font-bold text-[#f97316]">230 V</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-divider rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span>
            <span className="text-xs font-medium text-text-primary">Current:</span>
            <span className="text-xs font-bold text-[#a855f7]">18.5 A</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorWattage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f9d78" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0f9d78" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
            <XAxis dataKey="time" hide={true} />
            <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            
            <Area type="monotone" dataKey="wattage" stroke="#0f9d78" strokeWidth={3} fillOpacity={1} fill="url(#colorWattage)" />
            <Area type="monotone" dataKey="current" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" />
            
            {/* Using a secondary Y-axis basically for the voltage to keep it higher up visually since its values are in 200s, 
                or just scale the data. For simplicity without a secondary axis, we can just use the right axis domain or let recharts handle it. 
                Wait, voltage is ~230 while wattage is ~5. We need a secondary YAxis for Voltage to show up on the same chart neatly. */}
            <YAxis yAxisId="right" orientation="right" hide={true} domain={[200, 250]} />
            <Line yAxisId="right" type="monotone" dataKey="voltage" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
