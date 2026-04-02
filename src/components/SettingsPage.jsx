import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  Landmark, 
  Bell, 
  Globe, 
  ShieldCheck,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Alexender Doe',
    email: 'landlord@electric.com',
    phone: '+91 98765 43210',
    company: 'Skyline Properties LLC'
  });

  const [billing, setBilling] = useState({
    accountName: 'Alexender Doe',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXX-XXXX-1234',
    ifsc: 'HDFC0001234',
    autoAcceptUPI: true
  });

  const [preferences, setPreferences] = useState({
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata',
    emailAlerts: true,
    smsReminders: false,
    weeklyReports: true
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage your account, billing, and system preferences.</p>
        </div>
        <button className="btn-primary">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Profile & Preferences) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Profile Settings */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100/50 text-blue-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Profile Details</h2>
                <p className="text-sm text-text-secondary">Your personal and company information</p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Company / Property Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type="text" 
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Billing & Bank Details */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100/50 text-green-600 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Bank & Billing</h2>
                <p className="text-sm text-text-secondary">Where you receive your tenant payments</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Account Holder Name</label>
                  <input 
                    type="text" 
                    value={billing.accountName}
                    onChange={(e) => setBilling({...billing, accountName: e.target.value})}
                    className="w-full px-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Bank Name</label>
                  <input 
                    type="text" 
                    value={billing.bankName}
                    onChange={(e) => setBilling({...billing, bankName: e.target.value})}
                    className="w-full px-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Account Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input 
                      type="text" 
                      value={billing.accountNumber}
                      onChange={(e) => setBilling({...billing, accountNumber: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">IFSC Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input 
                      type="text" 
                      value={billing.ifsc}
                      onChange={(e) => setBilling({...billing, ifsc: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary uppercase focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-divider flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Auto-accept UPI Payments</h4>
                  <p className="text-xs text-text-secondary mt-1">Automatically verify payments via integrated UPI</p>
                </div>
                <button 
                  onClick={() => setBilling({...billing, autoAcceptUPI: !billing.autoAcceptUPI})}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${billing.autoAcceptUPI ? 'bg-accent-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${billing.autoAcceptUPI ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (App Preferences & Notifications) */}
        <div className="flex flex-col gap-8">
          
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100/50 text-purple-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Preferences</h2>
                <p className="text-sm text-text-secondary">App localization settings</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Default Currency</label>
                <select 
                  value={preferences.currency}
                  onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                  className="w-full px-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all appearance-none cursor-pointer"
                >
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Timezone</label>
                <select 
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                  className="w-full px-3 py-2 bg-bg border border-divider rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all appearance-none cursor-pointer"
                >
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Australia/Sydney (AEST)</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100/50 text-orange-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
                <p className="text-sm text-text-secondary">Manage your alerts</p>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Email Alerts</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Payment receipts & issues</p>
                </div>
                <button 
                  onClick={() => setPreferences({...preferences, emailAlerts: !preferences.emailAlerts})}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${preferences.emailAlerts ? 'bg-accent-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.emailAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">SMS Reminders</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Critical alert notifications</p>
                </div>
                <button 
                  onClick={() => setPreferences({...preferences, smsReminders: !preferences.smsReminders})}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${preferences.smsReminders ? 'bg-accent-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.smsReminders ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Weekly Reports</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Revenue & usage summaries</p>
                </div>
                <button 
                  onClick={() => setPreferences({...preferences, weeklyReports: !preferences.weeklyReports})}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${preferences.weeklyReports ? 'bg-accent-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${preferences.weeklyReports ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
