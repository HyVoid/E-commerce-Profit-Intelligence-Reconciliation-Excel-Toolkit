import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  DollarSign,
  PackageCheck,
  Undo2,
  Megaphone,
  History,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  lastSaved: string;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onOpenBulkCsv: () => void;
  onResetData: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  lastSaved,
  onExportBackup,
  onImportBackup,
  onOpenBulkCsv,
  onResetData,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [rawExpanded, setRawExpanded] = useState(true);
  const [sysExpanded, setSysExpanded] = useState(true);

  const formattedLastSaved = React.useMemo(() => {
    if (!lastSaved) return 'Not saved yet';
    const date = new Date(lastSaved);
    return date.toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [lastSaved]);

  const isRawTab = [
    'RAW_Orders',
    'RAW_Payouts',
    'RAW_3PL_Invoices',
    'RAW_Refunds',
    'RAW_AdSpend',
  ].includes(activeTab);

  const isSysTab = [
    'SYS_Parameters',
    'SYS_Rate_History',
    'MAP_Bundle_Rules',
  ].includes(activeTab);

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-[#E8E8E6] shadow-sm flex flex-col transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-[64px] min-h-[64px] px-4 border-b border-[#E8E8E6] flex items-center justify-between bg-white">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-[#051C2C] flex items-center justify-center text-white font-bold text-sm tracking-wider font-heading shrink-0 shadow-xs">
              PE
            </div>
            <div className="min-w-0">
              <h1 className="font-heading font-bold text-[13px] text-[#051C2C] leading-tight tracking-tight truncate" title="Order-Level Profit Engine">
                Order-Level Profit Engine
              </h1>
              <p className="text-[10px] text-[#888888] tracking-wider uppercase truncate" title="Financial Reconciliation Toolkit">
                Financial Reconciliation Toolkit
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-lg bg-[#051C2C] flex items-center justify-center text-white font-bold text-sm tracking-wider font-heading shadow-xs">
              PE
            </div>
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-[#F5F5F2] text-[#888888] hover:text-[#051C2C] transition-colors shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#2251FF]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#888888]" />
          )}
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
        {!isCollapsed && (
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#888888]">
            Main Dashboards
          </div>
        )}

        {/* Executive Board */}
        <button
          onClick={() => onSelectTab('DASH_Executive_Board')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
            activeTab === 'DASH_Executive_Board'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C]/80 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
          }`}
          title="Executive Board"
        >
          <TrendingUp
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'DASH_Executive_Board' ? 'text-[#2251FF]' : 'text-[#888888]'
            }`}
          />
          {!isCollapsed && <span className="truncate">Executive Board</span>}
        </button>

        {/* Profit Engine */}
        <button
          onClick={() => onSelectTab('ENG_Profit_Engine')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
            activeTab === 'ENG_Profit_Engine'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C]/80 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
          }`}
          title="Profit Engine"
        >
          <Calculator
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'ENG_Profit_Engine' ? 'text-[#2251FF]' : 'text-[#888888]'
            }`}
          />
          {!isCollapsed && <span className="truncate">Profit Engine</span>}
        </button>

        {/* Shipping Audit */}
        <button
          onClick={() => onSelectTab('AUD_Shipping_Tier')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
            activeTab === 'AUD_Shipping_Tier'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C]/80 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
          }`}
          title="Shipping Audit"
        >
          <Truck
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'AUD_Shipping_Tier' ? 'text-[#2251FF]' : 'text-[#888888]'
            }`}
          />
          {!isCollapsed && <span className="truncate">Shipping Audit</span>}
        </button>

        {/* Reconciliation */}
        <button
          onClick={() => onSelectTab('REC_Reconciliation')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
            activeTab === 'REC_Reconciliation'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C]/80 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
          }`}
          title="Reconciliation"
        >
          <CheckCircle2
            className={`w-4 h-4 shrink-0 ${
              activeTab === 'REC_Reconciliation' ? 'text-[#2251FF]' : 'text-[#888888]'
            }`}
          />
          {!isCollapsed && <span className="truncate">Reconciliation</span>}
        </button>

        {/* Separator */}
        <div className="my-3 border-t border-[#E8E8E6]" />

        {/* Section: Raw Data Tables */}
        <div>
          {!isCollapsed ? (
            <button
              onClick={() => {
                setRawExpanded(!rawExpanded);
                if (!isRawTab) onSelectTab('RAW_Orders');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${
                isRawTab ? 'text-[#2251FF]' : 'text-[#888888] hover:text-[#051C2C]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                <span>Raw Data Tables</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  rawExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('RAW_Orders')}
              className={`w-full flex justify-center py-2.5 rounded-lg text-[13px] ${
                isRawTab ? 'bg-[#051C2C] text-white' : 'text-[#888888] hover:bg-[#F5F5F2]'
              }`}
              title="Raw Data Tables"
            >
              <Database className="w-4 h-4" />
            </button>
          )}

          {/* Subtabs if expanded */}
          {(!isCollapsed ? rawExpanded : false) && (
            <div className="ml-3 pl-3 border-l-2 border-[#E8E8E6] mt-1 space-y-1">
              <button
                onClick={() => onSelectTab('RAW_Orders')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === 'RAW_Orders'
                    ? 'bg-[#2251FF]/10 text-[#2251FF] font-bold'
                    : 'text-[#051C2C]/70 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>RAW_Orders</span>
              </button>

              <button
                onClick={() => onSelectTab('RAW_Payouts')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === 'RAW_Payouts'
                    ? 'bg-[#2251FF]/10 text-[#2251FF] font-bold'
                    : 'text-[#051C2C]/70 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>RAW_Payouts</span>
              </button>

              <button
                onClick={() => onSelectTab('RAW_3PL_Invoices')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === 'RAW_3PL_Invoices'
                    ? 'bg-[#2251FF]/10 text-[#2251FF] font-bold'
                    : 'text-[#051C2C]/70 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 shrink-0" />
                <span>RAW_3PL_Invoices</span>
              </button>

              <button
                onClick={() => onSelectTab('RAW_Refunds')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === 'RAW_Refunds'
                    ? 'bg-[#2251FF]/10 text-[#2251FF] font-bold'
                    : 'text-[#051C2C]/70 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
                }`}
              >
                <Undo2 className="w-3.5 h-3.5 shrink-0" />
                <span>RAW_Refunds</span>
              </button>

              <button
                onClick={() => onSelectTab('RAW_AdSpend')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === 'RAW_AdSpend'
                    ? 'bg-[#2251FF]/10 text-[#2251FF] font-bold'
                    : 'text-[#051C2C]/70 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5 shrink-0" />
                <span>RAW_AdSpend</span>
              </button>
            </div>
          )}
        </div>

        {/* Section: System Parameters */}
        <div className="pt-2">
          {!isCollapsed ? (
            <button
              onClick={() => {
                setSysExpanded(!sysExpanded);
                if (!isSysTab) onSelectTab('SYS_Parameters');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${
                isSysTab ? 'text-[#2251FF]' : 'text-[#888888] hover:text-[#051C2C]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Parameters & Rules</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  sysExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('SYS_Parameters')}
              className={`w-full flex justify-center py-2.5 rounded-lg text-[13px] ${
                isSysTab ? 'bg-[#051C2C] text-white' : 'text-[#888888] hover:bg-[#F5F5F2]'
              }`}
              title="Parameters & Rules"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          {/* Subtabs if expanded */}
          {(!isCollapsed ? sysExpanded : false) && (
            <div className="ml-3 pl-3 border-l-2 border-[#E8E8E6] mt-1 space-y-1">
              <button
                onClick={() => onSelectTab('SYS_Parameters')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === 'SYS_Parameters'
                    ? 'bg-[#2251FF]/10 text-[#2251FF] font-bold'
                    : 'text-[#051C2C]/70 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                <span>SYS_Parameters</span>
              </button>

              <button
                onClick={() => onSelectTab('SYS_Rate_History')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === 'SYS_Rate_History'
                    ? 'bg-[#2251FF]/10 text-[#2251FF] font-bold'
                    : 'text-[#051C2C]/70 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
                }`}
              >
                <History className="w-3.5 h-3.5 shrink-0" />
                <span>SYS_Rate_History</span>
              </button>

              <button
                onClick={() => onSelectTab('MAP_Bundle_Rules')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === 'MAP_Bundle_Rules'
                    ? 'bg-[#2251FF]/10 text-[#2251FF] font-bold'
                    : 'text-[#051C2C]/70 hover:bg-[#F5F5F2] hover:text-[#051C2C]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>MAP_Bundle_Rules</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Bottom Actions & Info */}
      <div className="p-3 border-t border-[#E8E8E6] bg-[#F5F5F2]/60 space-y-2">
        {/* Bulk CSV Primary CTA Button */}
        <button
          onClick={onOpenBulkCsv}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#2251FF] hover:bg-[#1a41cc] text-white font-semibold text-[12px] shadow-xs transition-colors ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="Bulk CSV Import"
        >
          <FileSpreadsheet className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Bulk CSV Import</span>}
        </button>

        {/* Secondary Utility Actions */}
        {!isCollapsed ? (
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={onExportBackup}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-[#E8E8E6] rounded-md text-[11px] font-medium text-[#051C2C] hover:bg-gray-100 transition-colors"
              title="Export full backup as JSON file"
            >
              <Download className="w-3.5 h-3.5 text-[#2251FF]" />
              <span>Export</span>
            </button>

            <button
              onClick={onImportBackup}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-[#E8E8E6] rounded-md text-[11px] font-medium text-[#051C2C] hover:bg-gray-100 transition-colors"
              title="Import backup from JSON file"
            >
              <Upload className="w-3.5 h-3.5 text-[#2251FF]" />
              <span>Import</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={onExportBackup}
              className="p-2 bg-white border border-[#E8E8E6] rounded-md text-[#051C2C] hover:bg-gray-100 flex justify-center"
              title="Export JSON Backup"
            >
              <Download className="w-4 h-4 text-[#2251FF]" />
            </button>
            <button
              onClick={onImportBackup}
              className="p-2 bg-white border border-[#E8E8E6] rounded-md text-[#051C2C] hover:bg-gray-100 flex justify-center"
              title="Import JSON Backup"
            >
              <Upload className="w-4 h-4 text-[#2251FF]" />
            </button>
          </div>
        )}

        {/* Reset Data & Saved Status */}
        <div className="pt-1 border-t border-[#E8E8E6] flex items-center justify-between text-[11px] text-[#888888]">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-1 text-[10px] font-mono text-[#051C2C]/70">
                <Clock className="w-3 h-3 text-[#2251FF]" />
                <span>{formattedLastSaved}</span>
              </div>
              <button
                onClick={onResetData}
                className="text-[#D32F2F] hover:underline text-[11px] font-semibold flex items-center gap-1"
                title="Reset dataset back to seed defaults"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </>
          ) : (
            <button
              onClick={onResetData}
              className="w-full py-1 text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded flex justify-center"
              title="Reset Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
