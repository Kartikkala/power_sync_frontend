import React from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck,
  CreditCard,
  Globe,
  Bell,
  BadgeCheck,
  Crown,
} from 'lucide-react';

export default function SettingsPage() {
  const user = useSelector((state) => state.auth.user) || {};

  const role = user.role || 'tenant';
  const isLandlord = role === 'landlord';

  // Read-only field component
  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3 px-4 py-3 bg-bg border border-divider rounded-xl">
        <Icon className="w-4 h-4 text-text-tertiary shrink-0" />
        <span className="text-sm font-medium text-text-primary truncate">{value || '—'}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-[2rem] font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1 text-sm">Your account details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Profile Card */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            {/* Profile Banner */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 pb-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Profile Details</h2>
                  <p className="text-sm text-slate-400">Your personal information (read-only)</p>
                </div>
              </div>
            </div>

            {/* Avatar overlapping banner */}
            <div className="relative px-6 -mt-10 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f9d78] to-[#0d8a6a] flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-card">
                {(user.fullname || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField icon={User} label="Full Name" value={user.fullname} />
              <InfoField icon={Mail} label="Email Address" value={user.email} />
              <InfoField icon={Phone} label="Phone Number" value={user.contactNo || user.contact_no} />
              <InfoField 
                icon={isLandlord ? Crown : BadgeCheck} 
                label="Account Role" 
                value={isLandlord ? 'Landlord Admin' : 'Tenant User'} 
              />
            </div>
          </section>

          {/* Payment Info */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100/50 text-green-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Payments</h2>
                <p className="text-sm text-text-secondary">Powered by Cashfree</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-400 text-sm">Secure Payment Gateway</h4>
                  <p className="text-xs text-green-800/70 dark:text-green-400/70 mt-1">
                    {isLandlord 
                      ? 'Tenant payments are processed securely through Cashfree. Bills are automatically marked as paid when payment succeeds, and power is restored to the device.'
                      : 'Your payments are processed securely through Cashfree. No card or bank details are stored in this application.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          
          {/* Account Status */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100/50 text-purple-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Account</h2>
                <p className="text-sm text-text-secondary">Status & information</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Role</span>
                <span className="text-sm font-medium text-text-primary capitalize">{role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Email</span>
                <span className="text-sm font-medium text-text-primary truncate ml-4">{user.email || '—'}</span>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden">
            <div className="p-6 border-b border-divider flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100/50 text-orange-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
                <p className="text-sm text-text-secondary">Alert preferences</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Email Alerts</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Payment receipts & reminders</p>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Bill Notifications</h4>
                  <p className="text-xs text-text-secondary mt-0.5">When new bills are generated</p>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Enabled</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
