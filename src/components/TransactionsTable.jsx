import React from 'react';
import { MoreVertical } from 'lucide-react';

const trxnData = [
  {
    id: 'T-84291',
    name: 'Alex Morgan',
    avatar: 'AM',
    color: 'bg-slate-700',
    date: 'Nov 01, 2023',
    time: '09:30 AM',
    consumption: '450.5 kWh',
    amount: '₹3,450.00',
    status: 'Paid',
  },
  {
    id: 'T-84292',
    name: 'Sarah Chen',
    avatar: 'SC',
    color: 'bg-orange-500',
    date: 'Oct 31, 2023',
    time: '02:15 PM',
    consumption: '380.2 kWh',
    amount: '₹3,100.00',
    status: 'Pending',
  },
  {
    id: 'T-84293',
    name: 'Michael Ross',
    avatar: 'MR',
    color: 'bg-indigo-500',
    date: 'Oct 28, 2023',
    time: '11:45 AM',
    consumption: '520.8 kWh',
    amount: '₹4,250.00',
    status: 'Paid',
  }
];

export default function TransactionsTable() {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-black/5 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-black/5">
        <h2 className="text-xl font-bold text-text-primary">Recent Tenant Transactions</h2>
        <a href="#" className="text-accent-primary text-sm font-medium hover:underline">View All</a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-black/5 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tenant / ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Consumption</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount (₹)</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {trxnData.map((trxn, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-medium ${trxn.color}`}>
                      {trxn.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{trxn.name}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">{trxn.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-text-primary">{trxn.date}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{trxn.time}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {trxn.consumption}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                  {trxn.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    trxn.status === 'Paid' 
                      ? 'bg-green-100/50 text-green-700' 
                      : 'bg-orange-100/50 text-orange-700'
                  }`}>
                    {trxn.status === 'Paid' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>}
                    {trxn.status === 'Pending' && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span>}
                    {trxn.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="p-2 text-text-tertiary hover:bg-slate-100 rounded-lg hover:text-text-primary transition-colors inline-flex">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
