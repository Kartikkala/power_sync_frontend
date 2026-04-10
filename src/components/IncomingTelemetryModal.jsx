import React from 'react';
import { X, Activity, Zap, Server } from 'lucide-react';
import { Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';

export default function IncomingTelemetryModal({ isOpen, onClose, device, history }) {
  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl border border-divider flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-text-primary">
              <span className={`w-2.5 h-2.5 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Telemetry: {device.unit}
            </h2>
            <p className="text-sm text-text-secondary mt-1">Node: {device.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-tertiary hover:bg-hover-bg rounded-lg hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Current Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-bg p-4 rounded-xl border border-divider">
              <p className="text-sm font-medium text-text-secondary mb-1">Voltage</p>
              <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                {device.voltage || '0'} V
              </h3>
            </div>
            <div className="bg-bg p-4 rounded-xl border border-divider">
              <p className="text-sm font-medium text-text-secondary mb-1">Current</p>
              <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                {device.currentDraw || '0'} A
              </h3>
            </div>
            <div className="bg-bg p-4 rounded-xl border border-divider">
              <p className="text-sm font-medium text-text-secondary mb-1">Power</p>
              <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                {device.power || '0'} W
              </h3>
            </div>
            <div className="bg-bg p-4 rounded-xl border border-divider">
              <p className="text-sm font-medium text-text-secondary mb-1">Energy</p>
              <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-500" />
                {device.energy || '0'} kWh
              </h3>
            </div>
          </div>

          {/* Graph */}
          <div className="bg-bg rounded-xl border border-divider p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Real-time Stream</h3>
            <div className="relative h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={history} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f9d78" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0f9d78" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="time" hide={true} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  
                  {/* Left Axis for Power */}
                  <YAxis yAxisId="left" orientation="left" hide={false} stroke="#64748b" tick={{fill: '#94a3b8'}} domain={['dataMin - 50', 'dataMax + 50']} />
                  <Area yAxisId="left" type="monotone" dataKey="power" name="Power (W)" stroke="#0f9d78" strokeWidth={3} fillOpacity={1} fill="url(#colorPower)" isAnimationActive={false} />
                  
                  {/* Right Axis for Voltage */}
                  <YAxis yAxisId="right" orientation="right" hide={false} stroke="#64748b" tick={{fill: '#94a3b8'}} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Line yAxisId="right" type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                  
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
