import React, { useState } from 'react';
import {
  EngineDataStore,
  RateHistoryItem,
  BundleRuleItem,
  ActiveTab,
  RateType,
  CurrencyCode,
} from '../../types';
import { Sliders, Plus, Trash2, Layers, History, Save, Download } from 'lucide-react';
import { exportToCsv } from '../../utils/csv';

interface ParametersViewProps {
  store: EngineDataStore;
  activeSubTab: ActiveTab;
  onSelectSubTab: (tab: ActiveTab) => void;
  onUpdateStore: (newStore: EngineDataStore) => void;
}

export const ParametersView: React.FC<ParametersViewProps> = ({
  store,
  activeSubTab,
  onSelectSubTab,
  onUpdateStore,
}) => {
  // 1. Parameters Handler
  const handleUpdateParam = (key: keyof typeof store.parameters, val: any) => {
    onUpdateStore({
      ...store,
      parameters: {
        ...store.parameters,
        [key]: val,
      },
    });
  };

  // 2. Rate History Handlers
  const handleUpdateRateHistory = (id: string, field: keyof RateHistoryItem, val: any) => {
    const updated = store.rateHistory.map((r) => (r.id === id ? { ...r, [field]: val } : r));
    onUpdateStore({ ...store, rateHistory: updated });
  };

  const handleAddRateHistory = () => {
    const newRate: RateHistoryItem = {
      id: `rh-${Date.now()}`,
      type: 'COGS',
      key: 'SKU-NEW-ITEM',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2099-12-31',
      rateOrCost: 10.00,
      currency: 'EUR',
      notes: 'New Rate Version',
    };
    onUpdateStore({ ...store, rateHistory: [newRate, ...store.rateHistory] });
  };

  const handleDeleteRateHistory = (id: string) => {
    onUpdateStore({ ...store, rateHistory: store.rateHistory.filter((r) => r.id !== id) });
  };

  // 3. Bundle Rules Handlers
  const handleUpdateBundleRule = (id: string, field: keyof BundleRuleItem, val: any) => {
    const updated = store.bundleRules.map((b) => (b.id === id ? { ...b, [field]: val } : b));
    onUpdateStore({ ...store, bundleRules: updated });
  };

  const handleAddBundleRule = () => {
    const newBundle: BundleRuleItem = {
      id: `br-${Date.now()}`,
      bundleSku: 'BUNDLE-NEW-01',
      componentSku: 'SKU-MAIN-A',
      componentQty: 1,
      costSharePct: 1.0,
    };
    onUpdateStore({ ...store, bundleRules: [...store.bundleRules, newBundle] });
  };

  const handleDeleteBundleRule = (id: string) => {
    onUpdateStore({ ...store, bundleRules: store.bundleRules.filter((b) => b.id !== id) });
  };

  const subTabs: { id: ActiveTab; label: string }[] = [
    { id: 'SYS_Parameters', label: 'SYS_Parameters' },
    { id: 'SYS_Rate_History', label: 'SYS_Rate_History' },
    { id: 'MAP_Bundle_Rules', label: 'MAP_Bundle_Rules' },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Bar */}
      <div className="bg-white p-5 card-elevation-md flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-[22px] text-[#051C2C] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#2251FF]" />
            Parameters & Historical Rate Versions (Point-in-Time)
          </h2>
          <p className="text-[12px] text-[#888888] mt-0.5">
            Single Source of Truth: Modifying historical rates with start/end dates ensures historical orders maintain point-in-time accuracy.
          </p>
        </div>
      </div>

      {/* Sub-tabs Selector */}
      <div className="flex items-center gap-2 bg-white p-2.5 card-elevation-sm">
        {subTabs.map((st) => (
          <button
            key={st.id}
            onClick={() => onSelectSubTab(st.id)}
            className={`px-4 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
              activeSubTab === st.id
                ? 'bg-[#051C2C] text-white'
                : 'text-[#051C2C]/70 hover:bg-[#F5F5F2]'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Tab 1: SYS_Parameters */}
      {activeSubTab === 'SYS_Parameters' && (
        <div className="bg-white p-6 card-elevation-md space-y-6">
          <div className="border-b border-[#E8E8E6] pb-3">
            <h3 className="font-heading font-bold text-lg text-[#051C2C]">
              Global Base System Parameters
            </h3>
            <p className="text-[12px] text-[#888888]">
              Central thresholds and default rates referenced dynamically across calculation models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Base Currency */}
            <div className="p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#051C2C] block">
                PAR_BASE_CURRENCY
              </label>
              <p className="text-[11px] text-[#888888]">
                Unified base target currency for all financial reporting.
              </p>
              <select
                value={store.parameters.baseCurrency}
                onChange={(e) => handleUpdateParam('baseCurrency', e.target.value as CurrencyCode)}
                className="w-full input-editable font-mono font-bold text-[14px]"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Default EU VAT */}
            <div className="p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#051C2C] block">
                PAR_DEFAULT_VAT_EU
              </label>
              <p className="text-[11px] text-[#888888]">
                Default EU VAT rate applied to reverse net revenue calculation.
              </p>
              <div className="flex items-center gap-1 font-mono font-bold text-[14px]">
                <input
                  type="number"
                  step="0.1"
                  value={(store.parameters.defaultVatEuRate * 100).toFixed(1)}
                  onChange={(e) =>
                    handleUpdateParam('defaultVatEuRate', Number(e.target.value) / 100)
                  }
                  className="w-full input-editable text-right"
                />
                <span>%</span>
              </div>
            </div>

            {/* Payment Gateway Rate */}
            <div className="p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#051C2C] block">
                PAR_DEFAULT_PAYMENT_RATE
              </label>
              <p className="text-[11px] text-[#888888]">
                Fallback processing fee percentage for unsettled payouts.
              </p>
              <div className="flex items-center gap-1 font-mono font-bold text-[14px]">
                <input
                  type="number"
                  step="0.05"
                  value={(store.parameters.defaultPaymentRate * 100).toFixed(2)}
                  onChange={(e) =>
                    handleUpdateParam('defaultPaymentRate', Number(e.target.value) / 100)
                  }
                  className="w-full input-editable text-right"
                />
                <span>%</span>
              </div>
            </div>

            {/* Payment Gateway Flat */}
            <div className="p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#051C2C] block">
                PAR_DEFAULT_PAYMENT_FLAT
              </label>
              <p className="text-[11px] text-[#888888]">
                Fallback per-transaction flat processing fee (EUR).
              </p>
              <div className="flex items-center gap-1 font-mono font-bold text-[14px]">
                <span>€</span>
                <input
                  type="number"
                  step="0.05"
                  value={store.parameters.defaultPaymentFlat.toFixed(2)}
                  onChange={(e) =>
                    handleUpdateParam('defaultPaymentFlat', Number(e.target.value))
                  }
                  className="w-full input-editable text-right"
                />
              </div>
            </div>

            {/* Rec Tolerance Amount */}
            <div className="p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#051C2C] block">
                PAR_REC_TOLERANCE_AMT
              </label>
              <p className="text-[11px] text-[#888888]">
                Absolute maximum variance tolerance before flagging discrepancy.
              </p>
              <div className="flex items-center gap-1 font-mono font-bold text-[14px]">
                <span>€</span>
                <input
                  type="number"
                  step="0.50"
                  value={store.parameters.recToleranceAmt.toFixed(2)}
                  onChange={(e) =>
                    handleUpdateParam('recToleranceAmt', Number(e.target.value))
                  }
                  className="w-full input-editable text-right"
                />
              </div>
            </div>

            {/* Shipping Fuel Surcharge */}
            <div className="p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#051C2C] block">
                PAR_SHIPPING_SURCHARGE
              </label>
              <p className="text-[11px] text-[#888888]">
                Global fuel / peak season surcharge applied to estimated shipping.
              </p>
              <div className="flex items-center gap-1 font-mono font-bold text-[14px]">
                <input
                  type="number"
                  step="0.5"
                  value={(store.parameters.shippingSurcharge * 100).toFixed(1)}
                  onChange={(e) =>
                    handleUpdateParam('shippingSurcharge', Number(e.target.value) / 100)
                  }
                  className="w-full input-editable text-right"
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SYS_Rate_History */}
      {activeSubTab === 'SYS_Rate_History' && (
        <div className="bg-white card-elevation-md overflow-hidden">
          <div className="p-4 bg-[#F5F5F2] border-b border-[#E8E8E6] flex justify-between items-center">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#051C2C] flex items-center gap-2">
                <History className="w-5 h-5 text-[#2251FF]" />
                SYS_Rate_History (Point-in-Time Effective Rate Versions)
              </h3>
              <p className="text-[12px] text-[#888888]">
                COGS, Exchange Rates, Shipping Matrices, and Platform Fee version history.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportToCsv(store.rateHistory, 'SYS_Rate_History')}
                className="px-3 py-1.5 bg-white border border-[#E8E8E6] rounded text-[12px] font-medium text-[#051C2C] flex items-center gap-1 hover:bg-gray-50"
              >
                <Download className="w-3.5 h-3.5 text-[#2251FF]" /> Export CSV
              </button>
              <button
                onClick={handleAddRateHistory}
                className="px-3 py-1.5 bg-[#2251FF] text-white rounded text-[12px] font-semibold flex items-center gap-1 hover:bg-[#1a41cc]"
              >
                <Plus className="w-4 h-4" /> Add Rate Version
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Key / SKU / Channel</th>
                  <th className="py-2.5 px-3">Start_Date</th>
                  <th className="py-2.5 px-3">End_Date</th>
                  <th className="py-2.5 px-3 text-right">Rate / Cost</th>
                  <th className="py-2.5 px-3">Currency</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {store.rateHistory.map((r) => (
                  <tr key={r.id} className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50">
                    <td className="py-1.5 px-3">
                      <select
                        value={r.type}
                        onChange={(e) => handleUpdateRateHistory(r.id, 'type', e.target.value as RateType)}
                        className="input-editable font-semibold text-[#051C2C]"
                      >
                        <option value="COGS">COGS</option>
                        <option value="FX">FX</option>
                        <option value="SHIP_RATE">SHIP_RATE</option>
                        <option value="PLATFORM_FEE">PLATFORM_FEE</option>
                      </select>
                    </td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={r.key}
                        onChange={(e) => handleUpdateRateHistory(r.id, 'key', e.target.value)}
                        className="input-editable font-mono font-bold text-[#051C2C] w-40"
                      />
                    </td>
                    <td className="py-1.5 px-3">
                      <input
                        type="date"
                        value={r.startDate}
                        onChange={(e) => handleUpdateRateHistory(r.id, 'startDate', e.target.value)}
                        className="input-editable font-mono"
                      />
                    </td>
                    <td className="py-1.5 px-3">
                      <input
                        type="date"
                        value={r.endDate}
                        onChange={(e) => handleUpdateRateHistory(r.id, 'endDate', e.target.value)}
                        className="input-editable font-mono"
                      />
                    </td>
                    <td className="py-1.5 px-3 text-right">
                      <input
                        type="number"
                        step="0.0001"
                        value={r.rateOrCost}
                        onChange={(e) => handleUpdateRateHistory(r.id, 'rateOrCost', Number(e.target.value))}
                        className="input-editable font-mono w-28 text-right font-bold text-[#2251FF]"
                      />
                    </td>
                    <td className="py-1.5 px-3">
                      <select
                        value={r.currency}
                        onChange={(e) => handleUpdateRateHistory(r.id, 'currency', e.target.value as CurrencyCode)}
                        className="input-editable font-mono"
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="DKK">DKK</option>
                      </select>
                    </td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={r.notes || ''}
                        onChange={(e) => handleUpdateRateHistory(r.id, 'notes', e.target.value)}
                        className="input-editable w-48 text-[#888888]"
                      />
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <button
                        onClick={() => handleDeleteRateHistory(r.id)}
                        className="p-1 text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: MAP_Bundle_Rules */}
      {activeSubTab === 'MAP_Bundle_Rules' && (
        <div className="bg-white card-elevation-md overflow-hidden">
          <div className="p-4 bg-[#F5F5F2] border-b border-[#E8E8E6] flex justify-between items-center">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#051C2C] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2251FF]" />
                MAP_Bundle_Rules (Bundle Unpacking & Gift Mapping Dictionary)
              </h3>
              <p className="text-[12px] text-[#888888]">
                Defines physical SKU components and cost shares for virtual bundles and free gifts.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportToCsv(store.bundleRules, 'MAP_Bundle_Rules')}
                className="px-3 py-1.5 bg-white border border-[#E8E8E6] rounded text-[12px] font-medium text-[#051C2C] flex items-center gap-1 hover:bg-gray-50"
              >
                <Download className="w-3.5 h-3.5 text-[#2251FF]" /> Export CSV
              </button>
              <button
                onClick={handleAddBundleRule}
                className="px-3 py-1.5 bg-[#2251FF] text-white rounded text-[12px] font-semibold flex items-center gap-1 hover:bg-[#1a41cc]"
              >
                <Plus className="w-4 h-4" /> Add Component Rule
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                  <th className="py-2.5 px-3">Virtual Bundle_SKU</th>
                  <th className="py-2.5 px-3">Physical Component_SKU</th>
                  <th className="py-2.5 px-3 text-right">Component_Qty</th>
                  <th className="py-2.5 px-3 text-right">Cost_Share_Pct</th>
                  <th className="py-2.5 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {store.bundleRules.map((b) => (
                  <tr key={b.id} className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50">
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={b.bundleSku}
                        onChange={(e) => handleUpdateBundleRule(b.id, 'bundleSku', e.target.value)}
                        className="input-editable font-mono font-bold text-[#051C2C] w-48"
                      />
                    </td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={b.componentSku}
                        onChange={(e) => handleUpdateBundleRule(b.id, 'componentSku', e.target.value)}
                        className="input-editable font-mono font-semibold text-[#051C2C] w-48"
                      />
                    </td>
                    <td className="py-1.5 px-3 text-right">
                      <input
                        type="number"
                        min="1"
                        value={b.componentQty}
                        onChange={(e) => handleUpdateBundleRule(b.id, 'componentQty', Number(e.target.value))}
                        className="input-editable font-mono w-20 text-right font-bold"
                      />
                    </td>
                    <td className="py-1.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1 font-mono">
                        <input
                          type="number"
                          step="0.05"
                          value={(b.costSharePct * 100).toFixed(0)}
                          onChange={(e) => handleUpdateBundleRule(b.id, 'costSharePct', Number(e.target.value) / 100)}
                          className="input-editable w-20 text-right font-bold text-[#2251FF]"
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <button
                        onClick={() => handleDeleteBundleRule(b.id)}
                        className="p-1 text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
