import React, { useState } from 'react';
import { X, User, Phone, Mail, Building, Hash, Calendar } from 'lucide-react';

export default function AddTenantModal({ isOpen, onClose }) {
  const [gracePeriod, setGracePeriod] = useState(5);
  const [autoCut, setAutoCut] = useState(false);

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
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h2 className="text-xl font-bold text-text-primary">Add New Tenant</h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-tertiary hover:bg-slate-100 rounded-lg hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex flex-col gap-8">
          
          {/* Section 1: Tenant Profile */}
          <section>
            <h3 className="text-[13px] font-bold text-accent-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Tenant Profile
            </h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Unit Configuration */}
          <section>
            <h3 className="text-[13px] font-bold text-accent-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Unit Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Room / Unit No.</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="101"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Unit Type</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all appearance-none cursor-pointer">
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">IoT Smart Meter ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="SM-2024-X8"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Billing & Automation */}
          <section>
            <h3 className="text-[13px] font-bold text-accent-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Billing & Automation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Billing Start Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Enable Auto-Cut</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Cut power on overdue</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setAutoCut(!autoCut)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoCut ? 'bg-accent-primary' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoCut ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-text-primary">Grace Period (Days)</label>
                <span className="text-sm font-bold text-accent-primary">{gracePeriod} Days</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15" 
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-primary"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-text-tertiary">0 days</span>
                <span className="text-xs text-text-tertiary">15 days</span>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-primary bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-5 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:bg-accent-primary-hover transition-colors shadow-sm">
            Save Tenant
          </button>
        </div>
      </div>
    </div>
  );
}
