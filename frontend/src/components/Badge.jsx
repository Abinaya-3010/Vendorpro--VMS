import React from 'react';

const colors = {
  Active: 'bg-green-500/10 text-green-400 border-green-500/20',
  Inactive: 'bg-red-500/10 text-red-400 border-red-500/20',
  Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  Completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  Submitted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Selected: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  Sent: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  IT: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Construction: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Logistics: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Manufacturing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Services: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function Badge({ text }) {
  const cls = colors[text] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>{text}</span>
  );
}
