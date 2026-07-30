/**
 * E-commerce Profit & Reconciliation Engine
 * Full-featured standalone SaaS Application
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ActiveTab, EngineDataStore } from './types';
import { loadEngineStore, saveEngineStore, resetEngineStore } from './utils/storage';
import {
  calculateProfitEngine,
  calculateShippingAudits,
  calculateReconciliation,
} from './utils/engine';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { BulkCsvModal } from './components/BulkCsvModal';
import { ExecutiveBoardView } from './components/views/ExecutiveBoardView';
import { ProfitEngineView } from './components/views/ProfitEngineView';
import { ShippingAuditView } from './components/views/ShippingAuditView';
import { ReconciliationView } from './components/views/ReconciliationView';
import { RawDataView } from './components/views/RawDataView';
import { ParametersView } from './components/views/ParametersView';

export default function App() {
  const [store, setStore] = useState<EngineDataStore>(() => loadEngineStore());
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASH_Executive_Board');
  const [activeSubTab, setActiveSubTab] = useState<ActiveTab>('RAW_Orders');
  const [isBulkCsvOpen, setIsBulkCsvOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update store helper (saves to localStorage automatically)
  const handleUpdateStore = (newStore: EngineDataStore) => {
    const saved = saveEngineStore(newStore);
    setStore(saved);
  };

  // Real-time calculation engine results
  const profits = useMemo(() => calculateProfitEngine(store), [store]);
  const shippingAudits = useMemo(() => calculateShippingAudits(store, profits), [store, profits]);
  const reconciliations = useMemo(() => calculateReconciliation(store, profits), [store, profits]);

  // Export full JSON backup
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Profit_Engine_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportBackupClick = () => {
    fileInputRef.current?.click();
  };

  const handleBackupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.parameters && parsed.orders) {
          handleUpdateStore(parsed);
          alert('Backup imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err: any) {
        alert('Failed to parse backup JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  };

  // Reset Data to Seed Defaults
  const handleResetData = () => {
    if (
      confirm(
        'Are you sure you want to reset all data back to original seed defaults? Any unsaved local edits will be overwritten.'
      )
    ) {
      const reset = resetEngineStore();
      setStore(reset);
    }
  };

  // Tab navigation coordinator
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (
      [
        'RAW_Orders',
        'RAW_Payouts',
        'RAW_3PL_Invoices',
        'RAW_Refunds',
        'RAW_AdSpend',
      ].includes(tab)
    ) {
      setActiveSubTab(tab);
    } else if (
      ['SYS_Parameters', 'SYS_Rate_History', 'MAP_Bundle_Rules'].includes(tab)
    ) {
      setActiveSubTab(tab);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F5F2] text-[#051C2C]">
      {/* Hidden file input for backup JSON upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleBackupFileChange}
        className="hidden"
      />

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        lastSaved={store.lastSaved}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackupClick}
        onOpenBulkCsv={() => setIsBulkCsvOpen(true)}
        onResetData={handleResetData}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Right Content Area with dynamic margin for Sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'pl-[72px]' : 'pl-[260px]'
        }`}
      >
        {/* Main Content Area: Centered max-width 1400px with horizontal padding */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-10 py-8">
          {/* View 1: Executive Board Dashboard */}
        {activeTab === 'DASH_Executive_Board' && (
          <ExecutiveBoardView
            store={store}
            profits={profits}
            reconciliations={reconciliations}
            onNavigateTab={handleSelectTab}
          />
        )}

        {/* View 2: Profit Engine Order Calculations */}
        {activeTab === 'ENG_Profit_Engine' && (
          <ProfitEngineView store={store} profits={profits} />
        )}

        {/* View 3: Shipping Fallback Audit */}
        {activeTab === 'AUD_Shipping_Tier' && (
          <ShippingAuditView store={store} audits={shippingAudits} />
        )}

        {/* View 4: Four-Party Reconciliation Center */}
        {activeTab === 'REC_Reconciliation' && (
          <ReconciliationView
            store={store}
            reconciliations={reconciliations}
            onUpdateParameters={(newParams) =>
              handleUpdateStore({ ...store, parameters: newParams })
            }
          />
        )}

        {/* View 5: Raw Data Ingestion Tables */}
        {[
          'RAW_Orders',
          'RAW_Payouts',
          'RAW_3PL_Invoices',
          'RAW_Refunds',
          'RAW_AdSpend',
        ].includes(activeTab) && (
          <RawDataView
            store={store}
            activeSubTab={activeSubTab}
            onSelectSubTab={(sub) => {
              setActiveSubTab(sub);
              setActiveTab(sub);
            }}
            onUpdateStore={handleUpdateStore}
            onOpenBulkCsv={() => setIsBulkCsvOpen(true)}
          />
        )}

        {/* View 6: Parameters & Rules */}
        {[
          'SYS_Parameters',
          'SYS_Rate_History',
          'MAP_Bundle_Rules',
        ].includes(activeTab) && (
          <ParametersView
            store={store}
            activeSubTab={activeSubTab}
            onSelectSubTab={(sub) => {
              setActiveSubTab(sub);
              setActiveTab(sub);
            }}
            onUpdateStore={handleUpdateStore}
          />
        )}
      </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Modal for Bulk CSV Import */}
      <BulkCsvModal
        isOpen={isBulkCsvOpen}
        onClose={() => setIsBulkCsvOpen(false)}
        store={store}
        onUpdateStore={handleUpdateStore}
      />
    </div>
  );
}
