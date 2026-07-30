import React from 'react';
import { AlertCircle, Lightbulb, ShieldCheck } from 'lucide-react';

interface InsightBlockProps {
  type?: 'insight' | 'warning' | 'success';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const InsightBlock: React.FC<InsightBlockProps> = ({
  type = 'insight',
  title,
  description,
  actionText,
  onAction,
}) => {
  let borderColor = 'border-[#2251FF]';
  let bgColor = 'bg-[#2251FF]/[0.04]';
  let icon = <Lightbulb className="w-4 h-4 text-[#2251FF] shrink-0 mt-0.5" />;

  if (type === 'warning') {
    borderColor = 'border-[#D32F2F]';
    bgColor = 'bg-[#D32F2F]/[0.04]';
    icon = <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />;
  } else if (type === 'success') {
    borderColor = 'border-[#00C853]';
    bgColor = 'bg-[#00C853]/[0.04]';
    icon = <ShieldCheck className="w-4 h-4 text-[#00C853] shrink-0 mt-0.5" />;
  }

  return (
    <div
      className={`border-l-[3px] ${borderColor} ${bgColor} p-3.5 rounded-r-lg my-3 transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <h4 className="font-semibold text-[13px] text-[#051C2C] leading-snug">
            {title}
          </h4>
          <p className="text-[12px] text-[#051C2C]/75 mt-0.5 leading-normal">
            {description}
          </p>
        </div>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="text-[12px] font-medium text-[#2251FF] hover:underline whitespace-nowrap self-center px-2 py-1 bg-white/80 rounded shadow-xs"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};
