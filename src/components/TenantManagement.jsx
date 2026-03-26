import React, { useState } from 'react';
import { Search, Plus, Users, Wifi, AlertTriangle, Wallet, Eye, Edit2, Calendar, Clock } from 'lucide-react';
import AddTenantModal from './AddTenantModal';

export default function TenantManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        {/* Total Tenants */}
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Tenants</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">24</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active (Online) */}
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Active (Online)</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">22</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-500">
            <Wifi className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Bills */}
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Overdue Bills</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">3</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100/60 text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Balance */}
        <div className="premium-card flex justify-between items-center py-5">
          <div>
            <p className="text-[13px] font-medium text-text-secondary leading-none mb-1.5">Total Balance</p>
            <h3 className="text-2xl font-bold text-text-primary leading-none">₹48,250</h3>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-400">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden flex flex-col">
        {/* Table Header area */}
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-text-primary">All Tenants</h2>
            <span className="px-2.5 py-1 bg-bg text-text-secondary rounded-md text-xs font-medium border border-divider">
              24 Total
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-secondary border border-divider rounded-lg hover:bg-hover-bg transition-colors">
              <Calendar className="w-4 h-4" />
              This Month
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-divider bg-bg/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tenant Name / Room #</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Connection Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Current Usage</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Outstanding (₹)</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Grace Period</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              
              {/* Row 1 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">JD</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">John Doe</span>
                        <div className="w-2.5 h-3.5 bg-green-500 rounded-sm"></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">Room 101 • Lease: Dec '24</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-text-primary">Online</span>
                  </div>
                  <p className="text-xs text-text-secondary">IoT ID: #IOT-8821</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">142.5 kWh</p>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[45%]"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">₹0.00</p>
                  <p className="text-xs text-green-600 font-medium">Cleared</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                    <Calendar className="w-3 h-3" />
                    12 Days Left
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-green-500">
                      <span className="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">SP</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">Sarah Parker</span>
                        <div className="w-2.5 h-3.5 bg-green-500 rounded-sm"></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">Room 102 • Lease: Jan '25</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium text-text-primary">Offline</span>
                  </div>
                  <p className="text-xs text-red-500">Last seen: 2h ago</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">89.2 kWh</p>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[25%]"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">₹3,450.00</p>
                  <p className="text-xs text-red-500 font-medium">Past Due</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">
                    <Clock className="w-3 h-3" />
                    2 Days Left
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-green-500">
                      <span className="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold text-sm">MJ</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">Mike Johnson</span>
                        <div className="w-2.5 h-3.5 bg-green-500 rounded-sm"></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">Room 103 • Lease: Mar '24</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-text-primary">Online</span>
                  </div>
                  <p className="text-xs text-text-secondary">IoT ID: #IOT-9902</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">210.4 kWh</p>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[60%]"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">₹1,240.00</p>
                  <p className="text-xs text-orange-500 font-medium">Pending</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">
                    <Clock className="w-3 h-3" />
                    5 Days Left
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-green-500">
                      <span className="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-hover-bg transition-colors opacity-75">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">EL</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">Emma Lewis</span>
                        <div className="w-2.5 h-3.5 bg-slate-300 rounded-sm"></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">Room 201 • Lease: Expired</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="text-sm font-medium text-text-primary">Disconnected</span>
                  </div>
                  <p className="text-xs text-text-secondary">IoT ID: #IOT-7711</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-secondary mb-1">-- kWh</p>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 w-0"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">₹5,200.00</p>
                  <p className="text-xs text-red-500 font-medium">Debt Referred</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                    Expired
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-200">
                      <span className="translate-x-0 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 5 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold text-sm">RC</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">Raj Chowdhury</span>
                        <div className="w-2.5 h-3.5 bg-green-500 rounded-sm"></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">Room 202 • Lease: Aug '24</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-text-primary">Online</span>
                  </div>
                  <p className="text-xs text-text-secondary">IoT ID: #IOT-8114</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">310.8 kWh</p>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[85%]"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-text-primary mb-1">₹0.00</p>
                  <p className="text-xs text-green-600 font-medium">Pre-paid</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                    <Calendar className="w-3 h-3" />
                    28 Days Left
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="text-text-tertiary hover:text-text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-green-500">
                      <span className="translate-x-4 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-divider flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-semibold text-text-primary">1</span> to <span className="font-semibold text-text-primary">5</span> of <span className="font-semibold text-text-primary">24</span> tenants
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-text-tertiary border border-divider rounded-lg cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 text-sm font-medium text-text-primary border border-divider rounded-lg hover:bg-hover-bg transition-colors">Next</button>
          </div>
        </div>
      </div>

      <AddTenantModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
