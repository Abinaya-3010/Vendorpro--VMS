import React from 'react';

export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-5 ${onClick ? 'cursor-pointer hover:border-indigo-500/40 transition-all' : ''} ${className}`}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {children}
    </div>
  );
}
