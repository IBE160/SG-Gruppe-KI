// apps/web/src/components/MaterialSymbol.tsx
import React from 'react';

type MaterialSymbolProps = {
  icon: string;
  className?: string;
};

export const MaterialSymbol: React.FC<MaterialSymbolProps> = ({ icon, className }) => {
  return <span className={`material-symbols-outlined ${className}`}>{icon}</span>;
};
