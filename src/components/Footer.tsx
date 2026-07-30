import React from 'react';
import { Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E8E8E6] bg-white py-6 mt-12">
      <div className="max-w-[1400px] mx-auto px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#888888]">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#00C853]" />
          <span>
            <strong>Data Privacy Note:</strong> All data storage in this tool is kept entirely within your local browser storage (localStorage). No user data is transmitted to or retained on any external server.
          </span>
        </div>
        <div className="text-right">
          <span>Order-Level Profit Engine & Financial Reconciliation Toolkit v1.0 • Point-in-Time Accounting</span>
        </div>
      </div>
    </footer>
  );
};
