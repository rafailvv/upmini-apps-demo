import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => (
  <div className="mb-4">
    <h2 className="text-xl font-semibold leading-tight text-black">{title}</h2>
    {description && <p className="text-sm opacity-80 mt-1 text-gray-600">{description}</p>}
  </div>
);
