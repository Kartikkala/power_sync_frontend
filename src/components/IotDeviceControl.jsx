import React, { useState } from 'react';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Power, 
  RefreshCcw, 
  Zap, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';

export default function IotDeviceControl() {
  const [devices, setDevices] = useState([
    {
      id: 'IOT-8921-A',
      unit: 'Unit 101',
      status: 'online',
      powerState: true,
      currentDraw: '2.4 A',
      voltage: '228 V',
      signal: 85,
    },
    {
      id: 'IOT-8922-B',
      unit: 'Unit 102',
      status: 'online',
      powerState: true,
      currentDraw: '1.1 A',
      voltage: '230 V',
      signal: 92,
    },
    {
      id: 'IOT-8923-C',
      unit: 'Unit 204',
      status: 'offline',
      powerState: false,
      currentDraw: '0.0 A',
      voltage: '0 V',
      signal: 0,
    },
    {
      id: 'IOT-8924-D',
      unit: 'Unit 301',
      status: 'online',
      powerState: false,
      currentDraw: '0.0 A',
      voltage: '229 V',
      signal: 78,
    },
    {
      id: 'IOT-8925-E',
      unit: 'Unit 302',
      status: 'online',
      powerState: true,
      currentDraw: '5.6 A',
      voltage: '226 V',
      signal: 65,
    }
  ]);

  const togglePower = (id) => {
    // Simulated async action
    setDevices(devices.map(device => {
      if (device.id === id) {
        return {
          ...device,
          powerState: !device.powerState,
          currentDraw: device.powerState ? '0.0 A' : '1.5 A' // Mock toggle behavior
        };
      }
      return device;
    }));
  };

  const activeCount = devices.filter(d => d.status === 'online').length;
  const totalCount = devices.length;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">IoT Device Control</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage smart meters, power states, and diagnostics.</p>
        </div>
        <button className="btn-primary">
          <RefreshCcw className="w-4 h-4" />
          Refresh Network
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl shadow-card border border-divider p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-100/50 text-blue-600 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Active Meters</p>
              <h3 className="text-[28px] font-bold text-text-primary leading-none">{activeCount}/{totalCount}</h3>
            </div>
          </div>
          <div className="text-sm text-text-tertiary">All online modules reporting</div>
        </div>
        
        <div className="bg-card rounded-2xl shadow-card border border-divider p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-purple-100/50 text-purple-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Grid Load</p>
              <h3 className="text-[28px] font-bold text-text-primary leading-none">12.5 A</h3>
            </div>
          </div>
          <div className="text-sm text-text-tertiary">Combined network draw</div>
        </div>

        <div className="bg-card rounded-2xl shadow-card border border-divider p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-100/50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Critical Alerts</p>
              <h3 className="text-[28px] font-bold text-text-primary leading-none">1</h3>
            </div>
          </div>
          <div className="text-sm text-text-tertiary text-error">Module IOT-8923-C Offline</div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div key={device.id} className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden flex flex-col transition-all hover:shadow-lg">
            {/* Card Header */}
            <div className="p-5 border-b border-divider flex items-center justify-between bg-bg/50">
              <div className="flex flex-col">
                <span className="font-bold text-text-primary">{device.unit}</span>
                <span className="text-xs font-medium text-text-tertiary">{device.id}</span>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                device.status === 'online' ? 'bg-green-100/20 text-green-600 border border-green-200/20' : 'bg-red-100/20 text-red-600 border border-red-200/20'
              }`}>
                {device.status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {device.status === 'online' ? 'Online' : 'Offline'}
              </div>
            </div>

            {/* Content Space */}
            <div className="p-5 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col bg-bg p-3 rounded-xl border border-divider">
                  <span className="text-xs text-text-secondary mb-1">Current Draw</span>
                  <div className="flex items-center gap-1.5 text-text-primary font-bold">
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    {device.currentDraw}
                  </div>
                </div>
                <div className="flex flex-col bg-bg p-3 rounded-xl border border-divider">
                  <span className="text-xs text-text-secondary mb-1">Voltage</span>
                  <div className="flex items-center gap-1.5 text-text-primary font-bold">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                    {device.voltage}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Signal Strength</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-divider rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${device.signal > 70 ? 'bg-green-500' : device.signal > 40 ? 'bg-orange-500' : 'bg-red-500'}`} 
                      style={{ width: `${device.signal}%` }}
                    ></div>
                  </div>
                  <span className="text-text-primary font-medium w-8 text-right">{device.signal}%</span>
                </div>
              </div>
            </div>

            {/* Actions / Power Cut Toggles */}
            <div className="p-5 border-t border-divider flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    device.status === 'offline' 
                      ? 'bg-bg text-text-tertiary border-divider cursor-not-allowed' 
                      : 'bg-bg text-text-secondary border-divider hover:bg-hover-bg hover:text-text-primary'
                  }`}
                  disabled={device.status === 'offline'}
                >
                  Reboot
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${device.powerState ? 'text-green-600' : 'text-text-tertiary'}`}>
                  {device.powerState ? 'Power On' : 'Power Cut'}
                </span>
                <button 
                  onClick={() => togglePower(device.id)}
                  disabled={device.status === 'offline'}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${device.status === 'offline' ? 'bg-slate-300 dark:bg-slate-700 opacity-50 cursor-not-allowed' : device.powerState ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`pointer-events-none flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${device.powerState ? 'translate-x-5' : 'translate-x-0'}`}>
                    <Power className={`w-3.5 h-3.5 ${device.powerState ? 'text-green-500' : 'text-slate-400'}`} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
