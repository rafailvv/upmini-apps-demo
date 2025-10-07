import React from 'react';

interface PillProps {
  children: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({ children }) => (
  <div className="rounded-2xl px-3 py-1 text-xs bg-black text-white">
    {children}
  </div>
);
