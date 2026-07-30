import React from 'react';
import { CalculatedShippingAudit, EngineDataStore } from '../../types';
import { StatusBadge } from '../StatusBadge';
import { InsightBlock } from '../InsightBlock';
import { Truck, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

interface ShippingAuditViewProps {
  store: EngineDataStore;
  audits: CalculatedShippingAudit[];
}

export const ShippingAuditView: React.FC<ShippingAuditViewProps> = ({ store, audits }) => {
  const tier1Count = audits.filter((a) => a.shippingTierUsed.includes('Tier 1')).length;
  const tier2Count = audits.filter((a) => a.shippingTierUsed.includes('Tier 2')).length;
  const tier4Count = audits.filter((a) => a.shippingTierUsed.includes('Tier 4')).length;
  const total = audits.length;

  const exactPct = total > 0 ? (tier1Count / total) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Banner */}
      <div className="bg-white p-5 card-elevation-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-[22px] text-[#051C2C] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#2251FF]" />
            AUD_Shipping_Tier (Shipping Fallback & Data Audit)
          </h2>
          <p className="text-[12px] text-[#888888] mt-0.5">
            4-Tier Fallback Engine: Exact 3PL Invoice → Combination Rule → Weight Tier → Channel Avg Fallback.
          </p>
        </div>
      </div>

      {/* Insight Callout */}
      {tier4Count > 0 && (
        <InsightBlock
          type="insight"
          title={`Low Trust Alert: ${tier4Count} orders relying on Channel Average estimates`}
          description={`To increase profit accuracy, upload 3PL invoices for these tracking numbers in RAW_3PL_Invoices or add SKU combination shipping rates in SYS_Rate_History.`}
        />
      )}

      {/* Tier Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1 */}
        <div className="bg-white p-5 card-elevation-sm border-t-2 border-[#00C853]">
          <div className="flex justify-between items-center text-[#888888] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Tier 1: Exact 3PL Invoice
            </span>
            <ShieldCheck className="w-4 h-4 text-[#00C853]" />
          </div>
          <div className="font-heading text-[28px] font-bold text-[#051C2C]">
            {tier1Count} <span className="text-[14px] font-sans text-[#888888]">({exactPct.toFixed(0)}%)</span>
          </div>
          <p className="text-[11px] text-[#888888] mt-1">
            Matched directly against logistics provider invoices.
          </p>
        </div>

        {/* Tier 2 */}
        <div className="bg-white p-5 card-elevation-sm border-t-2 border-[#2251FF]">
          <div className="flex justify-between items-center text-[#888888] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Tier 2: Combination Rule
            </span>
            <HelpCircle className="w-4 h-4 text-[#2251FF]" />
          </div>
          <div className="font-heading text-[28px] font-bold text-[#051C2C]">
            {tier2Count} <span className="text-[14px] font-sans text-[#888888]">({total > 0 ? ((tier2Count/total)*100).toFixed(0) : 0}%)</span>
          </div>
          <p className="text-[11px] text-[#888888] mt-1">
            Calculated using standard SKU combination shipping matrices.
          </p>
        </div>

        {/* Tier 4 */}
        <div className="bg-white p-5 card-elevation-sm border-t-2 border-[#888888]">
          <div className="flex justify-between items-center text-[#888888] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Tier 4: Channel Avg Fallback
            </span>
            <AlertCircle className="w-4 h-4 text-[#888888]" />
          </div>
          <div className="font-heading text-[28px] font-bold text-[#051C2C]">
            {tier4Count} <span className="text-[14px] font-sans text-[#888888]">({total > 0 ? ((tier4Count/total)*100).toFixed(0) : 0}%)</span>
          </div>
          <p className="text-[11px] text-[#888888] mt-1">
            Fallback estimation using channel average shipping rates.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white card-elevation-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3">Item SKUs</th>
                <th className="py-3 px-3">Shipping Tier Source</th>
                <th className="py-3 px-3 text-right">Final Shipping Cost (EUR)</th>
                <th className="py-3 px-3">Data Trust Score</th>
                <th className="py-3 px-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={a.orderId}
                    className={`border-b border-[#E8E8E6] ${isEven ? 'bg-white' : 'bg-[#F5F5F2]/60'}`}
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#051C2C]">
                      {a.orderId}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#051C2C]">{a.channel}</td>
                    <td className="py-2.5 px-3 font-mono text-[#888888]">{a.itemSkus}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge type="tier" value={a.shippingTierUsed} />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#051C2C]">
                      €{a.finalShippingCostEur.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge type="trust" value={a.dataTrustScore} />
                    </td>
                    <td className="py-2.5 px-3 text-[#888888]">{a.auditNotes}</td>
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
