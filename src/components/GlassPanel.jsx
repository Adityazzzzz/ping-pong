import React from 'react';

export default function GlassPanel({ children, className = '', hoverable = false, style = {} }) {
  return (
    <div
      style={style}
      className={`glass-panel p-6 ${hoverable ? 'hover:border-white/20 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
