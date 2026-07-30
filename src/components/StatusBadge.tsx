import React from 'react';
import { TrustScoreType, ReconciliationStatus, ShippingTierType } from '../types';

interface StatusBadgeProps {
  type: 'trust' | 'rec' | 'tier';
  value: TrustScoreType | ReconciliationStatus | ShippingTierType | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  let bg = 'bg-gray-100';
  let text = 'text-[#051C2C]';
  let dotColor = 'bg-[#888888]';

  if (type === 'trust') {
    if (value.includes('HIGH')) {
      bg = 'bg-[#00C853]/10';
      text = 'text-[#008035]';
      dotColor = 'bg-[#00C853]';
    } else if (value.includes('MEDIUM')) {
      bg = 'bg-[#2251FF]/10';
      text = 'text-[#2251FF]';
      dotColor = 'bg-[#2251FF]';
    } else {
      bg = 'bg-[#888888]/15';
      text = 'text-[#555555]';
      dotColor = 'bg-[#888888]';
    }
  } else if (type === 'rec') {
    if (value === 'MATCHED') {
      bg = 'bg-[#00C853]/10';
      text = 'text-[#008035]';
      dotColor = 'bg-[#00C853]';
    } else {
      bg = 'bg-[#D32F2F]/10';
      text = 'text-[#D32F2F]';
      dotColor = 'bg-[#D32F2F]';
    }
  } else if (type === 'tier') {
    if (value.includes('Tier 1')) {
      bg = 'bg-[#2251FF]/10';
      text = 'text-[#2251FF]';
      dotColor = 'bg-[#2251FF]';
    } else if (value.includes('Tier 2')) {
      bg = 'bg-amber-500/10';
      text = 'text-amber-800';
      dotColor = 'bg-amber-500';
    } else {
      bg = 'bg-gray-100';
      text = 'text-[#555555]';
      dotColor = 'bg-gray-400';
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide transition-transform hover:scale-[1.04] cursor-default ${bg} ${text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {value}
    </span>
  );
};
