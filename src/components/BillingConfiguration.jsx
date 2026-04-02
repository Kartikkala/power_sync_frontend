import React, { useState } from 'react';
import { 
  Zap, 
  Settings2, 
  Calendar, 
  Wallet, 
  Clock, 
  Percent,
  Calculator,
  Save
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setBaseRate } from '../store/billingSlice';

export default function BillingConfiguration() {
  const dispatch = useDispatch();
  const globalBaseRate = useSelector((state) => state.billing.baseRate);

  const [rates, setRates] = useState({
    peakPricing: false,
    peakRate: 9.00
  });

  const [fixedCharges, setFixedCharges] = useState({
    maintenance: 1500,
    meterRent: 200,
    commonArea: 450
  });

  const [policies, setPolicies] = useState({
    billingDate: 1, // 1st of the month
    gracePeriod: 5, // 5 days
    lateFeeType: 'flat', // 'flat' or 'percent'
    lateFeeAmount: 50
  });

  const [tax, setTax] = useState({
    gst: 18
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Billing Configuration</h1>
          <p className="text-text-secondary mt-1 text-sm">Set up rates, tax settings, and automated penalties.</p>
        </div>
        <button className="btn-primary">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          
          {/* Rate Structure */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100/50 text-orange-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Rate Structure</h2>
                <p className="text-sm text-text-secondary">Configure electricity unit pricing</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary">Base Rate per kWh (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-text-tertiary">₹</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={globalBaseRate}
                    onChange={(e) => dispatch(setBaseRate(parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-divider">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">Dynamic Peak Pricing</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Charge higher rates during peak hours (6 PM - 10 PM)</p>
                  </div>
                  <button 
                    onClick={() => setRates({...rates, peakPricing: !rates.peakPricing})}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rates.peakPricing ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rates.peakPricing ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {rates.peakPricing && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-medium text-text-secondary">Peak Hours Rate (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-text-tertiary">₹</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={rates.peakRate}
                        onChange={(e) => setRates({...rates, peakRate: parseFloat(e.target.value)})}
                        className="w-full pl-8 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Tax Settings */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100/50 text-blue-600 flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Tax Settings</h2>
                <p className="text-sm text-text-secondary">Global taxation percentages</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary">GST / State Tax (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={tax.gst}
                    onChange={(e) => setTax({...tax, gst: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-text-tertiary">%</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          
          {/* Fixed Charges */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100/50 text-green-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Fixed Recurring Charges</h2>
                <p className="text-sm text-text-secondary">Flat fees applied per billing cycle</p>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex justify-between">
                  <span>Maintenance Fee</span>
                  <span className="text-text-tertiary text-xs">Monthly</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-text-tertiary">₹</span>
                  <input 
                    type="number" 
                    value={fixedCharges.maintenance}
                    onChange={(e) => setFixedCharges({...fixedCharges, maintenance: parseFloat(e.target.value)})}
                    className="w-full pl-8 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex justify-between">
                  <span>Smart Meter Rent</span>
                  <span className="text-text-tertiary text-xs">Monthly</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-text-tertiary">₹</span>
                  <input 
                    type="number" 
                    value={fixedCharges.meterRent}
                    onChange={(e) => setFixedCharges({...fixedCharges, meterRent: parseFloat(e.target.value)})}
                    className="w-full pl-8 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex justify-between">
                  <span>Common Area Light Share</span>
                  <span className="text-text-tertiary text-xs">Monthly Flat</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-text-tertiary">₹</span>
                  <input 
                    type="number" 
                    value={fixedCharges.commonArea}
                    onChange={(e) => setFixedCharges({...fixedCharges, commonArea: parseFloat(e.target.value)})}
                    className="w-full pl-8 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Automation & Policies */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100/50 text-purple-600 flex items-center justify-center">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Automation & Policies</h2>
                <p className="text-sm text-text-secondary">Billing cycle and penalty rules</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Billing Date</label>
                  <select 
                    value={policies.billingDate}
                    onChange={(e) => setPolicies({...policies, billingDate: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all appearance-none cursor-pointer"
                  >
                    {[1, 5, 10, 15, 20, 25, 28].map(date => (
                      <option key={date} value={date}>{date}{date === 1 ? 'st' : date === 5 ? 'th' : 'th'} of month</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Grace Period</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={policies.gracePeriod}
                      onChange={(e) => setPolicies({...policies, gracePeriod: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">Days</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-divider space-y-4">
                <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  Late Fee Penalties
                </h4>
                
                <div className="flex bg-bg rounded-lg p-1 border border-divider">
                  <button 
                    onClick={() => setPolicies({...policies, lateFeeType: 'flat'})}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${policies.lateFeeType === 'flat' ? 'bg-card shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    Flat Rate (₹)
                  </button>
                  <button 
                    onClick={() => setPolicies({...policies, lateFeeType: 'percent'})}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${policies.lateFeeType === 'percent' ? 'bg-card shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    Percentage (%)
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {policies.lateFeeType === 'flat' ? 'Penalty Amount (₹ per day)' : 'Penalty Percentage (% per day)'}
                  </label>
                  <div className="relative">
                    {policies.lateFeeType === 'flat' && <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-text-tertiary">₹</span>}
                    <input 
                      type="number" 
                      value={policies.lateFeeAmount}
                      onChange={(e) => setPolicies({...policies, lateFeeAmount: parseFloat(e.target.value)})}
                      className={`w-full ${policies.lateFeeType === 'flat' ? 'pl-8 pr-3' : 'px-4'} py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all font-medium`}
                    />
                    {policies.lateFeeType === 'percent' && <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-text-tertiary">%</span>}
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
