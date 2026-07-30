import React from 'react';

interface DataBarProps {
  value: number;
  maxVal: number;
  formattedText: string;
  fillColor?: string;
  isNegative?: boolean;
}

export const DataBar: React.FC<DataBarProps> = ({
  value,
  maxVal,
  formattedText,
  fillColor = '#2251FF',
  isNegative = false,
}) => {
  const percentage = maxVal > 0 ? Math.min(100, Math.max(0, (Math.abs(value) / maxVal) * 100)) : 0;
  const barColor = isNegative ? '#D32F2F' : fillColor;

  return (
    <div className="relative w-full flex items-center justify-end h-6 px-1.5 overflow-hidden rounded group">
      {/* Background Track & Filled Bar */}
      <div className="absolute inset-0 bg-[#051C2C]/5 rounded pointer-events-none overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-out opacity-25 group-hover:opacity-40"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
            marginLeft: 'auto',
          }}
        />
      </div>
      {/* Numeric Label */}
      <span
        className={`relative z-10 font-mono text-[12px] font-medium ${
          isNegative ? 'text-[#D32F2F]' : 'text-[#051C2C]'
        }`}
      >
        {formattedText}
      </span>
    </div>
  );
};
