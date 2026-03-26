import React from 'react';
import { 
  Download, 
  Plus, 
  Receipt, 
  AlertCircle,
  CreditCard,
  Clock,
  Smartphone,
  XCircle,
  MessageCircle
} from 'lucide-react';

export default function TransactionsPage() {
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
          <button className="btn-primary whitespace-nowrap bg-[#0f9d78] hover:bg-[#0c8566] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Revenue */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          {/* Subtle Background Shape */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-green-50/50 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">Total Revenue This Month</p>
                <h3 className="text-[28px] font-bold text-text-primary leading-none">₹124,500</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                12%
              </span>
              <span className="text-sm text-text-secondary">vs last month</span>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          {/* Subtle Background Shape */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-50/50 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">Pending Payments</p>
                <h3 className="text-[28px] font-bold text-text-primary leading-none">₹12,450</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-orange-500">4 Tenants</span>
              <span className="text-sm text-text-secondary">awaiting payment</span>
            </div>
          </div>
        </div>

        {/* Failed Transactions */}
        <div className="premium-card relative overflow-hidden py-6 px-6">
          {/* Subtle Background Shape */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-red-50/50 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                <AlertCircle className="w-6 h-6 fill-red-100 stroke-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">Failed Transactions</p>
                <h3 className="text-[28px] font-bold text-text-primary leading-none">2</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold">
                Action Required
              </span>
              <span className="text-sm text-text-secondary">Resolve issues</span>
            </div>
          </div>
        </div>

      </div>

      {/* Table Section */}
      <div className="bg-card rounded-2xl shadow-card border border-divider overflow-hidden flex flex-col">
        {/* Table Header area */}
        <div className="p-6 border-b border-divider flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-text-primary">Recent Transactions</h2>
            <span className="px-2.5 py-1 bg-bg text-text-secondary rounded-md text-xs font-medium border border-divider">
              Total: 45
            </span>
          </div>
          <div className="flex bg-bg p-1 rounded-lg border border-divider">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-card shadow-sm text-text-primary">All</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-text-secondary hover:text-text-primary transition-colors">Paid</button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-text-secondary hover:text-text-primary transition-colors">Unpaid</button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-divider bg-bg/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tenant Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Room #</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount Due (₹)</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              
              {/* Row 1 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold text-sm">AM</div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Alex Morgan</p>
                      <p className="text-xs text-text-secondary">amorgan@mail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Unit 101</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-text-primary">₹3,450.00</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Nov 01, 2023</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Success
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Card •• 42</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-200 text-green-600 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reminder
                  </button>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-semibold text-sm">SP</div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Sarah Parker</p>
                      <p className="text-xs text-text-secondary">sparker@mail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Unit 204</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-text-primary">₹1,240.00</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Nov 01, 2023</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Awaiting</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-200 text-green-600 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reminder
                  </button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">JD</div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">John Doe</p>
                      <p className="text-xs text-text-secondary">johnd@mail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Unit 105</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-text-primary">₹3,120.00</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Nov 01, 2023</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Success
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm">UPI</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-200 text-green-600 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reminder
                  </button>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold text-sm">MJ</div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Mike Johnson</p>
                      <p className="text-xs text-text-secondary">mikej@mail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Unit 302</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-text-primary">₹3,000.00</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Oct 01, 2023</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    Overdue
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">Failed</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-200 text-green-600 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reminder
                  </button>
                </td>
              </tr>

              {/* Row 5 */}
              <tr className="hover:bg-hover-bg transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-sm">EL</div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Emma Lewis</p>
                      <p className="text-xs text-text-secondary">emma.l@mail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Unit 102</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-text-primary">₹2,890.00</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-secondary">Nov 01, 2023</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Success
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Card •• 89</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-200 text-green-600 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reminder
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
