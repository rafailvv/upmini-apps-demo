import React from 'react';

interface PillProps {
  children: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({ children }) => (
  <div className="rounded-2xl px-3 py-1 text-xs bg-gray-100 text-gray-700">
    {children}
  </div>
);
