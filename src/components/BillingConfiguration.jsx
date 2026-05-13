import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  FileText,
  Receipt,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnpaidBills, generateBills } from '../store/billingSlice';

export default function BillingConfiguration() {
  const dispatch = useDispatch();
  const { unpaidBills, loading } = useSelector((state) => state.billing);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState(null);
  const [genError, setGenError] = useState('');
  // Default to current month (YYYY-MM-01)
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const [billingMonth, setBillingMonth] = useState(defaultMonth);

  useEffect(() => {
    dispatch(fetchUnpaidBills());
  }, [dispatch]);

  // Compute metrics from unpaid bills
  const totalPending = (unpaidBills || []).reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalUnits = (unpaidBills || []).reduce((sum, b) => sum + (b.unitsConsumed || 0), 0);
  const avgRate = unpaidBills.length > 0
    ? (unpaidBills.reduce((sum, b) => sum + (b.unitRate || 0), 0) / unpaidBills.length)
    : 0;

  const handleGenerate = async () => {
    setGenerating(true);
    setGenResult(null);
    setGenError('');
    try {
      const result = await dispatch(generateBills(billingMonth)).unwrap();
      setGenResult(result);
      dispatch(fetchUnpaidBills()); // Refresh after generation
    } catch (err) {
      const msg = typeof err === 'string' ? err 
        : err?.message || err?.error || JSON.stringify(err) || 'Failed to generate bills';
      setGenError(msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Billing</h1>
          <p className="text-text-secondary mt-1 text-sm">Generate bills and track billing metrics.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Pending</p>
              <h3 className="text-2xl font-bold text-text-primary">₹{totalPending.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="premium-card group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Unpaid Bills</p>
              <h3 className="text-2xl font-bold text-text-primary">{unpaidBills.length}</h3>
            </div>
          </div>
        </div>

        <div className="premium-card group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Units Billed</p>
              <h3 className="text-2xl font-bold text-text-primary">{totalUnits.toFixed(2)} <span className="text-sm font-normal text-text-tertiary">kWh</span></h3>
            </div>
          </div>
        </div>

        <div className="premium-card group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Avg Unit Rate</p>
              <h3 className="text-2xl font-bold text-text-primary">₹{avgRate.toFixed(2)} <span className="text-sm font-normal text-text-tertiary">/kWh</span></h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generate Bills */}
        <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
          <div className="p-6 border-b border-divider flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100/50 text-orange-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Generate Bills</h2>
              <p className="text-sm text-text-secondary">Manually trigger bill generation for all tenants</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Month Selector */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Billing Month</label>
              <input
                type="month"
                value={billingMonth.substring(0, 7)}
                onChange={(e) => setBillingMonth(e.target.value + '-01')}
                className="w-full px-4 py-2.5 bg-bg border border-divider rounded-xl text-sm text-text-primary focus:outline-none focus:border-[#0f9d78] focus:ring-1 focus:ring-[#0f9d78] transition-all"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-400">How it works</p>
                  <p className="text-xs text-blue-800/70 dark:text-blue-400/70 mt-1">
                    Select the month to generate bills for. The system calculates usage from IoT power
                    readings within that month's date range.
                  </p>
                  <p className="text-xs text-blue-800/70 dark:text-blue-400/70 mt-1">
                    <strong>Formula:</strong> Total = Units Consumed × Unit Rate per kWh
                  </p>
                  <p className="text-xs text-blue-800/70 dark:text-blue-400/70 mt-1">
                    Duplicate bills for the same tenant + period are automatically skipped.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 bg-[#0f9d78] hover:bg-[#0d8a6a] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#0f9d78]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  Generate Bills Now
                </>
              )}
            </button>

            {genResult && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-400">Bills Generated</p>
                    <p className="text-xs text-green-800/70 dark:text-green-400/70 mt-1">
                      {genResult.billsGenerated || 0} bill(s) generated for {genResult.billingMonth || 'current period'}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {genError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4 text-sm text-red-600 dark:text-red-400">
                {genError}
              </div>
            )}
          </div>
        </section>

        {/* Unpaid Bills Summary */}
        <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
          <div className="p-6 border-b border-divider flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100/50 text-red-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Unpaid Bills</h2>
                <p className="text-sm text-text-secondary">Bills awaiting tenant payment</p>
              </div>
            </div>
            <span className="text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 px-2.5 py-1 rounded-full">
              {unpaidBills.length} pending
            </span>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-text-tertiary animate-spin" />
              </div>
            ) : unpaidBills.length === 0 ? (
              <div className="text-center py-8 text-text-tertiary">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">All bills are paid! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {unpaidBills.map(bill => (
                  <div key={bill.id} className="flex items-center justify-between p-3 bg-bg rounded-xl border border-divider">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center text-xs font-bold">
                        {(bill.tenant?.fullname || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{bill.tenant?.fullname || 'Unknown'}</p>
                        <p className="text-xs text-text-secondary">Room {bill.room?.roomNumber || '--'} · {bill.unitsConsumed?.toFixed(2)} kWh</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">₹{bill.totalAmount?.toFixed(2)}</p>
                      <p className="text-xs text-text-tertiary">{bill.billingPeriodStart} → {bill.billingPeriodEnd}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
