import React, { useState } from 'react';
import {
  EngineDataStore,
  RawOrderRow,
  RawPayoutRow,
  Raw3PLInvoiceRow,
  RawRefundRow,
  RawAdSpendRow,
  ActiveTab,
  ChannelType,
  CurrencyCode,
} from '../../types';
import { exportToCsv } from '../../utils/csv';
import { Plus, Trash2, Search, Download, Database, FileSpreadsheet } from 'lucide-react';

interface RawDataViewProps {
  store: EngineDataStore;
  activeSubTab: ActiveTab;
  onSelectSubTab: (tab: ActiveTab) => void;
  onUpdateStore: (newStore: EngineDataStore) => void;
  onOpenBulkCsv: () => void;
}

export const RawDataView: React.FC<RawDataViewProps> = ({
  store,
  activeSubTab,
  onSelectSubTab,
  onUpdateStore,
  onOpenBulkCsv,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. RAW_Orders Handlers
  const handleUpdateOrder = (id: string, field: keyof RawOrderRow, val: any) => {
    const updated = store.orders.map((o) => (o.id === id ? { ...o, [field]: val } : o));
    onUpdateStore({ ...store, orders: updated });
  };

  const handleAddOrder = () => {
    const newOrd: RawOrderRow = {
      id: `ord-user-${Date.now()}`,
      orderId: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      channel: 'Shopify',
      orderDate: new Date().toISOString().split('T')[0],
      lineSku: 'SKU-MAIN-A',
      lineQty: 1,
      lineGrossAmount: 59.99,
      originalCurrency: 'EUR',
      customerCountry: 'DE',
      paymentMethod: 'Credit Card',
    };
    onUpdateStore({ ...store, orders: [newOrd, ...store.orders] });
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('Delete this order row?')) {
      onUpdateStore({ ...store, orders: store.orders.filter((o) => o.id !== id) });
    }
  };

  // 2. RAW_Payouts Handlers
  const handleUpdatePayout = (id: string, field: keyof RawPayoutRow, val: any) => {
    const updated = store.payouts.map((p) => (p.id === id ? { ...p, [field]: val } : p));
    onUpdateStore({ ...store, payouts: updated });
  };

  const handleAddPayout = () => {
    const newPay: RawPayoutRow = {
      id: `pay-user-${Date.now()}`,
      payoutId: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: store.orders[0]?.orderId || 'ORD-2026-1001',
      payoutDate: new Date().toISOString().split('T')[0],
      actualPaymentFee: 1.50,
      netPayoutAmount: 58.49,
    };
    onUpdateStore({ ...store, payouts: [newPay, ...store.payouts] });
  };

  const handleDeletePayout = (id: string) => {
    onUpdateStore({ ...store, payouts: store.payouts.filter((p) => p.id !== id) });
  };

  // 3. RAW_3PL_Invoices Handlers
  const handleUpdate3PL = (id: string, field: keyof Raw3PLInvoiceRow, val: any) => {
    const updated = store.invoices3PL.map((inv) => (inv.id === id ? { ...inv, [field]: val } : inv));
    onUpdateStore({ ...store, invoices3PL: updated });
  };

  const handleAdd3PL = () => {
    const newInv: Raw3PLInvoiceRow = {
      id: `inv-user-${Date.now()}`,
      trackingNo: `TRK-DHL-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: store.orders[0]?.orderId || 'ORD-2026-1001',
      actualShippingFee: 4.80,
      packagingFee: 0.60,
    };
    onUpdateStore({ ...store, invoices3PL: [newInv, ...store.invoices3PL] });
  };

  const handleDelete3PL = (id: string) => {
    onUpdateStore({ ...store, invoices3PL: store.invoices3PL.filter((i) => i.id !== id) });
  };

  // 4. RAW_Refunds Handlers
  const handleUpdateRefund = (id: string, field: keyof RawRefundRow, val: any) => {
    const updated = store.refunds.map((r) => (r.id === id ? { ...r, [field]: val } : r));
    onUpdateStore({ ...store, refunds: updated });
  };

  const handleAddRefund = () => {
    const newRef: RawRefundRow = {
      id: `ref-user-${Date.now()}`,
      refundId: `RFD-${Math.floor(1000 + Math.random() * 9000)}`,
      originalOrderId: store.orders[0]?.orderId || 'ORD-2026-1001',
      refundDate: new Date().toISOString().split('T')[0],
      refundAmountGross: 59.99,
    };
    onUpdateStore({ ...store, refunds: [newRef, ...store.refunds] });
  };

  const handleDeleteRefund = (id: string) => {
    onUpdateStore({ ...store, refunds: store.refunds.filter((r) => r.id !== id) });
  };

  // 5. RAW_AdSpend Handlers
  const handleUpdateAdSpend = (id: string, field: keyof RawAdSpendRow, val: any) => {
    const updated = store.adSpend.map((a) => (a.id === id ? { ...a, [field]: val } : a));
    onUpdateStore({ ...store, adSpend: updated });
  };

  const handleAddAdSpend = () => {
    const newAd: RawAdSpendRow = {
      id: `ad-user-${Date.now()}`,
      spendDate: new Date().toISOString().split('T')[0],
      channel: 'Meta Ads',
      dailySpendAmount: 45.00,
      currency: 'EUR',
    };
    onUpdateStore({ ...store, adSpend: [newAd, ...store.adSpend] });
  };

  const handleDeleteAdSpend = (id: string) => {
    onUpdateStore({ ...store, adSpend: store.adSpend.filter((a) => a.id !== id) });
  };

  // Sub tab rendering logic
  const subTabs: { id: ActiveTab; label: string; count: number }[] = [
    { id: 'RAW_Orders', label: 'RAW_Orders', count: store.orders.length },
    { id: 'RAW_Payouts', label: 'RAW_Payouts', count: store.payouts.length },
    { id: 'RAW_3PL_Invoices', label: 'RAW_3PL_Invoices', count: store.invoices3PL.length },
    { id: 'RAW_Refunds', label: 'RAW_Refunds', count: store.refunds.length },
    { id: 'RAW_AdSpend', label: 'RAW_AdSpend', count: store.adSpend.length },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Bar */}
      <div className="bg-white p-5 card-elevation-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-[22px] text-[#051C2C] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#2251FF]" />
            Raw Ingestion Tables (Editable Inputs)
          </h2>
          <p className="text-[12px] text-[#888888] mt-0.5">
            Cells highlighted in yellow (<span className="bg-[#FFFDE7] px-1 font-mono text-[#051C2C] border border-amber-200">#FFFDE7</span>) are editable. Any change propagates instantly across the entire calculation engine.
          </p>
        </div>

        <button
          onClick={onOpenBulkCsv}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#2251FF] text-white rounded-md font-semibold text-[12px] hover:bg-[#1a41cc] shadow-xs shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Bulk CSV Import</span>
        </button>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center justify-between bg-white p-2.5 card-elevation-sm">
        <div className="flex items-center gap-1">
          {subTabs.map((st) => (
            <button
              key={st.id}
              onClick={() => onSelectSubTab(st.id)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors flex items-center gap-1.5 ${
                activeSubTab === st.id
                  ? 'bg-[#051C2C] text-white'
                  : 'text-[#051C2C]/70 hover:bg-[#F5F5F2]'
              }`}
            >
              <span>{st.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                activeSubTab === st.id ? 'bg-white/20 text-white' : 'bg-[#E8E8E6] text-[#051C2C]'
              }`}>
                {st.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-56">
          <Search className="w-4 h-4 text-[#888888] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search rows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full input-editable pl-8 h-8 text-[12px]"
          />
        </div>
      </div>

      {/* Active Table Content */}
      <div className="bg-white card-elevation-md overflow-hidden">
        {/* Table 1: RAW_Orders */}
        {activeSubTab === 'RAW_Orders' && (
          <div>
            <div className="p-3 bg-[#F5F5F2] border-b border-[#E8E8E6] flex justify-between items-center">
              <span className="font-semibold text-[#051C2C] text-[12px]">
                RAW_Orders ({store.orders.length} total rows)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCsv(store.orders, 'RAW_Orders')}
                  className="px-2.5 py-1 bg-white border border-[#E8E8E6] rounded text-[11px] font-medium text-[#051C2C] hover:bg-gray-50 flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-[#2251FF]" /> Export CSV
                </button>
                <button
                  onClick={handleAddOrder}
                  className="px-2.5 py-1 bg-[#2251FF] text-white rounded text-[11px] font-medium flex items-center gap-1 hover:bg-[#1a41cc]"
                >
                  <Plus className="w-3 h-3" /> Add Row
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                    <th className="py-2.5 px-3">Order_ID</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">Order_Date</th>
                    <th className="py-2.5 px-3">Line_SKU</th>
                    <th className="py-2.5 px-3 text-right">Line_Qty</th>
                    <th className="py-2.5 px-3 text-right">Gross_Amount</th>
                    <th className="py-2.5 px-3">CCY</th>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Payment_Method</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {store.orders
                    .filter((o) =>
                      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      o.lineSku.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((o) => (
                      <tr key={o.id} className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50">
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={o.orderId}
                            onChange={(e) => handleUpdateOrder(o.id, 'orderId', e.target.value)}
                            className="input-editable font-mono font-medium text-[#051C2C] w-32"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <select
                            value={o.channel}
                            onChange={(e) => handleUpdateOrder(o.id, 'channel', e.target.value as ChannelType)}
                            className="input-editable font-medium text-[#051C2C]"
                          >
                            <option value="Shopify">Shopify</option>
                            <option value="Amazon">Amazon</option>
                            <option value="bol.com">bol.com</option>
                            <option value="TikTok Shop">TikTok Shop</option>
                          </select>
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="date"
                            value={o.orderDate}
                            onChange={(e) => handleUpdateOrder(o.id, 'orderDate', e.target.value)}
                            className="input-editable font-mono text-[#051C2C]"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={o.lineSku}
                            onChange={(e) => handleUpdateOrder(o.id, 'lineSku', e.target.value)}
                            className="input-editable font-mono font-semibold text-[#051C2C] w-36"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          <input
                            type="number"
                            min="1"
                            value={o.lineQty}
                            onChange={(e) => handleUpdateOrder(o.id, 'lineQty', Number(e.target.value))}
                            className="input-editable font-mono w-16 text-right"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={o.lineGrossAmount}
                            onChange={(e) => handleUpdateOrder(o.id, 'lineGrossAmount', Number(e.target.value))}
                            className="input-editable font-mono w-24 text-right font-semibold"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <select
                            value={o.originalCurrency}
                            onChange={(e) => handleUpdateOrder(o.id, 'originalCurrency', e.target.value as CurrencyCode)}
                            className="input-editable font-mono"
                          >
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                            <option value="DKK">DKK</option>
                          </select>
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={o.customerCountry}
                            onChange={(e) => handleUpdateOrder(o.id, 'customerCountry', e.target.value)}
                            className="input-editable font-mono w-14 text-center uppercase"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={o.paymentMethod}
                            onChange={(e) => handleUpdateOrder(o.id, 'paymentMethod', e.target.value)}
                            className="input-editable w-28"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <button
                            onClick={() => handleDeleteOrder(o.id)}
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

        {/* Table 2: RAW_Payouts */}
        {activeSubTab === 'RAW_Payouts' && (
          <div>
            <div className="p-3 bg-[#F5F5F2] border-b border-[#E8E8E6] flex justify-between items-center">
              <span className="font-semibold text-[#051C2C] text-[12px]">
                RAW_Payouts ({store.payouts.length} rows)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCsv(store.payouts, 'RAW_Payouts')}
                  className="px-2.5 py-1 bg-white border border-[#E8E8E6] rounded text-[11px] font-medium text-[#051C2C] hover:bg-gray-50 flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-[#2251FF]" /> Export CSV
                </button>
                <button
                  onClick={handleAddPayout}
                  className="px-2.5 py-1 bg-[#2251FF] text-white rounded text-[11px] font-medium flex items-center gap-1 hover:bg-[#1a41cc]"
                >
                  <Plus className="w-3 h-3" /> Add Row
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                    <th className="py-2.5 px-3">Payout_ID</th>
                    <th className="py-2.5 px-3">Order_ID</th>
                    <th className="py-2.5 px-3">Payout_Date</th>
                    <th className="py-2.5 px-3 text-right">Actual_Payment_Fee (EUR)</th>
                    <th className="py-2.5 px-3 text-right">Net_Payout_Amount (EUR)</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {store.payouts
                    .filter((p) => p.orderId.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50">
                        <td className="py-1.5 px-3">
                          <input
                            type="text"
                            value={p.payoutId}
                            onChange={(e) => handleUpdatePayout(p.id, 'payoutId', e.target.value)}
                            className="input-editable font-mono font-medium text-[#051C2C]"
                          />
                        </td>
                        <td className="py-1.5 px-3">
                          <input
                            type="text"
                            value={p.orderId}
                            onChange={(e) => handleUpdatePayout(p.id, 'orderId', e.target.value)}
                            className="input-editable font-mono font-semibold text-[#051C2C]"
                          />
                        </td>
                        <td className="py-1.5 px-3">
                          <input
                            type="date"
                            value={p.payoutDate}
                            onChange={(e) => handleUpdatePayout(p.id, 'payoutDate', e.target.value)}
                            className="input-editable font-mono"
                          />
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={p.actualPaymentFee}
                            onChange={(e) => handleUpdatePayout(p.id, 'actualPaymentFee', Number(e.target.value))}
                            className="input-editable font-mono w-28 text-right text-[#D32F2F]"
                          />
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={p.netPayoutAmount}
                            onChange={(e) => handleUpdatePayout(p.id, 'netPayoutAmount', Number(e.target.value))}
                            className="input-editable font-mono w-28 text-right font-semibold text-[#008035]"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <button
                            onClick={() => handleDeletePayout(p.id)}
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

        {/* Table 3: RAW_3PL_Invoices */}
        {activeSubTab === 'RAW_3PL_Invoices' && (
          <div>
            <div className="p-3 bg-[#F5F5F2] border-b border-[#E8E8E6] flex justify-between items-center">
              <span className="font-semibold text-[#051C2C] text-[12px]">
                RAW_3PL_Invoices ({store.invoices3PL.length} rows)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCsv(store.invoices3PL, 'RAW_3PL_Invoices')}
                  className="px-2.5 py-1 bg-white border border-[#E8E8E6] rounded text-[11px] font-medium text-[#051C2C] hover:bg-gray-50 flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-[#2251FF]" /> Export CSV
                </button>
                <button
                  onClick={handleAdd3PL}
                  className="px-2.5 py-1 bg-[#2251FF] text-white rounded text-[11px] font-medium flex items-center gap-1 hover:bg-[#1a41cc]"
                >
                  <Plus className="w-3 h-3" /> Add Row
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                    <th className="py-2.5 px-3">Tracking_No</th>
                    <th className="py-2.5 px-3">Order_ID</th>
                    <th className="py-2.5 px-3 text-right">Actual_Shipping_Fee (EUR)</th>
                    <th className="py-2.5 px-3 text-right">Packaging_Fee (EUR)</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {store.invoices3PL.map((inv) => (
                    <tr key={inv.id} className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50">
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={inv.trackingNo}
                          onChange={(e) => handleUpdate3PL(inv.id, 'trackingNo', e.target.value)}
                          className="input-editable font-mono font-medium text-[#051C2C]"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={inv.orderId}
                          onChange={(e) => handleUpdate3PL(inv.id, 'orderId', e.target.value)}
                          className="input-editable font-mono font-semibold text-[#051C2C]"
                        />
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={inv.actualShippingFee}
                          onChange={(e) => handleUpdate3PL(inv.id, 'actualShippingFee', Number(e.target.value))}
                          className="input-editable font-mono w-28 text-right font-semibold text-[#2251FF]"
                        />
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={inv.packagingFee}
                          onChange={(e) => handleUpdate3PL(inv.id, 'packagingFee', Number(e.target.value))}
                          className="input-editable font-mono w-24 text-right"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <button
                          onClick={() => handleDelete3PL(inv.id)}
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

        {/* Table 4: RAW_Refunds */}
        {activeSubTab === 'RAW_Refunds' && (
          <div>
            <div className="p-3 bg-[#F5F5F2] border-b border-[#E8E8E6] flex justify-between items-center">
              <span className="font-semibold text-[#051C2C] text-[12px]">
                RAW_Refunds ({store.refunds.length} rows)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCsv(store.refunds, 'RAW_Refunds')}
                  className="px-2.5 py-1 bg-white border border-[#E8E8E6] rounded text-[11px] font-medium text-[#051C2C] hover:bg-gray-50 flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-[#2251FF]" /> Export CSV
                </button>
                <button
                  onClick={handleAddRefund}
                  className="px-2.5 py-1 bg-[#2251FF] text-white rounded text-[11px] font-medium flex items-center gap-1 hover:bg-[#1a41cc]"
                >
                  <Plus className="w-3 h-3" /> Add Row
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                    <th className="py-2.5 px-3">Refund_ID</th>
                    <th className="py-2.5 px-3">Original_Order_ID</th>
                    <th className="py-2.5 px-3">Refund_Date</th>
                    <th className="py-2.5 px-3 text-right">Refund_Amount_Gross (Orig CCY)</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {store.refunds.map((r) => (
                    <tr key={r.id} className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50">
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={r.refundId}
                          onChange={(e) => handleUpdateRefund(r.id, 'refundId', e.target.value)}
                          className="input-editable font-mono font-medium text-[#051C2C]"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={r.originalOrderId}
                          onChange={(e) => handleUpdateRefund(r.id, 'originalOrderId', e.target.value)}
                          className="input-editable font-mono font-semibold text-[#051C2C]"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="date"
                          value={r.refundDate}
                          onChange={(e) => handleUpdateRefund(r.id, 'refundDate', e.target.value)}
                          className="input-editable font-mono"
                        />
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={r.refundAmountGross}
                          onChange={(e) => handleUpdateRefund(r.id, 'refundAmountGross', Number(e.target.value))}
                          className="input-editable font-mono w-28 text-right font-bold text-[#D32F2F]"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <button
                          onClick={() => handleDeleteRefund(r.id)}
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

        {/* Table 5: RAW_AdSpend */}
        {activeSubTab === 'RAW_AdSpend' && (
          <div>
            <div className="p-3 bg-[#F5F5F2] border-b border-[#E8E8E6] flex justify-between items-center">
              <span className="font-semibold text-[#051C2C] text-[12px]">
                RAW_AdSpend ({store.adSpend.length} rows)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCsv(store.adSpend, 'RAW_AdSpend')}
                  className="px-2.5 py-1 bg-white border border-[#E8E8E6] rounded text-[11px] font-medium text-[#051C2C] hover:bg-gray-50 flex items-center gap-1"
                >
                  <Download className="w-3 h-3 text-[#2251FF]" /> Export CSV
                </button>
                <button
                  onClick={handleAddAdSpend}
                  className="px-2.5 py-1 bg-[#2251FF] text-white rounded text-[11px] font-medium flex items-center gap-1 hover:bg-[#1a41cc]"
                >
                  <Plus className="w-3 h-3" /> Add Row
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                    <th className="py-2.5 px-3">Spend_Date</th>
                    <th className="py-2.5 px-3">Ad_Channel</th>
                    <th className="py-2.5 px-3 text-right">Daily_Spend_Amount</th>
                    <th className="py-2.5 px-3">Currency</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {store.adSpend.map((a) => (
                    <tr key={a.id} className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50">
                      <td className="py-1.5 px-3">
                        <input
                          type="date"
                          value={a.spendDate}
                          onChange={(e) => handleUpdateAdSpend(a.id, 'spendDate', e.target.value)}
                          className="input-editable font-mono"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <input
                          type="text"
                          value={a.channel}
                          onChange={(e) => handleUpdateAdSpend(a.id, 'channel', e.target.value)}
                          className="input-editable font-medium text-[#051C2C]"
                        />
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={a.dailySpendAmount}
                          onChange={(e) => handleUpdateAdSpend(a.id, 'dailySpendAmount', Number(e.target.value))}
                          className="input-editable font-mono w-28 text-right font-semibold text-[#2251FF]"
                        />
                      </td>
                      <td className="py-1.5 px-3">
                        <select
                          value={a.currency}
                          onChange={(e) => handleUpdateAdSpend(a.id, 'currency', e.target.value as CurrencyCode)}
                          className="input-editable font-mono"
                        >
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <button
                          onClick={() => handleDeleteAdSpend(a.id)}
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
    </div>
  );
};
