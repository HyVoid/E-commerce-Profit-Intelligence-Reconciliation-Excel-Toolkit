import React, { useState } from 'react';
import { CalculatedReconciliation, EngineDataStore } from '../../types';
import { StatusBadge } from '../StatusBadge';
import { InsightBlock } from '../InsightBlock';
import { CheckCircle2, AlertTriangle, Sliders, Search, Download } from 'lucide-react';
import { exportToCsv } from '../../utils/csv';

interface ReconciliationViewProps {
  store: EngineDataStore;
  reconciliations: CalculatedReconciliation[];
  onUpdateParameters: (newParams: any) => void;
}

export const ReconciliationView: React.FC<ReconciliationViewProps> = ({
  store,
  reconciliations,
  onUpdateParameters,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'DISCREPANCY' | 'MATCHED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const matchedCount = reconciliations.filter((r) => r.recStatusFlag === 'MATCHED').length;
  const discrepancyCount = reconciliations.filter((r) => r.recStatusFlag === 'DISCREPANCY').length;

  const filtered = reconciliations.filter((r) => {
    const matchStatus = filterStatus === 'ALL' || r.recStatusFlag === filterStatus;
    const matchSearch =
      r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.channel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleExportCsv = () => {
    const exportData = filtered.map((r) => ({
      Order_ID: r.orderId,
      Order_Date: r.orderDate,
      Channel: r.channel,
      Order_Gross_EUR: r.orderGrossEur,
      Payout_Net_EUR: r.payoutNetEur,
      Payment_Diff_EUR: r.paymentDiffEur,
      Rec_Status_Flag: r.recStatusFlag,
      Notes: r.notes,
    }));
    exportToCsv(exportData, `REC_Reconciliation_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Bar */}
      <div className="bg-white p-5 card-elevation-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-[22px] text-[#051C2C] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2251FF]" />
            REC_Reconciliation (Four-Party Automated Reconciliation Center)
          </h2>
          <p className="text-[12px] text-[#888888] mt-0.5">
            Automated cross-matching between Order Receipts vs Settlement Payouts vs 3PL Invoices.
          </p>
        </div>

        {/* Dynamic Tolerance Controls */}
        <div className="flex items-center gap-4 bg-[#F5F5F2] p-2.5 rounded-lg border border-[#E8E8E6] text-[12px]">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#2251FF]" />
            <span className="font-semibold text-[#051C2C]">Max Variance:</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#888888]">Amt: €</span>
            <input
              type="number"
              step="0.5"
              value={store.parameters.recToleranceAmt}
              onChange={(e) =>
                onUpdateParameters({
                  ...store.parameters,
                  recToleranceAmt: Number(e.target.value),
                })
              }
              className="w-16 input-editable text-center font-mono font-semibold"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#888888]">Pct:</span>
            <input
              type="number"
              step="0.5"
              value={(store.parameters.recTolerancePct * 100).toFixed(1)}
              onChange={(e) =>
                onUpdateParameters({
                  ...store.parameters,
                  recTolerancePct: Number(e.target.value) / 100,
                })
              }
              className="w-14 input-editable text-center font-mono font-semibold"
            />
            <span className="text-[#888888]">%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3 card-elevation-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-[#051C2C] text-white'
                : 'text-[#051C2C]/70 hover:bg-[#F5F5F2]'
            }`}
          >
            All Orders ({reconciliations.length})
          </button>
          <button
            onClick={() => setFilterStatus('DISCREPANCY')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors flex items-center gap-1.5 ${
              filterStatus === 'DISCREPANCY'
                ? 'bg-[#D32F2F] text-white'
                : 'text-[#D32F2F] bg-[#D32F2F]/10 hover:bg-[#D32F2F]/20'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Discrepancies ({discrepancyCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('MATCHED')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
              filterStatus === 'MATCHED'
                ? 'bg-[#00C853] text-white'
                : 'text-[#008035] bg-[#00C853]/10 hover:bg-[#00C853]/20'
            }`}
          >
            Matched ({matchedCount})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-4 h-4 text-[#888888] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-editable pl-8 h-8 text-[12px]"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1 px-3 py-1.5 border border-[#E8E8E6] rounded-md text-[12px] font-semibold text-[#051C2C] hover:bg-[#F5F5F2]"
          >
            <Download className="w-3.5 h-3.5 text-[#2251FF]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Reconciliation Table */}
      <div className="bg-white card-elevation-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3 text-right">Order Gross (EUR)</th>
                <th className="py-3 px-3 text-right">Payout Net (EUR)</th>
                <th className="py-3 px-3 text-right">Variance (EUR)</th>
                <th className="py-3 px-3">Rec Status</th>
                <th className="py-3 px-3">Audit Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const isEven = idx % 2 === 0;
                const isDisc = r.recStatusFlag === 'DISCREPANCY';
                return (
                  <tr
                    key={r.orderId}
                    className={`border-b border-[#E8E8E6] ${
                      isDisc
                        ? 'bg-[#D32F2F]/[0.03]'
                        : isEven
                        ? 'bg-white'
                        : 'bg-[#F5F5F2]/60'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#051C2C]">
                      {r.orderId}
                    </td>
                    <td className="py-2.5 px-3 text-[#888888]">{r.orderDate}</td>
                    <td className="py-2.5 px-3 font-medium text-[#051C2C]">{r.channel}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      €{r.orderGrossEur.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {r.hasActualPayout ? (
                        `€${r.payoutNetEur.toFixed(2)}`
                      ) : (
                        <span className="text-[#888888] italic">Unsettled</span>
                      )}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-mono font-bold ${
                        isDisc ? 'text-[#D32F2F]' : 'text-[#008035]'
                      }`}
                    >
                      €{r.paymentDiffEur.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge type="rec" value={r.recStatusFlag} />
                    </td>
                    <td className="py-2.5 px-3 text-[#888888]">{r.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
