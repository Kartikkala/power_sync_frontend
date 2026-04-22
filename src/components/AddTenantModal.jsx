import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Building, Hash, Calendar } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyApartments, fetchRooms, sendInvitation } from '../store/propertySlice';

export default function AddTenantModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const { apartments, rooms } = useSelector((state) => state.property);

  useEffect(() => {
    if (isOpen && apartments.length === 0) {
      dispatch(fetchMyApartments()).unwrap().then(apts => {
        apts.forEach(apt => dispatch(fetchRooms(apt.id)));
      }).catch(e => console.error('Failed to fetch properties:', e));
    }
  }, [isOpen, apartments.length, dispatch]);

  // Rooms without a tenant
  const vacantRooms = rooms.filter(r => !r.currentTenant);

  const handleSubmit = async () => {
    if (!email || !selectedRoomId) {
      setMessage('Please enter an email and select a room.');
      return;
    }
    setSending(true);
    setMessage('');
    try {
      await dispatch(sendInvitation({ email, roomId: parseInt(selectedRoomId) })).unwrap();
      setMessage('Invitation sent successfully!');
      setEmail('');
      setSelectedRoomId('');
      setTimeout(() => { onClose(); setMessage(''); }, 1500);
    } catch (err) {
      setMessage('Failed to send invitation: ' + (typeof err === 'string' ? err : err.message || 'Unknown error'));
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <h2 className="text-xl font-bold text-text-primary">Invite Tenant</h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-tertiary hover:bg-slate-100 rounded-lg hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          
          <p className="text-sm text-text-secondary">
            Send an invitation email to the tenant. They will receive a link to register and get linked to the selected room.
          </p>

          {/* Tenant Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Tenant Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                type="email" 
                placeholder="tenant@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
              />
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Assign to Room</label>
            <select 
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all appearance-none cursor-pointer"
            >
              <option value="">Select a vacant room...</option>
              {vacantRooms.map(room => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} (Floor {room.floorNo})
                </option>
              ))}
            </select>
            {vacantRooms.length === 0 && rooms.length > 0 && (
              <p className="text-xs text-text-tertiary mt-1">All rooms are occupied.</p>
            )}
          </div>

          {message && (
            <div className={`text-sm font-medium p-3 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-divider bg-bg/50 rounded-b-2xl flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-primary bg-bg border border-divider rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={sending}
            className="px-5 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:bg-accent-primary-hover transition-colors shadow-sm disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </div>
    </div>
  );
}
