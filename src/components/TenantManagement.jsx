import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Wifi, AlertTriangle, Wallet, Eye, Edit2, Calendar, Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyApartments, fetchRooms } from '../store/propertySlice';
import { fetchUnpaidBills } from '../store/billingSlice';
import AddTenantModal from './AddTenantModal';

export default function TenantManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.property);
  const { unpaidBills } = useSelector((state) => state.billing);

  useEffect(() => {
    dispatch(fetchMyApartments()).unwrap().then(apts => {
      apts.forEach(apt => dispatch(fetchRooms(apt.id)));
    }).catch(e => console.error('Failed to fetch properties:', e));
    dispatch(fetchUnpaidBills());
  }, [dispatch]);

  // Compute metrics
  const tenantsWithRoom = rooms.filter(r => r.currentTenant);
  const activeTenants = tenantsWithRoom.length;
  const overdueBills = unpaidBills.length;
  const totalBalance = unpaidBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Filter tenants by search
  const filteredRooms = tenantsWithRoom.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (r.currentTenant?.fullname || '').toLowerCase();
    const room = (r.roomNumber || '').toLowerCase();
    return name.includes(q) || room.includes(q);
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const avatarColors = ['bg-blue-100 text-blue-600', 'bg-red-100 text-red-600', 'bg-yellow-100 text-yellow-600', 'bg-cyan-100 text-cyan-600', 'bg-purple-100 text-purple-600', 'bg-green-100 text-green-600'];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Tenant Management</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage tenant connections, billing, and access controls.</p>
        </div>
        
        <div className="bg-card rounded-2xl shadow-card border border-divider p-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary w-64 shadow-sm placeholder:text-text-tertiary"
            />
          </div>
          <button 
            className="btn-primary whitespace-nowrap"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add New Tenant
          </button>
        </div>
      </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Tenants</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">{loading ? '--' : activeTenants}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Rooms</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">{loading ? '--' : rooms.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-500">
            <Wifi className="w-6 h-6" />
          </div>
        </div>

        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Unpaid Bills</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">{overdueBills}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100/60 text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Pending</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">₹{totalBalance.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-400">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden flex flex-col">
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-text-primary">All Tenants</h2>
            <span className="px-2.5 py-1 bg-bg text-text-secondary rounded-md text-xs font-medium border border-divider">
              {filteredRooms.length} Total
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-divider bg-bg/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tenant Name / Room #</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Floor</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-text-secondary">Loading...</td></tr>
              ) : filteredRooms.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-text-secondary">
                  {rooms.length === 0 ? 'No rooms found. Add apartments and rooms first.' : 'No tenants assigned to rooms yet.'}
                </td></tr>
              ) : (
                filteredRooms.map((room, idx) => {
                  const tenant = room.currentTenant;
                  const initials = getInitials(tenant?.fullname);
                  const colorClass = avatarColors[idx % avatarColors.length];
                  return (
                    <tr key={room.id} className="hover:bg-hover-bg transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${colorClass}`}>{initials}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-text-primary">{tenant?.fullname || 'Unknown'}</span>
                              <div className={`w-2.5 h-3.5 rounded-sm ${tenant?.isActive ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">Room {room.roomNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-text-primary">{tenant?.email || '--'}</p>
                        <p className="text-xs text-text-secondary">{tenant?.contactNo || '--'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-primary">Floor {room.floorNo}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          tenant?.isActive 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {tenant?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button className="text-text-tertiary hover:text-text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                          <button className="text-text-tertiary hover:text-text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-divider flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-semibold text-text-primary">{filteredRooms.length}</span> tenant{filteredRooms.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <AddTenantModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
