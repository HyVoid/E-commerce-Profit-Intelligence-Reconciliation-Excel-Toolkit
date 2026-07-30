import React from 'react';
import { ActiveTab } from '../types';
import {
  TrendingUp,
  Calculator,
  Truck,
  CheckCircle2,
  Database,
  Sliders,
  Download,
  Upload,
  FileSpreadsheet,
  RotateCcw,
  Clock,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  lastSaved: string;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onOpenBulkCsv: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  lastSaved,
  onExportBackup,
  onImportBackup,
  onOpenBulkCsv,
  onResetData,
}) => {
  const formattedLastSaved = React.useMemo(() => {
    if (!lastSaved) return 'Not saved yet';
    const date = new Date(lastSaved);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [lastSaved]);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'DASH_Executive_Board',
      label: 'Executive Board',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    {
      id: 'ENG_Profit_Engine',
      label: 'Profit Engine',
      icon: <Calculator className="w-3.5 h-3.5" />,
    },
    {
      id: 'AUD_Shipping_Tier',
      label: 'Shipping Audit',
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    {
      id: 'REC_Reconciliation',
      label: 'Reconciliation',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'RAW_Orders',
      label: 'Raw Data',
      icon: <Database className="w-3.5 h-3.5" />,
    },
    {
      id: 'SYS_Parameters',
      label: 'Parameters & Rules',
      icon: <Sliders className="w-3.5 h-3.5" />,
    },
  ];

  // Helper to check active group
  const isActive = (id: ActiveTab) => {
    if (activeTab === id) return true;
    if (
      id === 'RAW_Orders' &&
      [
        'RAW_Orders',
        'RAW_Payouts',
        'RAW_3PL_Invoices',
        'RAW_Refunds',
        'RAW_AdSpend',
      ].includes(activeTab)
    ) {
      return true;
    }
    if (
      id === 'SYS_Parameters' &&
      ['SYS_Parameters', 'SYS_Rate_History', 'MAP_Bundle_Rules'].includes(activeTab)
    ) {
      return true;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 h-[56px] bg-white border-b border-[#E8E8E6] shadow-xs flex items-center px-6">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#051C2C] flex items-center justify-center text-white font-bold text-sm tracking-wider font-heading">
            E
          </div>
          <div>
            <h1 className="font-heading font-bold text-[16px] text-[#051C2C] leading-none tracking-tight">
              PROFIT ENGINE
            </h1>
            <p className="text-[10px] text-[#888888] tracking-widest uppercase mt-0.5">
              E-COMMERCE RECONCILIATION
            </p>
          </div>
        </div>

        {/* Tab Navigation Links */}
        <nav className="flex items-center gap-1 mx-4">
          {navItems.map((item) => {
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative h-[56px] px-3.5 flex items-center gap-1.5 text-[13px] font-medium transition-colors ${
                  active ? 'text-[#051C2C] font-semibold' : 'text-[#051C2C]/60 hover:text-[#051C2C]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2251FF] rounded-t-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions & Last Saved Indicator */}
        <div className="flex items-center gap-3 text-[12px]">
          {/* Last Saved Badge */}
          <div
            title="Auto-saved to local browser storage"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F5F2] rounded-md text-[#051C2C]/80 font-mono text-[11px] border border-[#E8E8E6]"
          >
            <Clock className="w-3.5 h-3.5 text-[#2251FF]" />
            <span>
              Last saved:{' '}
              <strong className="text-[#051C2C] font-semibold">
                {formattedLastSaved}
              </strong>
            </span>
          </div>

          {/* Export Backup */}
          <button
            onClick={onExportBackup}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[#051C2C] hover:bg-[#F5F5F2] border border-[#E8E8E6] transition-colors"
            title="Export full backup as JSON file"
          >
            <Download className="w-3.5 h-3.5 text-[#2251FF]" />
            <span>Export Backup</span>
          </button>

          {/* Import Backup */}
          <button
            onClick={onImportBackup}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[#051C2C] hover:bg-[#F5F5F2] border border-[#E8E8E6] transition-colors"
            title="Import backup from JSON file"
          >
            <Upload className="w-3.5 h-3.5 text-[#2251FF]" />
            <span>Import</span>
          </button>

          {/* Bulk CSV Import */}
          <button
            onClick={onOpenBulkCsv}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white bg-[#2251FF] hover:bg-[#1a41cc] transition-colors shadow-xs font-medium"
            title="Import Bulk CSV into raw data tables"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
            <span>Bulk CSV</span>
          </button>

          {/* Reset Data */}
          <button
            onClick={onResetData}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[#D32F2F] hover:bg-[#D32F2F]/10 border border-[#D32F2F]/20 transition-colors"
            title="Reset dataset back to seed defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
