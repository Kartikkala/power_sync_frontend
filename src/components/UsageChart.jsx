import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { useTelemetry } from '../hooks/useTelemetry';
import { useSelector } from 'react-redux';
import apiClient from '../api/client';

const MAX_LIVE_POINTS = 30;
const MAX_CHART_POINTS = 60;

function downsample(arr, max) {
  if (arr.length <= max) return arr;
  const step = Math.max(1, Math.floor(arr.length / max));
  const out = [];
  for (let i = 0; i < arr.length; i += step) out.push(arr[i]);
  if (out[out.length - 1] !== arr[arr.length - 1]) out.push(arr[arr.length - 1]);
  return out;
}

export default function UsageChart() {
  const { telemetry } = useTelemetry();
  const [liveData, setLiveData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [histLoading, setHistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('live'); // 'live' | '1h' | '24h'
  const { rooms } = useSelector((state) => state.property);

  // Find first occupied room for history queries
  const roomId = useMemo(() => {
    const occupied = rooms.find(r => r.currentTenant);
    return occupied?.id || rooms[0]?.id || null;
  }, [rooms]);

  // Accumulate live telemetry
  useEffect(() => {
    if (telemetry && telemetry.timestamp) {
      setLiveData(prev => {
        const newPoint = {
          time: new Date(telemetry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          wattage: telemetry.power,
          voltage: telemetry.voltage,
          current: Math.min(telemetry.current, 50),
        };
        return [...prev, newPoint].slice(-MAX_LIVE_POINTS);
      });
    }
  }, [telemetry]);

  // Fetch history when switching to 1H or 24H
  const fetchHistory = useCallback(async (hours) => {
    if (!roomId) return;
    setHistLoading(true);
    try {
      const now = new Date();
      const start = new Date(now.getTime() - hours * 60 * 60 * 1000);
      const formatDate = (d) => d.toISOString().split('T')[0]; // yyyy-MM-dd
      const resp = await apiClient.get(`/power/room/${roomId}/history`, {
        params: { startDate: formatDate(start), endDate: formatDate(now) }
      });
      const raw = (resp.data || [])
        .filter(entry => {
          const ts = new Date(entry.recordedAt).getTime();
          return ts >= start.getTime();
        })
        .map(entry => ({
          time: new Date(entry.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          wattage: entry.wattage || 0,
          voltage: entry.voltage || 0,
          current: Math.min(entry.amperes || 0, 50),
        }));
      setHistoryData(downsample(raw, MAX_CHART_POINTS));
    } catch (e) {
      console.error('Failed to fetch history:', e);
      setHistoryData([]);
    } finally {
      setHistLoading(false);
    }
  }, [roomId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === '1h') fetchHistory(1);
    else if (tab === '24h') fetchHistory(24);
  };

  // Chart data based on active tab
  const chartData = activeTab === 'live' ? liveData : historyData;

  const liveWattage = telemetry ? telemetry.power?.toFixed(2) : '--';
  const liveVoltage = telemetry ? telemetry.voltage?.toFixed(0) : '--';
  const liveCurrent = telemetry ? telemetry.current?.toFixed(2) : '--';

  const tabs = [
    { id: 'live', label: 'Live' },
    { id: '1h', label: '1H' },
    { id: '24h', label: '24H' },
  ];

  return (
    <div className="premium-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${telemetry ? 'bg-green-500' : 'bg-error'}`}></span>
            {activeTab === 'live' ? 'Real-time Usage' : activeTab === '1h' ? 'Last 1 Hour' : 'Last 24 Hours'}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {activeTab === 'live' ? 'Live monitoring of power consumption metrics' : `Historical data${roomId ? '' : ' — no room available'}`}
          </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-card shadow-sm text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live stat badges — only show on live tab */}
      {activeTab === 'live' && (
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-bg border border-divider rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#0f9d78]"></span>
            <span className="text-xs font-medium text-text-primary">Power:</span>
            <span className="text-xs font-bold text-[#0f9d78]">{liveWattage} W</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-bg border border-divider rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
            <span className="text-xs font-medium text-text-primary">Voltage:</span>
            <span className="text-xs font-bold text-[#f97316]">{liveVoltage} V</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-bg border border-divider rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span>
            <span className="text-xs font-medium text-text-primary">Current:</span>
            <span className="text-xs font-bold text-[#a855f7]">{liveCurrent} A</span>
          </div>
        </div>
      )}

      <div className="relative h-[300px] w-full">
        {histLoading ? (
          <div className="h-full flex items-center justify-center text-text-tertiary">Loading history...</div>
        ) : chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text-tertiary">
            {activeTab === 'live' ? 'Waiting for telemetry data...' : 'No data available for this period'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" opacity={0.5} />
              <XAxis
                dataKey="time"
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={Math.max(0, Math.floor(chartData.length / 8))}
              />
              <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--color-divider)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-text-primary)'
                }}
              />
              
              <Area type="monotone" dataKey="wattage" name="Power (W)" stroke="#0f9d78" strokeWidth={2} fillOpacity={1} fill="url(#colorWattage)" isAnimationActive={false} dot={false} />
              <Area type="monotone" dataKey="current" name="Current (A)" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" isAnimationActive={false} dot={false} />
              
              <YAxis yAxisId="right" orientation="right" hide={true} domain={[200, 250]} />
              <Line yAxisId="right" type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
