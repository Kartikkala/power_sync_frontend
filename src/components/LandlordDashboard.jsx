import React, { useState, useEffect } from 'react';
import { Plus, IndianRupee, Users, Zap, TrendingUp, TrendingDown, Edit2, ShieldAlert, CreditCard } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setBaseRate, fetchUnpaidBills } from '../store/billingSlice';
import { fetchMyApartments, fetchRooms } from '../store/propertySlice';
import UsageChart from './UsageChart';
import TransactionsTable from './TransactionsTable';
import AddTenantModal from './AddTenantModal';

export default function LandlordDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState('');
  const globalBaseRate = useSelector((state) => state.billing.baseRate);
  const { apartments, rooms, loading: propertyLoading } = useSelector((state) => state.property);
  const { unpaidBills } = useSelector((state) => state.billing);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyApartments()).unwrap().then(apts => {
      apts.forEach(apt => dispatch(fetchRooms(apt.id)));
    }).catch(e => console.error('Failed to fetch apartments:', e));
    dispatch(fetchUnpaidBills());
  }, [dispatch]);

  const handleSaveRate = () => {
    dispatch(setBaseRate(parseFloat(tempRate) || 0));
    setIsEditingRate(false);
  };

  // Computed metrics from API data
  const activeTenants = rooms.filter(r => r.currentTenant).length;
  const totalRooms = rooms.length;
  const totalRevenue = unpaidBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalConsumption = unpaidBills.reduce((sum, b) => sum + (b.unitsConsumed || 0), 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Overview</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage tenants, rates, and monitor property consumption.</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Tenant
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Electricity Rate Card (Dark) */}
        <div className="dark-rate-card flex flex-col h-full relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f97316]/20 text-[#f97316] flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            {isEditingRate ? (
              <button className="btn-dark bg-green-500 hover:bg-green-600 text-white border-transparent" onClick={handleSaveRate}>
                Save
              </button>
            ) : (
              <button className="btn-dark" onClick={() => { setTempRate(globalBaseRate); setIsEditingRate(true); }}>
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
          <div className="mt-auto">
            <p className="text-sm text-slate-300 font-medium mb-1">Electricity Rate</p>
            <div className="flex items-baseline gap-1">
              <h2 className="text-[2rem] font-bold text-white flex items-center">
                <span className="mr-1">₹</span>
                {isEditingRate ? (
                  <input 
                    type="number"
                    step="0.01"
                    value={tempRate}
                    onChange={(e) => setTempRate(e.target.value)}
                    className="w-24 bg-transparent border-b border-white outline-none focus:border-[#f97316] text-[2rem] font-bold text-white p-0 m-0"
                    autoFocus
                  />
                ) : (
                  <span>{globalBaseRate.toFixed(2)}</span>
                )}
              </h2>
              <span className="text-slate-400 text-sm">/kWh</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">Base rate for all calculations</p>
          </div>
        </div>

        {/* Metric Card: Total Revenue */}
        <div className="premium-card flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-wrap-green">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Pending</p>
              <h3 className="text-2xl font-bold text-text-primary leading-none">₹{totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-[13px]">
            <span className="text-text-tertiary">{unpaidBills.length} unpaid bill{unpaidBills.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Metric Card: Active Tenants */}
        <div className="premium-card flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-wrap-blue">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Active Tenants</p>
              <h3 className="text-2xl font-bold text-text-primary leading-none">{propertyLoading ? '--' : activeTenants}</h3>
            </div>
          </div>
          <div className="mt-auto text-[13px] text-text-tertiary">
            Total Capacity: {totalRooms} Units
          </div>
        </div>

        {/* Metric Card: Consumption */}
        <div className="premium-card flex flex-col h-full">
          <div className="flex flex-row items-center gap-4 mb-4">
            <div className="icon-wrap-purple">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Consumption</p>
              <div className="flex items-baseline gap-1 leading-none">
                <h3 className="text-2xl font-bold text-text-primary">{totalConsumption.toFixed(2)} kWh</h3>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-[13px]">
            <span className="text-text-tertiary">This billing cycle</span>
          </div>
        </div>

        {/* Metric Card: Total Units */}
        <div className="premium-card flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-wrap-orange w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Rooms</p>
              <h3 className="text-2xl font-bold text-text-primary leading-none">{propertyLoading ? '--' : totalRooms}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-auto text-[13px]">
            <span className="text-text-tertiary">Across {apartments.length} propert{apartments.length !== 1 ? 'ies' : 'y'}</span>
          </div>
        </div>

      </div>

      {/* Usage Chart Section */}
      <UsageChart />

      {/* Transactions Table Section */}
      <TransactionsTable />

      {/* Add Tenant Modal */}
      <AddTenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
