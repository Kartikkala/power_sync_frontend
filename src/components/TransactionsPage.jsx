import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Receipt, 
  AlertCircle,
  CreditCard,
  MessageCircle,
  Loader2,
  IndianRupee,
  CheckCircle2,
  FileDown,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnpaidBills, createPaymentOrder } from '../store/billingSlice';
import { fetchMyBills } from '../store/powerSlice';
import { load } from '@cashfreepayments/cashfree-js';
import { downloadInvoice } from '../utils/invoiceGenerator';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { unpaidBills, loading } = useSelector((state) => state.billing);
  const { myBills } = useSelector((state) => state.power);
  const [filter, setFilter] = useState('all');
  const [payingBillId, setPayingBillId] = useState(null);
  const [payError, setPayError] = useState('');

  const isLandlord = user?.role === 'landlord';

  useEffect(() => {
    if (isLandlord) {
      dispatch(fetchUnpaidBills());
    }
    dispatch(fetchMyBills());
  }, [dispatch, user]);

  // Merge bills depending on role
  const allBills = isLandlord ? unpaidBills : myBills;

  const filteredBills = (allBills || []).filter(bill => {
    if (filter === 'all') return true;
    if (filter === 'paid') return bill.paymentStatus === 'PAID';
    if (filter === 'unpaid') return bill.paymentStatus === 'UNPAID';
    return true;
  });

  // Compute metrics
  const totalPending = (allBills || []).filter(b => b.paymentStatus === 'UNPAID').reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const pendingCount = (allBills || []).filter(b => b.paymentStatus === 'UNPAID').length;
  const paidCount = (allBills || []).filter(b => b.paymentStatus === 'PAID').length;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const avatarColors = ['bg-indigo-500', 'bg-pink-500', 'bg-blue-500', 'bg-red-500', 'bg-teal-500', 'bg-purple-500', 'bg-orange-500'];

  const handlePayNow = async (billId) => {
    setPayingBillId(billId);
    setPayError('');
    try {
      // 1. Create order on backend
      const orderData = await dispatch(createPaymentOrder(billId)).unwrap();

      // 2. Initialize Cashfree SDK
      const cashfree = await load({
        mode: 'sandbox', // Change to 'production' for live
      });

      // 3. Open checkout
      const result = await cashfree.checkout({
        paymentSessionId: orderData.paymentSessionId,
        returnUrl: `${window.location.origin}/transactions?order_id=${orderData.orderId}`,
      });

      if (result.error) {
        setPayError(result.error.message || 'Payment was cancelled');
      } else if (result.redirect) {
        // Payment is being redirected — handled by returnUrl
      } else if (result.paymentDetails) {
        // Payment completed inline
        dispatch(fetchMyBills());
        if (isLandlord) dispatch(fetchUnpaidBills());
      }
    } catch (err) {
      const msg = typeof err === 'string' ? err
        : err?.message || err?.error || JSON.stringify(err) || 'Payment failed';
      setPayError(msg);
    } finally {
      setPayingBillId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Transactions</h1>
          <p className="text-text-secondary mt-1 text-sm">
            {isLandlord
              ? 'Track payments, revenue, and billing status across all units.'
              : 'View your bills and make payments.'}
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {payError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-400">Payment Error</p>
            <p className="text-xs text-red-800/70 dark:text-red-400/70 mt-1">{payError}</p>
          </div>
          <button onClick={() => setPayError('')} className="ml-auto text-red-400 hover:text-red-600 text-sm">✕</button>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pending Payments */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-50/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">{isLandlord ? 'Pending Payments' : 'Amount Due'}</p>
                <h3 className="text-[28px] font-bold text-text-primary leading-none">₹{totalPending.toFixed(2)}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-orange-500">{pendingCount} Bill{pendingCount !== 1 ? 's' : ''}</span>
              <span className="text-sm text-text-secondary">{isLandlord ? 'awaiting payment' : 'unpaid'}</span>
            </div>
          </div>
        </div>

        {/* Total Bills */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-green-50/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">Total Bills</p>
                <h3 className="text-[28px] font-bold text-text-primary leading-none">{(allBills || []).length}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-green-600">{paidCount} paid</span>
              <span className="text-sm text-text-secondary">·</span>
              <span className="text-sm font-medium text-orange-500">{pendingCount} unpaid</span>
            </div>
          </div>
        </div>

        {/* Total Units Consumed */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-50/50 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
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
                  const isPaying = payingBillId === bill.id;
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
                          isPaid ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-secondary">{bill.unitsConsumed?.toFixed(2) || '0.00'} kWh</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Tenant: Pay Now for unpaid bills */}
                        {!isLandlord && !isPaid && (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handlePayNow(bill.id)}
                              disabled={isPaying}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f9d78] hover:bg-[#0d8a6a] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isPaying ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <IndianRupee className="w-3.5 h-3.5" />
                                  Pay Now
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        {/* Tenant: Paid — show download */}
                        {!isLandlord && isPaid && (
                          <div className="flex items-center gap-2 justify-end">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Paid
                            </span>
                            <button
                              onClick={() => downloadInvoice(bill, bill.tenant)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-divider text-text-secondary rounded-lg text-xs font-medium hover:bg-hover-bg transition-colors"
                              title="Download Invoice"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              Invoice
                            </button>
                          </div>
                        )}
                        {/* Landlord: Reminder button + download */}
                        {isLandlord && !isPaid && (
                          <div className="flex items-center gap-2 justify-end">
                            <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-200 dark:border-green-800 text-green-600 rounded-lg text-xs font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                              <MessageCircle className="w-3.5 h-3.5" />
                              Reminder
                            </button>
                            <button
                              onClick={() => downloadInvoice(bill, bill.tenant)}
                              className="inline-flex items-center gap-1.5 p-1.5 text-text-tertiary hover:text-text-primary hover:bg-hover-bg rounded-lg transition-colors"
                              title="Download Invoice"
                            >
                              <FileDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {isLandlord && isPaid && (
                          <div className="flex items-center gap-2 justify-end">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Received
                            </span>
                            <button
                              onClick={() => downloadInvoice(bill, bill.tenant)}
                              className="inline-flex items-center gap-1.5 p-1.5 text-text-tertiary hover:text-text-primary hover:bg-hover-bg rounded-lg transition-colors"
                              title="Download Invoice"
                            >
                              <FileDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
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
