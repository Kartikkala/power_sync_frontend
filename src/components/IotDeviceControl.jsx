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
  Eye,
  Globe,
  Check,
  X,
  Loader2,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyApartments, fetchRooms } from '../store/propertySlice';
import IncomingTelemetryModal from './IncomingTelemetryModal';
import { useTelemetry } from '../hooks/useTelemetry';
import apiClient from '../api/client';

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

  // Fetch device info (IP, dbId, status) for each room
  const [deviceInfoMap, setDeviceInfoMap] = useState({}); // keyed by Room_xxx
  useEffect(() => {
    if (rooms.length === 0) return;
    rooms.forEach(room => {
      apiClient.get(`/device/room/${room.id}`)
        .then(resp => {
          const d = resp.data;
          setDeviceInfoMap(prev => ({
            ...prev,
            [`Room_${room.roomNumber}`]: {
              dbId: d.id,
              ipAddress: d.ipAddress || null,
              backendStatus: d.status,
              unitRate: d.unitRatePerKwh,
            }
          }));
        })
        .catch(() => {}); // device may not exist yet
    });
  }, [rooms]);

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

  const [togglingId, setTogglingId] = useState(null);
  const [powerOverrides, setPowerOverrides] = useState({});
  const [editingIpDevice, setEditingIpDevice] = useState(null);
  const [ipInput, setIpInput] = useState('');
  const [ipSaving, setIpSaving] = useState(false);

  const devices = rooms.map(room => {
    const nodeId = `Room_${room.roomNumber}`;
    const liveState = deviceStates[nodeId] || {};
    const info = deviceInfoMap[nodeId] || {};
    return {
      id: nodeId,
      unit: `Room ${room.roomNumber}`,
      roomId: room.id,
      dbId: info.dbId || null,
      ipAddress: info.ipAddress || null,
      backendStatus: info.backendStatus || null,
      status: liveState.status || 'offline',
      powerState: powerOverrides[nodeId] !== undefined ? powerOverrides[nodeId] : (info.backendStatus === 'ON' || liveState.status === 'online'),
      currentDraw: liveState.currentDraw || 0,
      voltage: liveState.voltage || 0,
      power: liveState.power || 0,
      energy: liveState.energy || 0,
      signal: liveState.status === 'online' ? 85 : 0,
      tenant: room.currentTenant,
    };
  });

  const togglePower = async (device) => {
    if (togglingId) return;
    setTogglingId(device.id);
    try {
      let deviceDbId = device.dbId;
      if (!deviceDbId) {
        alert('Could not resolve IoT device ID for this room');
        return;
      }
      const newState = !device.powerState;
      const endpoint = newState ? 'on' : 'off';
      await apiClient.post(`/device/${deviceDbId}/${endpoint}`);
      setPowerOverrides(prev => ({ ...prev, [device.id]: newState }));
    } catch (err) {
      console.error('Toggle failed:', err);
      alert('Failed to toggle device: ' + (err.response?.data?.message || err.message));
    } finally {
      setTogglingId(null);
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const handleAddDevice = async (roomId) => {
    setIsAdding(true);
    try {
      await apiClient.post('/device', { roomId });
      const resp = await apiClient.get(`/device/room/${roomId}`);
      const d = resp.data;
      const room = rooms.find(r => r.id === roomId);
      setDeviceInfoMap(prev => ({
        ...prev,
        [`Room_${room.roomNumber}`]: {
          dbId: d.id,
          ipAddress: d.ipAddress || null,
          backendStatus: d.status,
          unitRate: d.unitRatePerKwh,
        }
      }));
    } catch (err) {
      alert('Failed to add device: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteDevice = async (dbId, roomNumber) => {
    if (!window.confirm('Are you sure you want to remove this device? This will break telemetry for this room until replaced.')) return;
    try {
      await apiClient.delete(`/device/${dbId}`);
      setDeviceInfoMap(prev => {
        const next = { ...prev };
        delete next[`Room_${roomNumber}`];
        return next;
      });
    } catch (err) {
      alert('Failed to delete device: ' + (err.response?.data?.error || err.message));
    }
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
                  !device.dbId ? 'bg-slate-100/20 text-slate-500 border border-slate-200/20' :
                  device.status === 'online' ? 'bg-green-100/20 text-green-600 border border-green-200/20' : 'bg-red-100/20 text-red-600 border border-red-200/20'
                }`}>
                  {!device.dbId ? <AlertTriangle className="w-3 h-3" /> : device.status === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {!device.dbId ? 'Not Installed' : device.status === 'online' ? 'Online' : 'Offline'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 flex-1">
                {!device.dbId ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                    <p className="text-sm text-text-secondary">No IoT device assigned to this room.</p>
                    <button 
                      onClick={() => handleAddDevice(device.roomId)}
                      disabled={isAdding}
                      className="btn-primary"
                    >
                      {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                      Add Device
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* IP Configuration */}
              {device.dbId && (
              <div className="px-1 pb-2">
                {editingIpDevice === device.id ? (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                    <input
                      type="text"
                      placeholder="192.168.1.x"
                      value={ipInput}
                      onChange={(e) => setIpInput(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs bg-bg border border-divider rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
                      autoFocus
                    />
                    <button
                      disabled={ipSaving}
                      onClick={async () => {
                        if (!ipInput.trim()) return;
                        setIpSaving(true);
                        try {
                          let deviceDbId = device.dbId;
                          if (!deviceDbId) {
                            const latestResp = await apiClient.get(`/power/room/${device.roomId}/latest`);
                            deviceDbId = latestResp.data?.iotDevice?.id;
                          }
                          if (!deviceDbId) { alert('Could not resolve device ID'); return; }
                          await apiClient.put(`/device/${deviceDbId}`, { ipAddress: ipInput.trim() });
                          // Update local cache
                          setDeviceInfoMap(prev => ({
                            ...prev,
                            [device.id]: { ...prev[device.id], ipAddress: ipInput.trim() }
                          }));
                          setEditingIpDevice(null);
                          setIpInput('');
                        } catch (err) {
                          alert('Failed: ' + (err.response?.data?.error || err.message));
                        } finally {
                          setIpSaving(false);
                        }
                      }}
                      className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    >
                      {ipSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => { setEditingIpDevice(null); setIpInput(''); }}
                      className="p-1 text-text-tertiary hover:bg-hover-bg rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Globe className="w-3 h-3 text-text-tertiary" />
                      {device.ipAddress ? (
                        <span className="text-text-primary font-mono">{device.ipAddress}</span>
                      ) : (
                        <span className="text-text-tertiary italic">No IP set</span>
                      )}
                    </div>
                    <button
                      onClick={() => { setEditingIpDevice(device.id); setIpInput(device.ipAddress || ''); }}
                      className="text-xs text-accent-primary hover:underline font-medium"
                    >
                      {device.ipAddress ? 'Edit' : 'Set IP'}
                    </button>
                  </div>
                )}
              </div>
              )}

              {/* Actions */}
              <div className="p-5 border-t border-divider flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedDevice(device)}
                    className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      !device.dbId || device.status === 'offline' 
                        ? 'bg-bg text-text-tertiary border-divider cursor-not-allowed' 
                        : 'bg-card text-text-primary border-divider hover:bg-hover-bg hover:text-accent-primary'
                    }`}
                    disabled={!device.dbId || device.status === 'offline'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Live Stats
                  </button>
                  {device.dbId && (
                    <button
                      onClick={() => handleDeleteDevice(device.dbId, device.unit.replace('Room ', ''))}
                      className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors bg-bg text-red-500 border-red-100 hover:bg-red-50"
                      title="Remove Device"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${device.powerState ? 'text-green-600' : 'text-text-tertiary'}`}>
                    {device.powerState ? 'Power On' : 'Power Cut'}
                  </span>
                  <button 
                    onClick={() => togglePower(device)}
                    disabled={!device.dbId || device.status === 'offline' || togglingId === device.id}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!device.dbId || device.status === 'offline' || togglingId === device.id ? 'bg-slate-300 dark:bg-slate-700 opacity-50 cursor-not-allowed' : device.powerState ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
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
