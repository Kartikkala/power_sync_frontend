import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Plus, 
  Receipt, 
  AlertCircle,
  CreditCard,
  Clock,
  MessageCircle
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnpaidBills } from '../store/billingSlice';
import { fetchMyBills } from '../store/powerSlice';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { unpaidBills, loading } = useSelector((state) => state.billing);
  const { myBills } = useSelector((state) => state.power);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.role === 'landlord') {
      dispatch(fetchUnpaidBills());
    }
    dispatch(fetchMyBills());
  }, [dispatch, user]);

  // Merge bills depending on role
  const allBills = user?.role === 'landlord' ? unpaidBills : myBills;

  const filteredBills = (allBills || []).filter(bill => {
    if (filter === 'all') return true;
    if (filter === 'paid') return bill.paymentStatus === 'PAID';
    if (filter === 'unpaid') return bill.paymentStatus === 'UNPAID';
    return true;
  });

  // Compute metrics
  const totalPending = (allBills || []).filter(b => b.paymentStatus === 'UNPAID').reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const pendingCount = (allBills || []).filter(b => b.paymentStatus === 'UNPAID').length;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const avatarColors = ['bg-indigo-500', 'bg-pink-500', 'bg-blue-500', 'bg-red-500', 'bg-teal-500', 'bg-purple-500', 'bg-orange-500'];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Transactions</h1>
          <p className="text-text-secondary mt-1 text-sm">Track payments, revenue, and billing status across all units.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-divider text-text-primary font-medium rounded-lg text-sm hover:bg-hover-bg transition-colors shadow-sm">
            <Download className="w-4 h-4 text-text-secondary" />
            <span className="whitespace-nowrap">Export Report</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pending Payments */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-50/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">Pending Payments</p>
                <h3 className="text-[28px] font-bold text-text-primary leading-none">₹{totalPending.toFixed(2)}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-orange-500">{pendingCount} Bill{pendingCount !== 1 ? 's' : ''}</span>
              <span className="text-sm text-text-secondary">awaiting payment</span>
            </div>
          </div>
        </div>

        {/* Total Bills */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-green-50/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">Total Bills</p>
                <h3 className="text-[28px] font-bold text-text-primary leading-none">{(allBills || []).length}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-text-secondary">All billing records</span>
            </div>
          </div>
        </div>

        {/* Total Units Consumed */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-50/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">Total kWh Billed</p>
                <h3 className="text-[28px] font-bold text-text-primary leading-none">
                  {(allBills || []).reduce((sum, b) => sum + (b.unitsConsumed || 0), 0).toFixed(2)}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-text-secondary">Energy consumption billed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden flex flex-col">
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-text-primary">Bills</h2>
            <span className="px-2.5 py-1 bg-bg text-text-secondary rounded-md text-xs font-medium border border-divider">
              Total: {filteredBills.length}
            </span>
          </div>
          <div className="flex bg-bg p-1 rounded-lg border border-divider">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md ${filter === 'all' ? 'bg-card shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'} transition-colors`}
            >All</button>
            <button 
              onClick={() => setFilter('paid')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md ${filter === 'paid' ? 'bg-card shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'} transition-colors`}
            >Paid</button>
            <button 
              onClick={() => setFilter('unpaid')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md ${filter === 'unpaid' ? 'bg-card shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'} transition-colors`}
            >Unpaid</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-divider bg-bg/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount (₹)</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Billing Period</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Units</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-text-secondary">Loading...</td></tr>
              ) : filteredBills.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-text-secondary">No bills found</td></tr>
              ) : (
                filteredBills.map((bill, idx) => {
                  const initials = getInitials(bill.tenant?.fullname);
                  const colorClass = avatarColors[idx % avatarColors.length];
                  const isPaid = bill.paymentStatus === 'PAID';
                  const isUnpaid = bill.paymentStatus === 'UNPAID';
                  return (
                    <tr key={bill.id} className="hover:bg-hover-bg transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-sm ${colorClass}`}>{initials}</div>
                          <div>
                            <p className="font-semibold text-text-primary text-sm">{bill.tenant?.fullname || 'Unknown'}</p>
                            <p className="text-xs text-text-secondary">{bill.tenant?.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary">Room {bill.room?.roomNumber || '--'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-text-primary">₹{bill.totalAmount?.toFixed(2) || '0.00'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary">
                          {bill.billingPeriodStart} → {bill.billingPeriodEnd}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary">{bill.unitsConsumed?.toFixed(2) || '0.00'} kWh</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-200 text-green-600 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" />
                          Reminder
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
