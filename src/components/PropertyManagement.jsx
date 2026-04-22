import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  DoorOpen,
  ChevronDown,
  ChevronRight,
  X,
  Save,
  MapPin,
  Hash,
  Layers,
  Users,
  Home,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMyApartments,
  fetchRooms,
  createApartment,
  updateApartment,
  deleteApartment,
  createRoom,
  deleteRoom,
} from '../store/propertySlice';

export default function PropertyManagement() {
  const dispatch = useDispatch();
  const { apartments, rooms, loading } = useSelector((state) => state.property);

  const [expandedApt, setExpandedApt] = useState(null);
  const [showAddApt, setShowAddApt] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(null); // apartmentId
  const [editingApt, setEditingApt] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form states
  const [aptForm, setAptForm] = useState({ name: '', address: '' });
  const [roomForm, setRoomForm] = useState({ roomNumber: '', floorNo: '' });

  useEffect(() => {
    dispatch(fetchMyApartments());
  }, [dispatch]);

  const handleExpandApt = (aptId) => {
    if (expandedApt === aptId) {
      setExpandedApt(null);
    } else {
      setExpandedApt(aptId);
      dispatch(fetchRooms(aptId));
    }
  };

  const handleCreateApartment = async () => {
    if (!aptForm.name.trim()) return;
    try {
      await dispatch(createApartment({ name: aptForm.name, address: aptForm.address })).unwrap();
      setAptForm({ name: '', address: '' });
      setShowAddApt(false);
    } catch (err) {
      alert('Failed to create apartment: ' + (typeof err === 'string' ? err : JSON.stringify(err)));
    }
  };

  const handleUpdateApartment = async () => {
    if (!editingApt || !aptForm.name.trim()) return;
    try {
      await dispatch(updateApartment({ id: editingApt, name: aptForm.name, address: aptForm.address })).unwrap();
      setEditingApt(null);
      setAptForm({ name: '', address: '' });
    } catch (err) {
      alert('Failed to update apartment: ' + (typeof err === 'string' ? err : JSON.stringify(err)));
    }
  };

  const handleDeleteApartment = async (id) => {
    try {
      await dispatch(deleteApartment(id)).unwrap();
      setDeleteConfirm(null);
      if (expandedApt === id) setExpandedApt(null);
    } catch (err) {
      alert('Failed to delete: ' + (typeof err === 'string' ? err : JSON.stringify(err)));
    }
  };

  const handleCreateRoom = async (apartmentId) => {
    if (!roomForm.roomNumber.trim()) return;
    try {
      await dispatch(createRoom({
        apartmentId,
        roomNumber: roomForm.roomNumber,
        floorNo: parseInt(roomForm.floorNo) || 1,
      })).unwrap();
      setRoomForm({ roomNumber: '', floorNo: '' });
      setShowAddRoom(null);
    } catch (err) {
      alert('Failed to create room: ' + (typeof err === 'string' ? err : JSON.stringify(err)));
    }
  };

  const handleDeleteRoom = async (apartmentId, roomId) => {
    try {
      await dispatch(deleteRoom({ apartmentId, roomId })).unwrap();
    } catch (err) {
      alert('Failed to delete room: ' + (typeof err === 'string' ? err : JSON.stringify(err)));
    }
  };

  const getRoomsForApt = (aptId) => rooms.filter(r => r._apartmentId === aptId);
  const totalRooms = rooms.length;
  const totalTenants = rooms.filter(r => r.currentTenant).length;
  const vacantRooms = rooms.filter(r => !r.currentTenant).length;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Properties</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage your apartments, rooms, and unit configuration.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setAptForm({ name: '', address: '' });
            setEditingApt(null);
            setShowAddApt(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Apartment
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Apartments</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">{loading ? '--' : apartments.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Rooms</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">{loading ? '--' : totalRooms}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-purple-500">
            <DoorOpen className="w-6 h-6" />
          </div>
        </div>
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Occupied</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">{loading ? '--' : totalTenants}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50 text-green-500">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Vacant</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">{loading ? '--' : vacantRooms}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50 text-orange-500">
            <Home className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Add Apartment Inline Form */}
      {(showAddApt || editingApt) && (
        <div className="bg-card rounded-2xl shadow-card border border-divider p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            {editingApt ? 'Edit Apartment' : 'New Apartment'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Apartment Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="e.g. Skyline PG"
                  value={aptForm.name}
                  onChange={(e) => setAptForm({ ...aptForm, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-bg border border-divider rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="e.g. 221B Baker St"
                  value={aptForm.address}
                  onChange={(e) => setAptForm({ ...aptForm, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-bg border border-divider rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowAddApt(false); setEditingApt(null); setAptForm({ name: '', address: '' }); }}
              className="px-4 py-2 text-sm font-medium text-text-primary bg-bg border border-divider rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingApt ? handleUpdateApartment : handleCreateApartment}
              className="px-5 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:bg-accent-primary-hover transition-colors shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingApt ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Apartment List */}
      {loading && apartments.length === 0 ? (
        <div className="text-center text-text-secondary py-12">Loading properties...</div>
      ) : apartments.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-card border border-divider p-12 text-center">
          <Building2 className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Apartments Yet</h3>
          <p className="text-text-secondary text-sm mb-6">Get started by adding your first apartment.</p>
          <button
            onClick={() => { setAptForm({ name: '', address: '' }); setShowAddApt(true); }}
            className="btn-primary mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Apartment
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {apartments.map((apt) => {
            const aptRooms = getRoomsForApt(apt.id);
            const isExpanded = expandedApt === apt.id;
            const occupiedCount = aptRooms.filter(r => r.currentTenant).length;

            return (
              <div key={apt.id} className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden transition-all">
                {/* Apartment Header */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-hover-bg transition-colors"
                  onClick={() => handleExpandApt(apt.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-lg">{apt.name}</h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-sm text-text-secondary flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {apt.address || 'No address'}
                        </span>
                        {isExpanded && (
                          <span className="text-xs text-text-tertiary">
                            {aptRooms.length} room{aptRooms.length !== 1 ? 's' : ''} • {occupiedCount} occupied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAptForm({ name: apt.name, address: apt.address || '' });
                        setEditingApt(apt.id);
                        setShowAddApt(false);
                      }}
                      className="p-2 text-text-tertiary hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {deleteConfirm === apt.id ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDeleteApartment(apt.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="p-1.5 text-text-tertiary hover:text-text-primary rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(apt.id); }}
                        className="p-2 text-text-tertiary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-text-tertiary" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-text-tertiary" />
                    )}
                  </div>
                </div>

                {/* Expanded Rooms */}
                {isExpanded && (
                  <div className="border-t border-divider animate-in fade-in slide-in-from-top-1 duration-200">
                    {/* Add Room */}
                    <div className="p-4 bg-bg/50 border-b border-divider flex items-center justify-between">
                      <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Rooms</span>
                      <button
                        onClick={() => {
                          setRoomForm({ roomNumber: '', floorNo: '' });
                          setShowAddRoom(showAddRoom === apt.id ? null : apt.id);
                        }}
                        className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-divider font-medium bg-card text-text-primary hover:bg-hover-bg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Room
                      </button>
                    </div>

                    {/* Add Room Form */}
                    {showAddRoom === apt.id && (
                      <div className="p-4 bg-bg/30 border-b border-divider animate-in fade-in duration-150">
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-text-secondary mb-1">Room Number</label>
                            <div className="relative">
                              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                              <input
                                type="text"
                                placeholder="e.g. 101"
                                value={roomForm.roomNumber}
                                onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 bg-card border border-divider rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-text-secondary mb-1">Floor No.</label>
                            <div className="relative">
                              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                              <input
                                type="number"
                                placeholder="e.g. 1"
                                value={roomForm.floorNo}
                                onChange={(e) => setRoomForm({ ...roomForm, floorNo: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 bg-card border border-divider rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleCreateRoom(apt.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:bg-accent-primary-hover transition-colors shadow-sm shrink-0"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddRoom(null)}
                            className="p-2 text-text-tertiary hover:text-text-primary rounded-lg transition-colors shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Room List */}
                    {aptRooms.length === 0 ? (
                      <div className="p-8 text-center text-text-secondary text-sm">
                        No rooms yet. Click "Add Room" to get started.
                      </div>
                    ) : (
                      <div className="divide-y divide-divider">
                        {aptRooms.map((room) => (
                          <div key={room.id} className="px-6 py-4 flex items-center justify-between hover:bg-hover-bg transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                                room.currentTenant
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                {room.roomNumber}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-text-primary text-sm">Room {room.roomNumber}</span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                    room.currentTenant
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {room.currentTenant ? 'Occupied' : 'Vacant'}
                                  </span>
                                </div>
                                <p className="text-xs text-text-secondary mt-0.5">
                                  Floor {room.floorNo}
                                  {room.currentTenant && ` • ${room.currentTenant.fullname}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {room.currentTenant && (
                                <span className="text-xs text-text-tertiary mr-2">{room.currentTenant.email}</span>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`Delete Room ${room.roomNumber}?`)) {
                                    handleDeleteRoom(apt.id, room.id);
                                  }
                                }}
                                className="p-2 text-text-tertiary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
