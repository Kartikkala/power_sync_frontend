import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Power, 
  RefreshCcw, 
  Zap, 
  Activity, 
  AlertTriangle,
  Eye
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyApartments, fetchRooms } from '../store/propertySlice';
import IncomingTelemetryModal from './IncomingTelemetryModal';
import { useTelemetry } from '../hooks/useTelemetry';

export default function IotDeviceControl() {
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.property);
  const { telemetry, isConnected } = useTelemetry();

  useEffect(() => {
    dispatch(fetchMyApartments()).unwrap().then(apts => {
      apts.forEach(apt => dispatch(fetchRooms(apt.id)));
    }).catch(e => console.error('Failed to fetch properties:', e));
  }, [dispatch]);

  // Build device list from rooms
  const [deviceStates, setDeviceStates] = useState({});

  // Update device states when telemetry arrives
  useEffect(() => {
    if (telemetry && telemetry.nodeId) {
      setDeviceStates(prev => ({
        ...prev,
        [telemetry.nodeId]: {
          voltage: telemetry.voltage,
          currentDraw: telemetry.current,
          power: telemetry.power,
          energy: telemetry.energy,
          status: 'online',
        }
      }));

      setTelemetryHistory(prev => {
        const newTrace = {
          time: new Date().toLocaleTimeString(),
          voltage: telemetry.voltage,
          power: telemetry.power,
          current: telemetry.current
        };
        return [...prev, newTrace].slice(-20);
      });
    }
  }, [telemetry]);

  const devices = rooms.map(room => {
    const nodeId = `Room_${room.roomNumber}`;
    const liveState = deviceStates[nodeId] || {};
    return {
      id: nodeId,
      unit: `Room ${room.roomNumber}`,
      roomId: room.id,
      status: liveState.status || 'offline',
      powerState: liveState.status === 'online',
      currentDraw: liveState.currentDraw || 0,
      voltage: liveState.voltage || 0,
      power: liveState.power || 0,
      energy: liveState.energy || 0,
      signal: liveState.status === 'online' ? 85 : 0,
      tenant: room.currentTenant,
    };
  });

  const togglePower = (id) => {
    // This would need a backend endpoint to actually cut power
    console.log('Toggle power for device:', id);
  };

  const activeCount = devices.filter(d => d.status === 'online').length;
  const totalCount = devices.length;
  const totalDraw = devices.reduce((sum, d) => sum + (d.currentDraw || 0), 0);

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">IoT Device Control</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage smart meters, power states, and diagnostics.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            WebSocket {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <button className="btn-primary" onClick={() => {
            dispatch(fetchMyApartments()).unwrap().then(apts => {
              apts.forEach(apt => dispatch(fetchRooms(apt.id)));
            });
          }}>
            <RefreshCcw className="w-4 h-4" />
            Refresh Network
          </button>
        </div>
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
              <h3 className="text-[28px] font-bold text-text-primary leading-none">{loading ? '--' : `${activeCount}/${totalCount}`}</h3>
            </div>
          </div>
          <div className="text-sm text-text-tertiary">
            {activeCount === 0 ? 'No modules reporting' : `${activeCount} module${activeCount !== 1 ? 's' : ''} online`}
          </div>
        </div>
        
        <div className="bg-card rounded-2xl shadow-card border border-divider p-6 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-purple-100/50 text-purple-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Grid Load</p>
              <h3 className="text-[28px] font-bold text-text-primary leading-none">{totalDraw.toFixed(2)} A</h3>
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
              <p className="text-sm font-medium text-text-secondary mb-1">Offline Devices</p>
              <h3 className="text-[28px] font-bold text-text-primary leading-none">{totalCount - activeCount}</h3>
            </div>
          </div>
          <div className="text-sm text-text-tertiary text-error">
            {totalCount - activeCount === 0 ? 'All devices connected' : `${totalCount - activeCount} module${totalCount - activeCount !== 1 ? 's' : ''} offline`}
          </div>
        </div>
      </div>

      {/* Device Grid */}
      {loading ? (
        <div className="text-center text-text-secondary py-8">Loading devices...</div>
      ) : devices.length === 0 ? (
        <div className="text-center text-text-secondary py-8">No rooms found. Add apartments and rooms first.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.id} className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden flex flex-col transition-all hover:shadow-lg">
              {/* Card Header */}
              <div className="p-5 border-b border-divider flex items-center justify-between bg-bg/50">
                <div className="flex flex-col">
                  <span className="font-bold text-text-primary">{device.unit}</span>
                  <span className="text-xs font-medium text-text-tertiary">{device.id}{device.tenant ? ` • ${device.tenant.fullname}` : ''}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  device.status === 'online' ? 'bg-green-100/20 text-green-600 border border-green-200/20' : 'bg-red-100/20 text-red-600 border border-red-200/20'
                }`}>
                  {device.status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {device.status === 'online' ? 'Online' : 'Offline'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col bg-bg p-3 rounded-xl border border-divider">
                    <span className="text-xs text-text-secondary mb-1">Current Draw</span>
                    <div className="flex items-center gap-1.5 text-text-primary font-bold">
                      <Zap className="w-3.5 h-3.5 text-orange-500" />
                      {typeof device.currentDraw === 'number' ? device.currentDraw.toFixed(2) : device.currentDraw} A
                    </div>
                  </div>
                  <div className="flex flex-col bg-bg p-3 rounded-xl border border-divider">
                    <span className="text-xs text-text-secondary mb-1">Voltage</span>
                    <div className="flex items-center gap-1.5 text-text-primary font-bold">
                      <Activity className="w-3.5 h-3.5 text-blue-500" />
                      {typeof device.voltage === 'number' ? device.voltage.toFixed(1) : device.voltage} V
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

              {/* Actions */}
              <div className="p-5 border-t border-divider flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedDevice(device)}
                    className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      device.status === 'offline' 
                        ? 'bg-bg text-text-tertiary border-divider cursor-not-allowed' 
                        : 'bg-card text-text-primary border-divider hover:bg-hover-bg hover:text-accent-primary'
                    }`}
                    disabled={device.status === 'offline'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Live Stats
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
      )}
      <IncomingTelemetryModal 
        isOpen={!!selectedDevice}
        onClose={() => setSelectedDevice(null)}
        device={selectedDevice}
        history={telemetryHistory}
      />
    </div>
  );
}
