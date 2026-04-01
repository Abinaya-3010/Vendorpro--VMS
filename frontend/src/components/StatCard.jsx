import React from 'react';

export default function StatCard({ label, value, icon, color }) {
  return (
    <div className="rounded-xl p-5 relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-2">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ background: color + '20', border: '1px solid ' + color + '40' }}>
          {icon}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}
